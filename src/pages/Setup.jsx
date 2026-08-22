import { useState } from 'react'

const inp = { width:'100%', padding:'13px 16px', borderRadius:10, border:'2px solid #ffe0c0', fontSize:15, outline:'none', fontFamily:'inherit', color:'#1a1a2e', background:'#fff' }

export default function Setup({ onComplete }) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [key, setKey] = useState('')
  const [test, setTest] = useState(null)

  const testConn = async () => {
    if (!key.trim()) { setTest({ error: 'Nhập key trước nhé!' }); return }
    setTest('testing')
    const call = (m) => fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key.trim()}`,
      { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ contents:[{role:'user',parts:[{text:'OK'}]}], generationConfig:{thinkingConfig:{thinkingBudget:0}} }) })
    try {
      let res = await call('gemini-2.5-flash'), lite = false
      if (res.status === 429) { res = await call('gemini-2.5-flash-lite'); lite = true }
      if (!res.ok) {
        const e = await res.json().catch(()=>({}))
        const msg = e.error?.message || `Lỗi ${res.status}`
        if (res.status === 429) setTest({ error: 'Hết lượt — đợi vài phút thử lại.' })
        else if (res.status === 400) setTest({ error: `Key không hợp lệ: ${msg}` })
        else if (res.status === 403) setTest({ error: `Key bị từ chối quyền: ${msg}` })
        else setTest({ error: msg })
        return
      }
      const d = await res.json()
      d.candidates?.[0]?.content?.parts?.[0]?.text
        ? setTest(lite ? 'ok-lite' : 'ok')
        : setTest({ error: 'Phản hồi trống — thử lại.' })
    } catch(e) { setTest({ error: `Lỗi mạng: ${e.message}` }) }
  }

  return (
    <div style={{ minHeight:'100dvh', display:'flex', alignItems:'center', justifyContent:'center', padding:20, background:'var(--bg)' }}>
      <div style={{ width:'100%', maxWidth:420, background:'var(--surface)', borderRadius:20, padding:28, boxShadow:'var(--shlg)' }}>
        <div style={{ textAlign:'center', marginBottom:26 }}>
          <div style={{ fontSize:56, marginBottom:10 }}>🎬</div>
          <h1 style={{ fontFamily:"'Baloo 2'", fontSize:24, fontWeight:800, color:'var(--primary)', marginBottom:5 }}>Xưởng Phim Hoạt Hình</h1>
          <p style={{ fontSize:13, color:'var(--text2)' }}>Hành trình 20 ngày làm bộ phim đầu tiên</p>
        </div>

        {step === 1 && (
          <>
            <p style={{ fontSize:11, fontWeight:800, color:'var(--text3)', letterSpacing:1, textTransform:'uppercase', marginBottom:6 }}>Bước 1 / 2</p>
            <h2 style={{ fontSize:18, fontWeight:800, marginBottom:5 }}>Tên em là gì? 👋</h2>
            <p style={{ fontSize:13, color:'var(--text2)', marginBottom:14 }}>Anh Đô La sẽ gọi tên em trong suốt hành trình làm phim!</p>
            <input style={inp} placeholder="VD: Dâu, An, Bình..." value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key==='Enter' && name.trim() && setStep(2)}
              onFocus={e => e.target.style.borderColor='var(--primary)'}
              onBlur={e => e.target.style.borderColor='#ffe0c0'} autoFocus />
            <button onClick={() => name.trim() && setStep(2)}
              style={{ width:'100%', marginTop:14, padding:14, background:'var(--primary)', color:'#fff', borderRadius:10, fontSize:15, fontWeight:800, opacity:name.trim()?1:.4 }}>
              Tiếp theo →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p style={{ fontSize:11, fontWeight:800, color:'var(--text3)', letterSpacing:1, textTransform:'uppercase', marginBottom:6 }}>Bước 2 / 2</p>
            <h2 style={{ fontSize:18, fontWeight:800, marginBottom:5 }}>Nhập Gemini API Key 🔑</h2>
            <p style={{ fontSize:13, color:'var(--text2)', marginBottom:4 }}>
              Lấy miễn phí tại <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color:'var(--primary)' }}>aistudio.google.com</a>
            </p>
            <p style={{ fontSize:12, color:'var(--text3)', marginBottom:12 }}>🔒 Key chỉ lưu trên máy — không gửi đi đâu ngoài Google AI.</p>
            <input type="password" style={{ ...inp, fontFamily:'monospace', fontSize:13 }} placeholder="AIzaSy..."
              value={key} onChange={e => { setKey(e.target.value); setTest(null) }}
              onFocus={e => e.target.style.borderColor='var(--primary)'}
              onBlur={e => e.target.style.borderColor='#ffe0c0'} autoFocus />

            <button onClick={testConn} disabled={test==='testing'}
              style={{ width:'100%', marginTop:10, padding:11, background:'#f8f0ea', border:'1.5px solid #ffe0c0', borderRadius:10, fontSize:13, fontWeight:800, color:'var(--text2)' }}>
              {test==='testing' ? '⏳ Đang kiểm tra...' : '🔌 Kiểm tra kết nối'}
            </button>
            {test==='ok' && <div style={{ marginTop:10, padding:'10px 14px', background:'var(--green-lt)', border:'1px solid #a7f3d0', borderRadius:10, fontSize:13, color:'var(--green)', fontWeight:700 }}>✅ Key hoạt động! Sẵn sàng bắt đầu.</div>}
            {test==='ok-lite' && <div style={{ marginTop:10, padding:'10px 14px', background:'var(--amber-lt)', border:'1px solid #fde68a', borderRadius:10, fontSize:13, color:'var(--amber)', fontWeight:700 }}>✅ Key hoạt động (qua model dự phòng).</div>}
            {test && typeof test==='object' && <div style={{ marginTop:10, padding:'10px 14px', background:'var(--rose-lt)', border:'1px solid #fecdd3', borderRadius:10, fontSize:13, color:'var(--rose)' }}>❌ {test.error}</div>}

            <p style={{ fontSize:12, color:'var(--text3)', marginTop:10, marginBottom:8 }}>Có thể nhập sau trong Cài đặt.</p>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setStep(1)} style={{ flex:1, padding:13, background:'var(--surface2)', borderRadius:10, fontSize:14, fontWeight:700, color:'var(--text2)', border:'1.5px solid var(--border)' }}>← Quay lại</button>
              <button onClick={() => onComplete({ childName:name.trim(), apiKey:key.trim() })}
                style={{ flex:2, padding:13, background:'var(--primary)', color:'#fff', borderRadius:10, fontSize:15, fontWeight:800 }}>
                Bắt đầu làm phim! 🎬
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
