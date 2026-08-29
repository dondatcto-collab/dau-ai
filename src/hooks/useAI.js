import { useState, useCallback, useRef } from 'react'

const PRIMARY = 'gemini-2.5-flash'
const FALLBACK = 'gemini-2.5-flash-lite'
const STORAGE_KEY = 'animation-studio-v1'

const PHASE_MODE = {
  1: 'CHẾ ĐỘ KHÁM PHÁ: tạo tò mò, cho em dự đoán rồi thử. Không sáng tạo thay em.',
  2: 'CHẾ ĐỘ THÁM TỬ: hỏi ngược về động cơ, cảm xúc và điểm chưa hợp lý. Không viết kịch bản thay em.',
  3: 'CHẾ ĐỘ PHÒNG THÍ NGHIỆM: hướng dẫn kỹ thuật theo từng nấc, ưu tiên để em tự thử và sửa.',
  4: 'CHẾ ĐỘ ĐẠO DIỄN: em quyết định; anh phản biện nhẹ, nhắc an toàn và chỉ hỗ trợ khi em yêu cầu.',
}

const PHASE_GREETING = {
  1: (n) => `Chào em ${n}! Anh Đô La đây 🎬 Hôm nay mình tiếp tục dự án của em nhé. Anh sẽ nhớ những điều em đã chốt trước đó và không bắt em làm lại. Em muốn bắt đầu từ phần nào hôm nay?`,
  2: (n) => `Em ${n} ơi! Anh Đô La đây 📋 Mình tiếp tục câu chuyện của em nhé. Những gì em đã quyết định ở các buổi trước vẫn được giữ nguyên. Hôm nay em muốn làm phần nào tiếp theo?`,
  3: (n) => `Em ${n}! Anh Đô La đây 🎬 Giờ mình tập trung biến ý tưởng của em thành sản phẩm. Anh chỉ hỗ trợ kỹ thuật hoặc góp ý khi em cần. Em đang muốn xử lý phần nào?`,
  4: (n) => `Em ${n} ơi 🌟 Em là đạo diễn. Anh sẽ nghe, ghi nhớ và chỉ hỗ trợ đúng phần em yêu cầu. Hôm nay em muốn hoàn thành điều gì?`,
}

const safeParseLocalState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const cleanExcerpt = (text, max = 180) => String(text || '')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, max)

const buildMemoryContext = (currentDayTitle = '') => {
  const state = safeParseLocalState()
  if (!state?.chatHistories) return 'Chưa có ghi nhớ từ các buổi trước.'

  const entries = Object.entries(state.chatHistories)
    .flatMap(([day, messages]) => (messages || []).map((m, index) => ({ day, index, ...m })))
    .filter(m => m.role === 'user' && cleanExcerpt(m.content).length > 1)

  if (!entries.length) return 'Chưa có ghi nhớ từ các buổi trước.'

  const preferencePattern = /(không cần|đừng|không muốn|em tự|em vẽ|em làm|đã làm xong|làm xong hết|đã nói|hỏi rồi|quên|không hiểu|em thích|phong cách|tên là|nhân vật|cốt truyện|tập\s*\d+|ai không|ai chỉ)/i
  const correctionPattern = /(không phải|sai|lộn|quên|hỏi rồi|nói rồi|đã nói|không đúng|đừng có|không bao giờ|không hiểu)/i

  const important = entries
    .filter(m => preferencePattern.test(m.content || ''))
    .slice(-18)

  const recent = entries.slice(-10)
  const merged = [...important, ...recent]
  const seen = new Set()
  const unique = merged.filter(m => {
    const key = `${m.day}:${cleanExcerpt(m.content, 120)}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }).slice(-22)

  const corrections = entries.filter(m => correctionPattern.test(m.content || '')).slice(-8)

  const memoryLines = unique.map(m => `• Ngày ${m.day}: "${cleanExcerpt(m.content)}"`)
  const correctionLines = corrections.map(m => `• "${cleanExcerpt(m.content)}"`)

  return `
GHI NHỚ TỪ CÁC BUỔI TRƯỚC — đây là dữ liệu thật của em, phải tôn trọng:
${memoryLines.join('\n') || '• Chưa có ghi nhớ rõ.'}

NHỮNG LẦN EM ĐÃ SỬA/ĐẶT GIỚI HẠN CHO ĐÔ LA:
${correctionLines.join('\n') || '• Chưa có.'}

QUY TẮC DÙNG GHI NHỚ:
• Không hỏi lại điều đã có câu trả lời rõ trong phần trên.
• Nếu giáo án mâu thuẫn với quyết định đã chốt của em, quyết định của em được ưu tiên.
• Nếu em đã nói em tự làm một phần, không tiếp tục đề nghị AI làm thay phần đó.
• Nếu có điểm chưa chắc do câu em viết nhanh hoặc gõ nhầm, hỏi xác nhận MỘT câu ngắn; không tự suy diễn.
• Chủ đề hiện tại là "${currentDayTitle}" nhưng được phép linh hoạt để nối tiếp dự án thật của em.
`.trim()
}

const buildSystem = (childName, phase, dayTitle, activities, currentAct) => `
Anh là Đô La — người anh đồng hành vui tính của em ${childName || ''} (10 tuổi). Mục tiêu là làm em THÍCH khám phá AI, giữ quyền sở hữu ý tưởng và ngày càng tự lập.

Chủ đề hôm nay: "${dayTitle}".
${PHASE_MODE[phase] || PHASE_MODE[1]}

NHIỆM VỤ GỢI Ý CỦA GIÁO ÁN:
${activities.map((a,i)=>`[${i+1}] ${a}`).join('\n')}
Đang ở hoạt động ${currentAct}/${activities.length}.

${buildMemoryContext(dayTitle)}

THỨ TỰ ƯU TIÊN BẮT BUỘC:
1. Ý tưởng, phong cách và quyết định đã chốt của em.
2. Mục tiêu giáo dục của buổi học.
3. Nhiệm vụ trong giáo án.
Giáo án là khung gợi ý, KHÔNG phải mệnh lệnh. Có thể đổi cách làm để phù hợp với dự án thật của em mà vẫn giữ mục tiêu học.

CÁCH DẠY PHÙ HỢP VỚI EM:
• Em thích hài hước, tò mò, tranh luận và bắt lỗi AI. Có thể dùng trò "Bắt lỗi Đô La" khi tự nhiên.
• Không lặp câu hỏi em đã trả lời. Nếu em nhắc "anh hỏi rồi" hoặc "em nói rồi", nhận lỗi trong 1 câu và DÙNG THÔNG TIN CŨ để đi tiếp; không bắt em kể lại.
• Không tâng bốc chung chung. Chỉ khen hành vi có bằng chứng: tự thử, tự vẽ, sửa lỗi, giữ quan điểm, kiên trì, giải thích được lý do.
• Mỗi lượt thường 2-4 câu ngắn, tiếng Việt tự nhiên, dễ hiểu. Không bắt buộc kết thúc bằng câu hỏi.
• Mặc định 100% tiếng Việt. Chỉ dùng tiếng Anh khi em chủ động yêu cầu; nếu có thuật ngữ tiếng Anh bắt buộc thì giải nghĩa tiếng Việt ngay.
• Không dùng khuôn mẫu giới. Khuyến khích tự tin, tử tế, độc lập, khoa học, sáng tạo và biết bảo vệ mình.
• Khi em nói "được rồi", "không cần nói thêm", "bye" hoặc tương tự: dừng đúng lúc, không kéo dài bằng thêm nhiều câu hỏi.

QUYỀN SỞ HỮU SÁNG TẠO CỦA EM:
• Ý tưởng, nhân vật, cốt truyện, tranh vẽ và phong cách của em thuộc về em.
• Nếu em muốn tự vẽ/tự viết/tự dựng, AI không được đề nghị làm thay lần nữa trong cùng dự án, trừ khi em chủ động đổi ý.
• Khi nhiệm vụ giáo án yêu cầu "nhờ AI vẽ" nhưng em đã chọn tự vẽ, chuyển mục tiêu sang một hoạt động tương đương như: xem sản phẩm em gửi, hỏi em giải thích lựa chọn, kiểm tra tính nhất quán, góp ý kỹ thuật nếu em yêu cầu, hoặc giúp sắp xếp quy trình.
• Không ép em dùng AI cho mọi khâu. Một bài học tốt có thể là nhận ra việc nào NÊN và KHÔNG NÊN giao cho AI.

TRUNG THỰC VỀ KHẢ NĂNG — QUY TẮC TRUTH-01:
• Chat này KHÔNG có công cụ tự tạo ảnh, âm thanh hay video. Anh chỉ có thể phân tích ảnh/âm thanh/video mà em thật sự gửi vào chat.
• Tuyệt đối không nói "anh đã tạo", "Gemini đang vẽ", "đã vẽ xong", "anh sẽ chèn ảnh", "đây là ảnh anh tạo" nếu hệ thống chưa thật sự trả về media.
• Không bịa mô tả về một ảnh/video/audio chưa tồn tại hoặc chưa được gửi.
• Chỉ nói "anh thấy/nghe" khi lượt hiện tại thật sự có media gửi kèm hoặc media đó còn tồn tại trong ngữ cảnh đang xử lý.
• Nếu không thực hiện được một việc, nói ngắn gọn: "Phần này anh chưa làm trực tiếp trong chat được" rồi đưa phương án thật sự làm được.

KHI NHẬN ẢNH/ÂM THANH/VIDEO:
• Nếu em đã nói rõ muốn anh xem/nghe điều gì, đi thẳng vào mục tiêu đó; không hỏi lại.
• Với ảnh: nhận xét dựa trên điều thật sự thấy; nếu chưa rõ chi tiết thì nói chưa chắc, không đoán thành sự thật.
• Với âm thanh: góp ý độ rõ, tốc độ, cảm xúc, tiếng ồn và mức phù hợp với nhân vật khi em yêu cầu.
• Với video: góp ý câu chuyện, cảnh, nhịp, chữ, âm thanh và kỹ thuật làm phim khi em yêu cầu.
• Không nhận xét ngoại hình người thật theo kiểu chấm đẹp/xấu.
• Không yêu cầu thêm ảnh cá nhân, giấy tờ, địa chỉ, trường học hay thông tin riêng tư.

CHU TRÌNH HỌC: em có ý tưởng → em thử → quan sát → em tự đánh giá → anh hỗ trợ đúng chỗ → em quyết định có cải tiến hay không.
Chỉ gieo MỘT hạt giống giáo dục mỗi buổi: tự tin, cảm xúc, tình bạn, kiên trì, tài chính cơ bản, khoa học, môi trường, sức khỏe, an toàn mạng, quyền riêng tư, chống bắt nạt hoặc tự bảo vệ. Lồng tự nhiên, không giảng đạo đức.

THANG HỖ TRỢ — luôn dùng mức thấp nhất đủ giúp em:
0. Lắng nghe / để em tự làm.
1. Hỏi một câu định hướng.
2. Cho một manh mối.
3. Hướng dẫn từng bước khi em yêu cầu.
4. Làm mẫu MỘT phần rồi để em hoàn thành.
Không đưa sản phẩm sáng tạo hoàn chỉnh thay em.

AI LITERACY — giúp em tự nhận ra AI có giới hạn: có thể sai, có thể quên nếu không có ngữ cảnh, không phải việc nào cũng nên giao cho AI, và con người giữ quyền quyết định cuối cùng.

AN TOÀN:
• Không yêu cầu em cung cấp họ tên đầy đủ, trường, địa chỉ, số điện thoại, mật khẩu, ảnh riêng tư hay thông tin nhận dạng.
• Nếu nhiệm vụ cần tài khoản/đăng công khai/mua hàng, bảo em nhờ bố mẹ.
• Không khuyến khích trò chuyện riêng với người lạ hoặc công khai dữ liệu cá nhân.

KHI EM BÁO XONG: nếu cần phản tư, chỉ hỏi MỘT câu phù hợp; nếu em đã muốn dừng thì kết thúc ngắn gọn.
`.trim()

const buildReportPrompt = (childName, dayTitle, activities) => `
Dựa trên cuộc trò chuyện vừa rồi giữa anh Đô La và em ${childName}, hãy viết báo cáo ngắn cho phụ huynh.
Không đánh đồng số lượt chat với mức phụ thuộc. Phân biệt rõ: em xin trợ giúp, Đô La tự gợi ý, và em sửa/bắt lỗi Đô La.

🎬 Báo cáo buổi làm phim — ${dayTitle}

✅ Kết quả: [mô tả những gì thực sự hoàn thành; không bịa số hoạt động]
💡 Sản phẩm/ý tưởng em tạo ra hôm nay: [mô tả cụ thể]
🧠 Mức tự chủ: [A/B/C/D] + 1 bằng chứng cụ thể
🔍 Phản biện AI: [bằng chứng cụ thể nếu có]
🤖 Hiểu AI: [1 điều em thực sự thể hiện qua hành vi]
❤️ Năng lực sống nổi bật: [1 điểm + bằng chứng]
🌟 Sáng tạo nổi bật: [chi tiết do chính em tạo]
⚠️ Đô La cần sửa: [nếu có hiểu nhầm/lặp/ép giáo án]
➡️ Buổi sau: [1 điều nên tăng/giảm để hợp cách học của em]

Mốc tham khảo của giáo án có ${activities.length} hoạt động, nhưng chỉ ghi hoàn thành khi hội thoại có bằng chứng.
Viết bằng tiếng Việt, cụ thể, không tâng bốc, phụ huynh đọc trong khoảng 30-45 giây.
`.trim()

const attachmentLabel = (attachment) => {
  if (!attachment) return ''
  if (attachment.kind === 'image') return `[Em đã gửi ảnh: ${attachment.name}]`
  if (attachment.kind === 'audio') return `[Em đã gửi âm thanh: ${attachment.name}]`
  if (attachment.kind === 'video') return `[Em đã gửi video: ${attachment.name}]`
  return `[Em đã gửi tệp: ${attachment.name}]`
}

const toGeminiContent = (message) => {
  const parts = []
  const text = (message.content || '').trim()
  const label = attachmentLabel(message.attachment)
  if (text || label) parts.push({ text: text || label })
  if (message.attachment?.dataBase64 && message.attachment?.mimeType) {
    parts.push({
      inlineData: {
        mimeType: message.attachment.mimeType,
        data: message.attachment.dataBase64,
      }
    })
  }
  return {
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: parts.length ? parts : [{ text: '...' }],
  }
}

export function useAI(apiKey) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [reportLoading, setReportLoading] = useState(false)
  const [error, setError] = useState(null)
  const hints = useRef(0)
  const isLoadingRef = useRef(false)

  const callAPI = useCallback(async (model, key, systemText, contents, maxTokens = 500) => {
    return fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemText }] },
          contents,
          generationConfig: { maxOutputTokens: maxTokens, temperature: 0.72, thinkingConfig: { thinkingBudget: 0 } },
        })
      }
    )
  }, [])

  const callWithFallback = useCallback(async (systemText, contents, maxTokens = 500) => {
    let res = await callAPI(PRIMARY, apiKey, systemText, contents, maxTokens)
    let usedFallback = false
    let modelUsed = PRIMARY
    if (res.status === 429) {
      await new Promise(r => setTimeout(r, 800))
      const fb = await callAPI(FALLBACK, apiKey, systemText, contents, maxTokens)
      if (fb.ok) {
        res = fb
        usedFallback = true
        modelUsed = FALLBACK
      }
    }
    return { res, usedFallback, modelUsed }
  }, [apiKey, callAPI])

  const startSession = useCallback((dayTitle, phase, childName, savedHistory) => {
    hints.current = 0
    if (savedHistory && savedHistory.length > 0) {
      setMessages(savedHistory)
    } else {
      setMessages([{ role: 'assistant', content: (PHASE_GREETING[phase] || PHASE_GREETING[1])(childName) }])
    }
    setError(null)
  }, [])

  const sendMessage = useCallback(async (text, dayTitle, phase, childName, activities, currentActivity, onSave, attachment = null) => {
    if (!apiKey) {
      setError('Cần nhập Gemini API key — vào tab Phụ huynh → Cài đặt.')
      return
    }
    const cleanText = (text || '').trim()
    if ((!cleanText && !attachment) || isLoadingRef.current) return
    isLoadingRef.current = true

    const userMsg = { role: 'user', content: cleanText, ...(attachment ? { attachment } : {}) }
    const next = [...messages, userMsg]
    setMessages(next)

    if (onSave) {
      const safeAttachment = attachment ? {
        kind: attachment.kind,
        name: attachment.name,
        mimeType: attachment.mimeType,
        size: attachment.size,
      } : null
      onSave({
        role: 'user',
        content: cleanText || attachmentLabel(attachment),
        ...(safeAttachment ? { attachment: safeAttachment } : {})
      })
    }

    setLoading(true)
    setError(null)
    hints.current += 1

    const systemText = buildSystem(childName, phase, dayTitle, activities || [], currentActivity || 1)
    const contents = next.map(toGeminiContent)

    try {
      const { res, usedFallback, modelUsed } = await callWithFallback(systemText, contents)
      if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        const msg = e.error?.message || ''
        if (res.status === 429) throw new Error('Hết lượt miễn phí Gemini — đợi vài phút rồi thử lại.')
        if (res.status === 403) throw new Error('API key bị từ chối quyền. Nhờ bố/mẹ kiểm tra lại cài đặt.')
        if (res.status === 400) throw new Error(msg || 'Ảnh/âm thanh/video hoặc API key chưa hợp lệ. Em thử file nhỏ hơn hoặc nhờ bố/mẹ kiểm tra nhé.')
        throw new Error(msg || `Lỗi ${res.status}`)
      }

      const data = await res.json()
      const candidate = data.candidates?.[0]
      let aiText = candidate?.content?.parts?.map(p => p.text || '').join('').trim() || ''
      if (!aiText) aiText = 'Anh chưa có câu trả lời rõ cho phần này. Em nói lại ngắn hơn một chút nhé.'

      const aiMsg = {
        role: 'assistant',
        content: aiText,
        meta: { modelUsed, fallbackUsed: usedFallback }
      }
      setMessages(prev => [...prev, aiMsg])
      if (onSave) onSave(aiMsg)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
      isLoadingRef.current = false
    }
  }, [apiKey, messages, callWithFallback])

  const generateReport = useCallback(async (childName, dayTitle, activities, onDone) => {
    if (!apiKey || messages.length < 2) return
    setReportLoading(true)
    try {
      const systemText = buildReportPrompt(childName, dayTitle, activities)
      const chatSummary = messages.map(m => {
        const who = m.role === 'user' ? `Em ${childName}` : 'Đô La'
        const media = m.attachment ? ` ${attachmentLabel(m.attachment)}` : ''
        return `${who}: ${(m.content || '').trim()}${media}`
      }).join('\n')
      const contents = [{ role: 'user', parts: [{ text: `Cuộc trò chuyện:\n\n${chatSummary}\n\nViết báo cáo theo yêu cầu.` }] }]
      const { res } = await callWithFallback(systemText, contents, 650)
      if (!res.ok) return
      const data = await res.json()
      const report = data.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('').trim() || ''
      if (report && onDone) onDone(report)
    } catch (e) {
      console.error('generateReport:', e)
    } finally {
      setReportLoading(false)
    }
  }, [apiKey, messages, callWithFallback])

  const clearChat = useCallback(() => {
    setMessages([])
    setError(null)
    hints.current = 0
  }, [])

  return {
    messages,
    loading,
    reportLoading,
    error,
    hintCount: hints.current,
    startSession,
    sendMessage,
    generateReport,
    clearChat,
    setMessages,
  }
}
