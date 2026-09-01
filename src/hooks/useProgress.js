import { useState, useCallback } from 'react'

const KEY = 'animation-studio-v1'
const METRIC_VERSION = 3

const emptyProfile = () => ({
  curiosity: 0,
  independence: 0,
  criticalThinking: 0,
  creativity: 0,
  persistence: 0,
  aiLiteracy: 0,
})

const emptyEvidence = () => ({
  curiosity: [],
  independence: [],
  criticalThinking: [],
  creativity: [],
  persistence: [],
  aiLiteracy: [],
})

const fresh = () => ({
  childName: '',
  apiKey: '',
  completedDays: [],
  streak: 0,
  lastActiveDate: null,
  sessions: {},
  activityProgress: {},
  chatHistories: {},
  journalEntries: {},
  autoReports: {},
  badges: [],
  filmTitle: '',
  filmLogline: '',
  learnerProfile: emptyProfile(),
  learnerEvidence: emptyEvidence(),
  learnerEvidenceArchive: {},
  metricVersion: METRIC_VERSION,
})

const normalizeText = (text) => String(text || '').replace(/\s+/g, ' ').trim()

const addEvidence = (bucket, key, text) => {
  const clean = normalizeText(text).slice(0, 240)
  if (!clean) return
  const existing = bucket[key] || []
  if (existing.includes(clean)) return
  bucket[key] = [...existing, clean].slice(-20)
}

// Điểm chỉ là tín hiệu xu hướng, không phải điểm thi.
// Đường cong chậm giúp tránh việc vài câu chat làm mọi năng lực chạm 10 quá sớm.
const scoreFromEvidence = (evidence) => {
  const score = {}
  Object.keys(emptyProfile()).forEach(key => {
    const count = (evidence[key] || []).length
    const curved = 10 * (1 - Math.exp(-count / 7))
    score[key] = Math.min(10, Math.round(curved))
  })
  return score
}

const extractEvidenceFromText = (text, evidence) => {
  const t = normalizeText(text)
  if (!t) return evidence

  const next = {
    ...emptyEvidence(),
    ...Object.fromEntries(Object.entries(evidence || {}).map(([k, v]) => [k, Array.isArray(v) ? [...v] : []]))
  }

  if (/[?？]|\b(tại sao|vì sao|sao|ủa|có thể|nếu|thế nào|vậy thì)\b/i.test(t)) {
    addEvidence(next, 'curiosity', t)
  }

  if (/(em tự|em vẽ|em làm|em đã làm|làm xong|em nghĩ|không cần ai|không cần AI|khỏi cần|để em tự|em sẽ tự|không cần thêm|em làm vậy là được)/i.test(t)) {
    addEvidence(next, 'independence', t)
  }

  if (/(không phải|sai|lộn|quên|hỏi rồi|nói rồi|đã nói|không đúng|đừng có|không bao giờ|anh hiểu sai|anh nói tiếng anh|em không hiểu|đâu phải|chứ không phải)/i.test(t)) {
    addEvidence(next, 'criticalThinking', t)
  }

  if (/(em vẽ|em nghĩ|câu chuyện|cốt truyện|nhân vật|phim|tập\s*\d+|phong cách|em kể|em làm đến|poster|tranh|video)/i.test(t)) {
    addEvidence(next, 'creativity', t)
  }

  // Kiên trì được nhận diện cả khi bé phải sửa AI nhiều lần, giải thích lại,
  // thử lại hoặc vẫn tiếp tục sau một hiểu nhầm.
  if (/(để em.*lại|em trả lời lại|em ghi lại|em nói lại|em giải thích|thử lại|làm lại|tiếp tiếp|tiếp tục|em sửa|anh lại|lần nữa|ghi lộn|nói lộn|gõ lộn|đâu phải|không phải)/i.test(t)) {
    addEvidence(next, 'persistence', t)
  }

  if (/(AI|Gemini|Đô La).*(sai|không|vẽ|làm|quên|hiểu|không chịu)|không cần AI|AI chỉ|không nhờ AI|AI làm việc khác|đừng có nhờ.*AI/i.test(t)) {
    addEvidence(next, 'aiLiteracy', t)
  }

  return next
}

const deriveEvidenceFromHistories = (chatHistories) => {
  let evidence = emptyEvidence()

  Object.values(chatHistories || {}).forEach(messages => {
    ;(messages || [])
      .filter(m => m.role === 'user')
      .forEach(m => { evidence = extractEvidenceFromText(m.content, evidence) })
  })

  return evidence
}

const normalizeSessions = (sessions, activityProgress) => {
  const nextSessions = { ...(sessions || {}) }

  Object.entries(nextSessions).forEach(([dayId, session]) => {
    if (!session || typeof session !== 'object') return
    const hasFormalProgress = Array.isArray(activityProgress?.[dayId]?.completed)
      && activityProgress[dayId].completed.length > 0

    // Các bản cũ ghi 0 hoạt động dù bé đã học bằng chat vì chưa bấm nút xác nhận.
    // Không xóa số cũ: chuyển nó sang legacyActivitiesDone để giữ dấu vết,
    // còn activitiesDone=null để giao diện không tuyên bố sai "0/3".
    if (session.activitiesDone === 0 && !hasFormalProgress && session.activitiesTracked !== true) {
      nextSessions[dayId] = {
        ...session,
        legacyActivitiesDone: session.legacyActivitiesDone ?? 0,
        activitiesDone: null,
        activitiesTracked: false,
      }
    } else if (hasFormalProgress) {
      nextSessions[dayId] = {
        ...session,
        activitiesTracked: true,
      }
    }
  })

  return nextSessions
}

const migrate = (parsed) => {
  const base = fresh()
  const merged = {
    ...base,
    ...(parsed || {}),
    learnerProfile: { ...base.learnerProfile, ...(parsed?.learnerProfile || {}) },
    learnerEvidence: { ...base.learnerEvidence, ...(parsed?.learnerEvidence || {}) },
    learnerEvidenceArchive: { ...(parsed?.learnerEvidenceArchive || {}) },
  }

  merged.sessions = normalizeSessions(merged.sessions, merged.activityProgress)

  if ((parsed?.metricVersion || 0) < METRIC_VERSION) {
    // Giữ nguyên bằng chứng của bản cũ để có thể đối chiếu, không vứt bỏ giá trị đã học.
    if (parsed?.learnerEvidence && Object.keys(parsed.learnerEvidence).length) {
      merged.learnerEvidenceArchive = {
        ...merged.learnerEvidenceArchive,
        [`v${parsed.metricVersion || 1}`]: parsed.learnerEvidence,
      }
    }

    // Tính lại từ nguồn gốc đáng tin nhất: toàn bộ lời bé trong lịch sử chat.
    const evidence = deriveEvidenceFromHistories(merged.chatHistories)
    merged.learnerEvidence = evidence
    merged.learnerProfile = scoreFromEvidence(evidence)
    merged.metricVersion = METRIC_VERSION
  }

  return merged
}

const load = () => {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? migrate(JSON.parse(raw)) : fresh()
  } catch {
    return fresh()
  }
}

const save = (state) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {}
}

export function useProgress() {
  const [state, setState] = useState(load)

  const update = useCallback((patch) => {
    setState(prev => {
      const next = migrate({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) })
      save(next)
      return next
    })
  }, [])

  const completeDay = useCallback((dayId, sessionData = {}) => {
    setState(prev => {
      if (prev.completedDays.includes(dayId)) return prev

      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      const streak = prev.lastActiveDate === yesterday
        ? prev.streak + 1
        : prev.lastActiveDate === today
          ? prev.streak
          : 1

      const BADGES = { 5:'phase1', 10:'phase2', 15:'phase3', 20:'director' }
      const newCount = prev.completedDays.length + 1
      const newBadge = BADGES[newCount]
      const badges = newBadge && !prev.badges.includes(newBadge)
        ? [...prev.badges, newBadge]
        : prev.badges

      const formalCompleted = prev.activityProgress?.[dayId]?.completed || []
      const hasFormalProgress = Array.isArray(formalCompleted) && formalCompleted.length > 0
      const safeActivitiesDone = hasFormalProgress
        ? formalCompleted.length
        : (sessionData.activitiesDone > 0 ? sessionData.activitiesDone : null)

      const next = {
        ...prev,
        completedDays: [...prev.completedDays, dayId],
        sessions: {
          ...prev.sessions,
          [dayId]: {
            ...sessionData,
            activitiesDone: safeActivitiesDone,
            activitiesTracked: safeActivitiesDone != null,
            completedAt: new Date().toISOString(),
          }
        },
        streak,
        lastActiveDate: today,
        badges,
      }
      save(next)
      return next
    })
  }, [])

  const saveActivityProgress = useCallback((dayId, data) => {
    setState(prev => {
      const next = {
        ...prev,
        activityProgress: {
          ...prev.activityProgress,
          [dayId]: { ...(prev.activityProgress[dayId] || {}), ...data }
        }
      }
      save(next)
      return next
    })
  }, [])

  const saveChatMessage = useCallback((dayId, msg) => {
    setState(prev => {
      const hist = prev.chatHistories[dayId] || []
      let learnerEvidence = prev.learnerEvidence || emptyEvidence()
      let learnerProfile = prev.learnerProfile || emptyProfile()

      if (msg.role === 'user') {
        learnerEvidence = extractEvidenceFromText(msg.content, learnerEvidence)
        learnerProfile = scoreFromEvidence(learnerEvidence)
      }

      const next = {
        ...prev,
        chatHistories: {
          ...prev.chatHistories,
          [dayId]: [...hist, { ...msg, ts: new Date().toISOString() }]
        },
        learnerEvidence,
        learnerProfile,
        metricVersion: METRIC_VERSION,
      }
      save(next)
      return next
    })
  }, [])

  const saveJournal = useCallback((dayId, text) => {
    setState(prev => {
      const next = {
        ...prev,
        journalEntries: {
          ...prev.journalEntries,
          [dayId]: { text, savedAt: new Date().toISOString() }
        }
      }
      save(next)
      return next
    })
  }, [])

  const saveAutoReport = useCallback((dayId, content) => {
    setState(prev => {
      const next = {
        ...prev,
        autoReports: {
          ...prev.autoReports,
          [dayId]: { content, createdAt: new Date().toISOString() }
        }
      }
      save(next)
      return next
    })
  }, [])

  const exportData = useCallback((currentState) => {
    const { apiKey, ...safeState } = currentState
    const blob = new Blob([JSON.stringify(safeState, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `animation-studio-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const resetAll = useCallback(() => {
    const next = fresh()
    save(next)
    setState(next)
  }, [])

  return {
    state,
    update,
    completeDay,
    saveActivityProgress,
    saveChatMessage,
    saveJournal,
    saveAutoReport,
    exportData,
    resetAll,
  }
}
