import { useState, useCallback, useRef } from 'react'

const PRIMARY = 'gemini-2.5-flash'
const FALLBACK = 'gemini-2.5-flash-lite'

// ─── SYSTEM PROMPT THEO PHASE ────────────────────────────────────────────────
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
        method: 'POST', headers: { 'Content-Type': 'application/json' },
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

  const sendMessage = useCallback(async (text, dayTitle, phase, childName, activities, currentActivity, onSave) => {
    if (!apiKey) { setError('Cần nhập Gemini API key — vào tab Phụ huynh → Cài đặt.'); return }
    if (!text.trim() || isLoadingRef.current) return
    isLoadingRef.current = true

    const userMsg = { role: 'user', content: text.trim() }
    const next = [...messages, userMsg]
    setMessages(next)
    if (onSave) onSave(userMsg)
    setLoading(true); setError(null)
    hints.current += 1

    const systemText = buildSystem(childName, phase, dayTitle, activities || [], currentActivity || 1)
    const contents = next.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }))

    try {
      const { res, usedFallback } = await callWithFallback(systemText, contents)
      if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        const msg = e.error?.message || ''
        if (res.status === 429) throw new Error('Hết lượt miễn phí Gemini — đợi vài phút rồi thử lại.')
        if (res.status === 403) throw new Error('API key bị từ chối quyền. Kiểm tra tại aistudio.google.com.')
        if (res.status === 400) throw new Error('API key không hợp lệ. Kiểm tra lại trong Cài đặt.')
        throw new Error(msg || `Lỗi ${res.status}`)
      }
      const data = await res.json()
      const candidate = data.candidates?.[0]
      let aiText = candidate?.content?.parts?.[0]?.text || ''
      if (!aiText.trim()) { aiText = 'Anh chưa nghĩ ra câu trả lời. Em hỏi lại được không? 🤔' }
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
      const chatSummary = messages.map(m => `${m.role === 'user' ? `Em ${childName}` : 'Đô La'}: ${m.content}`).join('\n')
      const contents = [{ role: 'user', parts: [{ text: `Cuộc trò chuyện:\n\n${chatSummary}\n\nViết báo cáo theo yêu cầu.` }] }]
      const { res } = await callWithFallback(systemText, contents, 600)
      if (!res.ok) return
      const data = await res.json()
      const report = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      if (report && onDone) onDone(report)
    } catch (e) { console.error('generateReport:', e) }
    finally { setReportLoading(false) }
  }, [apiKey, messages, callWithFallback])

  const clearChat = useCallback(() => { setMessages([]); setError(null); hints.current = 0 }, [])

  return { messages, loading, reportLoading, error, hintCount: hints.current, startSession, sendMessage, generateReport, clearChat, setMessages }
}
