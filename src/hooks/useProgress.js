import { useState, useCallback } from 'react'

const KEY = 'animation-studio-v1'

const fresh = () => ({
  childName: '', apiKey: '',
  completedDays: [], streak: 0, lastActiveDate: null,
  sessions: {}, activityProgress: {},
  chatHistories: {}, journalEntries: {}, autoReports: {},
  badges: [], filmTitle: '', filmLogline: '',
  learnerProfile: { curiosity:0, independence:0, criticalThinking:0, creativity:0, persistence:0, aiLiteracy:0 },
})

const load = () => {
  try {
    const r = localStorage.getItem(KEY)
    return r ? { ...fresh(), ...JSON.parse(r) } : fresh()
  } catch { return fresh() }
}

const save = (s) => { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch {} }

export function useProgress() {
  const [state, setState] = useState(load)

  const update = useCallback((patch) => {
    setState(prev => {
      const next = { ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }
      save(next); return next
    })
  }, [])

  const completeDay = useCallback((dayId, sessionData = {}) => {
    setState(prev => {
      if (prev.completedDays.includes(dayId)) return prev
      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      const streak = prev.lastActiveDate === yesterday ? prev.streak + 1
        : prev.lastActiveDate === today ? prev.streak : 1
      const BADGES = { 5:'phase1', 10:'phase2', 15:'phase3', 20:'director' }
      const newCount = prev.completedDays.length + 1
      const newBadge = BADGES[newCount]
      const badges = newBadge && !prev.badges.includes(newBadge)
        ? [...prev.badges, newBadge] : prev.badges
      const next = {
        ...prev,
        completedDays: [...prev.completedDays, dayId],
        sessions: { ...prev.sessions, [dayId]: { ...sessionData, completedAt: new Date().toISOString() } },
        streak, lastActiveDate: today, badges,
      }
      save(next); return next
    })
  }, [])

  const saveActivityProgress = useCallback((dayId, data) => {
    setState(prev => {
      const next = { ...prev, activityProgress: { ...prev.activityProgress, [dayId]: { ...(prev.activityProgress[dayId]||{}), ...data } } }
      save(next); return next
    })
  }, [])

  const saveChatMessage = useCallback((dayId, msg) => {
    setState(prev => {
      const hist = prev.chatHistories[dayId] || []
      const next = { ...prev, chatHistories: { ...prev.chatHistories, [dayId]: [...hist, { ...msg, ts: new Date().toISOString() }] } }
      save(next); return next
    })
  }, [])

  const saveJournal = useCallback((dayId, text) => {
    setState(prev => {
      const next = { ...prev, journalEntries: { ...prev.journalEntries, [dayId]: { text, savedAt: new Date().toISOString() } } }
      save(next); return next
    })
  }, [])

  const saveAutoReport = useCallback((dayId, content) => {
    setState(prev => {
      const next = { ...prev, autoReports: { ...prev.autoReports, [dayId]: { content, createdAt: new Date().toISOString() } } }
      save(next); return next
    })
  }, [])

  const exportData = useCallback((s) => {
    // Không đưa khóa API vào file sao lưu của trẻ.
    const { apiKey, ...safeState } = s
    const blob = new Blob([JSON.stringify(safeState, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `animation-studio-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click(); URL.revokeObjectURL(url)
  }, [])

  const resetAll = useCallback(() => { const s = fresh(); save(s); setState(s) }, [])

  return { state, update, completeDay, saveActivityProgress, saveChatMessage, saveJournal, saveAutoReport, exportData, resetAll }
}
