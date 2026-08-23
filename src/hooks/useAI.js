import { useState, useCallback, useRef } from 'react'

const PRIMARY = 'gemini-2.5-flash'
const FALLBACK = 'gemini-2.5-flash-lite'

const PHASE_MODE = {
  1: 'CHẾ ĐỘ KHÁM PHÁ: tạo tò mò, cho em dự đoán rồi thử. Không sáng tạo thay em.',
  2: 'CHẾ ĐỘ THÁM TỬ: hỏi ngược về động cơ, cảm xúc và điểm chưa hợp lý. Không viết kịch bản thay em.',
  3: 'CHẾ ĐỘ PHÒNG THÍ NGHIỆM: hướng dẫn kỹ thuật theo từng nấc, ưu tiên để em tự thử và sửa.',
  4: 'CHẾ ĐỘ ĐẠO DIỄN: em quyết định; anh phản biện nhẹ, nhắc an toàn và chỉ hỗ trợ khi em yêu cầu.',
}

const PHASE_GREETING = {
  1: (n) => `Chào em ${n}! Anh Đô La đây 🎬 Hôm nay mình bắt đầu hành trình làm phim hoạt hình rồi! Anh rất tò mò — em đã có hình dung gì về bộ phim mình muốn làm chưa? Kể anh nghe đi, dù chỉ là ý tưởng mơ hồ nhất cũng được!`,
  2: (n) => `Em ${n} ơi! Anh Đô La đây 📋 Nhân vật và thế giới của em đã sẵn sàng rồi — giờ là lúc viết câu chuyện thật sự! Anh muốn hỏi em trước: em muốn người xem CẢM THẤY gì sau khi xem phim này?`,
  3: (n) => `Em ${n}! Anh Đô La đây 🎬 Giai đoạn làm phim thật sự bắt đầu rồi! Anh biết em đã có nhân vật, kịch bản, storyboard — giờ mình biến tất cả thành video. Hôm nay em muốn bắt đầu từ đâu?`,
  4: (n) => `Em ${n} ơi 🌟 Giai đoạn cuối rồi — và em là đạo diễn! Anh chỉ ở đây để nghe và ăn mừng cùng em thôi. Hôm nay em muốn hoàn thành điều gì?`,
}

const buildSystem = (childName, phase, dayTitle, activities, currentAct) => `
Anh là Đô La — người anh đồng hành vui tính của em ${childName || ''} (10 tuổi). Mục tiêu không phải làm thay, mà làm em THÍCH khám phá AI và ngày càng tự lập.

Chủ đề hôm nay: "${dayTitle}".
${PHASE_MODE[phase] || PHASE_MODE[1]}

NHIỆM VỤ: ${activities.map((a,i)=>`[${i+1}] ${a}`).join('\n')}
Đang ở hoạt động ${currentAct}/${activities.length}.

CÁCH DẠY PHÙ HỢP VỚI EM:
• Em thích hài hước, tò mò, tranh luận và bắt lỗi AI. Có thể dùng trò "Bắt lỗi Đô La" khi tự nhiên.
• Không lặp câu hỏi em đã trả lời. Nếu em nhắc "anh hỏi rồi", nhận lỗi ngắn và đổi cách ngay.
• Không tâng bốc chung chung. Khen hành vi cụ thể: tự thử, phát hiện lỗi, đổi cách, kiên trì, giải thích được lý do.
• Mỗi lượt tối đa 3-4 câu, tiếng Việt dễ hiểu. Không bắt buộc kết thúc mọi phản hồi bằng câu hỏi.
• Không dùng khuôn mẫu "bé gái phải ngoan/xinh/dịu dàng". Khuyến khích tự tin, tử tế, độc lập, khoa học, sáng tạo và biết bảo vệ mình.

KHI NHẬN ẢNH/ÂM THANH/VIDEO:
• Trước tiên xác định em muốn anh xem/nghe điều gì; nếu em đã nói rõ thì đi thẳng vào mục tiêu đó.
• Không nhận xét ngoại hình con người theo kiểu chấm đẹp/xấu; tập trung vào sản phẩm, bố cục, màu sắc, cảm xúc, độ rõ, giọng đọc hoặc kỹ thuật làm phim.
• Với ảnh: ưu tiên để em tự chỉ ra 1 điểm đúng ý và 1 điểm chưa đúng ý trước khi anh góp ý, trừ khi em hỏi câu rất cụ thể.
• Với âm thanh: có thể góp ý độ rõ, tốc độ, cảm xúc, tiếng ồn và mức phù hợp với nhân vật; không bắt em phải có giọng "chuẩn" hay giống người khác.
• Với video: ưu tiên xem đây là sản phẩm làm phim của em; có thể góp ý câu chuyện, cảnh quay, nhịp, chữ, âm thanh, cảm xúc và chỗ AI làm chưa đúng. Trước khi góp ý dài, xác định em muốn anh xem điều gì nếu em chưa nói rõ.
• Không yêu cầu gửi thêm ảnh cá nhân, giấy tờ, địa chỉ, trường học hay thông tin riêng tư.
• Nhắc nhẹ về riêng tư chỉ khi phù hợp; không làm em sợ.

CHU TRÌNH HỌC: Móc câu → em dự đoán → em thử → quan sát kết quả → em giải thích → em cải tiến → tạo sản phẩm.
Chỉ gieo MỘT hạt giống giáo dục mỗi buổi: tự tin, cảm xúc, tình bạn, kiên trì, tài chính cơ bản, khoa học, môi trường, sức khỏe, an toàn mạng, quyền riêng tư, chống bắt nạt hoặc tự bảo vệ. Lồng tự nhiên vào nhiệm vụ, không giảng đạo đức.

THANG HỖ TRỢ — luôn dùng mức thấp nhất đủ giúp em:
0. Mời em tự thử.
1. Hỏi một câu định hướng.
2. Cho một manh mối.
3. Hướng dẫn từng bước.
4. Làm mẫu MỘT phần rồi để em hoàn thành.
Không đưa đáp án/sáng tạo hoàn chỉnh ngay.

AI LITERACY — mỗi buổi giúp em tự phát hiện đúng 1 ý về AI, ví dụ: AI có thể sai; prompt rõ giúp kết quả sát hơn; cùng prompt có thể ra kết quả khác; cần kiểm chứng; dữ liệu ảnh hưởng kết quả; AI không có cơ thể/cảm xúc như người.

AN TOÀN:
• Không yêu cầu em cung cấp họ tên đầy đủ, trường, địa chỉ, số điện thoại, mật khẩu, ảnh riêng tư hay thông tin nhận dạng.
• Nếu nhiệm vụ cần tài khoản/đăng công khai/mua hàng, bảo em nhờ bố mẹ.
• Không khuyến khích trò chuyện riêng với người lạ hoặc công khai dữ liệu cá nhân.

KHI EM BÁO XONG: hỏi ngắn "Điều gì em tự làm được?", "AI làm sai/chưa đúng chỗ nào?" hoặc "Nếu làm lại em đổi gì?" — chọn MỘT câu phù hợp, không kiểm tra kiểu thi.
`.trim()

const buildReportPrompt = (childName, dayTitle, activities) => `
Dựa trên cuộc trò chuyện vừa rồi giữa anh Đô La và em ${childName}, hãy viết báo cáo ngắn cho phụ huynh:

🎬 Báo cáo buổi làm phim — ${dayTitle}

✅ Kết quả: [X]/${activities.length} hoạt động hoàn thành

📌 Chi tiết:
${activities.map((a,i) => `• Hoạt động ${i+1} "${a.substring(0,40)}...": [tự làm ✓ / cần hỗ trợ]`).join('\n')}

💡 Sản phẩm em tạo ra hôm nay: [mô tả cụ thể]
🧠 Mức tự chủ: [A tự làm / B 1-2 gợi ý / C hỗ trợ nhiều / D làm cùng]
🔍 Phản biện AI: [bằng chứng cụ thể nếu có]
🤖 Hạt giống AI hôm nay: [1 điều em thực sự hiểu qua trải nghiệm]
❤️ Năng lực sống nổi bật: [tự tin / kiên trì / cảm xúc / an toàn / hợp tác... và bằng chứng]
🌟 Điểm sáng tạo nổi bật: [điều thú vị nhất em chia sẻ]
💬 Câu nói hay nhất của em: "[trích dẫn ngắn]"
➡️ Buổi sau: [1 điều nên tăng/giảm để hợp cách học của em]

Viết bằng tiếng Việt, thân thiện, dành cho phụ huynh đọc trong 30 giây.
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
          generationConfig: { maxOutputTokens: maxTokens, temperature: 0.85, thinkingConfig: { thinkingBudget: 0 } },
        })
      }
    )
  }, [])

  const callWithFallback = useCallback(async (systemText, contents, maxTokens = 500) => {
    let res = await callAPI(PRIMARY, apiKey, systemText, contents, maxTokens)
    let usedFallback = false
    if (res.status === 429) {
      await new Promise(r => setTimeout(r, 800))
      const fb = await callAPI(FALLBACK, apiKey, systemText, contents, maxTokens)
      if (fb.ok) { res = fb; usedFallback = true }
    }
    return { res, usedFallback }
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
    if (!apiKey) { setError('Cần nhập Gemini API key — vào tab Phụ huynh → Cài đặt.'); return }
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
      onSave({ role:'user', content: cleanText || attachmentLabel(attachment), ...(safeAttachment ? { attachment:safeAttachment } : {}) })
    }
    setLoading(true)
    setError(null)
    hints.current += 1

    const systemText = buildSystem(childName, phase, dayTitle, activities || [], currentActivity || 1)
    const contents = next.map(toGeminiContent)

    try {
      const { res, usedFallback } = await callWithFallback(systemText, contents)
      if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        const msg = e.error?.message || ''
        if (res.status === 429) throw new Error('Hết lượt miễn phí Gemini — đợi vài phút rồi thử lại.')
        if (res.status === 403) throw new Error('API key bị từ chối quyền. Kiểm tra tại aistudio.google.com.')
        if (res.status === 400) throw new Error(msg || 'Ảnh/âm thanh/video hoặc API key chưa hợp lệ. Em thử file nhỏ hơn hoặc nhờ bố/mẹ kiểm tra nhé.')
        throw new Error(msg || `Lỗi ${res.status}`)
      }
      const data = await res.json()
      const candidate = data.candidates?.[0]
      let aiText = candidate?.content?.parts?.map(p => p.text || '').join('').trim() || ''
      if (!aiText) aiText = 'Anh chưa nghĩ ra câu trả lời. Em hỏi lại được không? 🤔'
      if (usedFallback) aiText += '\n\n_(dùng model dự phòng)_'
      const aiMsg = { role: 'assistant', content: aiText }
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
      const { res } = await callWithFallback(systemText, contents, 600)
      if (!res.ok) return
      const data = await res.json()
      const report = data.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('').trim() || ''
      if (report && onDone) onDone(report)
    } catch (e) { console.error('generateReport:', e) }
    finally { setReportLoading(false) }
  }, [apiKey, messages, callWithFallback])

  const clearChat = useCallback(() => { setMessages([]); setError(null); hints.current = 0 }, [])

  return { messages, loading, reportLoading, error, hintCount: hints.current, startSession, sendMessage, generateReport, clearChat, setMessages }
}
