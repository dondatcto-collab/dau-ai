import { useState } from 'react'
import { DAYS, PHASES } from '../data/curriculum'

const BADGES = {
  phase1:   { emoji:'🎭', label:'Nhà Sáng Tạo',       day:5  },
  phase2:   { emoji:'📋', label:'Nhà Biên Kịch',       day:10 },
  phase3:   { emoji:'🎬', label:'Đạo Diễn Nhí',        day:15 },
  director: { emoji:'⭐', label:'Đạo Diễn Chính Thức', day:20 },
}

export default function Dashboard({ state, onUpdate, onReset, onExport }) {
  const [tab, setTab] = useState('overview')
  const [expandedDay, setExpandedDay] = useState(null)
  const [newKey, setNewKey] = useState(state.apiKey || '')
  const [newName, setNewName] = useState(state.childName || '')
  const [saved, setSaved] = useState(false)
  const [testStatus, setTestStatus] = useState(null)

  const { childName, completedDays=[], streak=0, sessions={}, journalEntries={}, autoReports={}, chatHistories={}, badges=[] } = state
  const pct = Math.round(completedDays.length / 20 * 100)
  const reportCount = Object.keys(autoReports).length
  const journalCount = Object.keys(journalEntries).length

  const saveSettings = () => {
    onUpdate({ apiKey:newKey.trim(), childName:newName.trim()||childName })
    setSaved(true); setTimeout(()=>setSaved(false),2000)
  }

  const testConn = async () => {
    if (!newKey.trim()) { setTestStatus({error:'Nhập key trước.'}); return }
    setTestStatus('testing')
    const call=(m)=>fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${newKey.trim()}`,
      {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{role:'user',parts:[{text:'OK'}]}],generationConfig:{thinkingConfig:{thinkingBudget:0}}})})
    try {
      let res=await call('gemini-2.5-flash'),lite=false
      if(res.status===429){res=await call('gemini-2.5-flash-lite');lite=true}
      if(!res.ok){const e=await res.json().catch(()=>({}));const msg=e.error?.message||`HTTP ${res.status}`;
        if(res.status===429)setTestStatus({error:'Hết lượt — đợi vài phút.'})
        else if(res.status===400)setTestStatus({error:`Key không hợp lệ: ${msg}`})
        else if(res.status===403)setTestStatus({error:`Key bị từ chối: ${msg}`})
        else setTestStatus({error:msg});return}
      const d=await res.json()
      d.candidates?.[0]?.content?.parts?.[0]?.text?setTestStatus(lite?'ok-lite':'ok'):setTestStatus({error:'Phản hồi trống.'})
    }catch(e){setTestStatus({error:`Lỗi mạng: ${e.message}`})}
  }

  const SUB=[['overview','📊 Tổng quan'],['journal','🎬 Nhật ký & Báo cáo'],['progress','📈 Tiến độ'],['settings','⚙️ Cài đặt']]

  return (
    <div style={{ maxWidth:680, margin:'0 auto', padding:'20px 16px' }}>
      <h1 style={{ fontSize:20, fontWeight:800, marginBottom:2 }}>Góc phụ huynh 👨‍👩‍👧</h1>
      <p style={{ fontSize:13, color:'var(--text3)', marginBottom:18 }}>Theo dõi hành trình làm phim của {childName}</p>

      <div style={{ display:'flex', gap:6, marginBottom:20, flexWrap:'wrap' }}>
        {SUB.map(([t,l]) => (
          <button key={t} onClick={()=>setTab(t)}
            style={{ padding:'8px 12px', borderRadius:8, fontSize:12, fontWeight:800,
              background:tab===t?'var(--primary)':'var(--surface)', color:tab===t?'#fff':'var(--text2)',
              border:tab===t?'none':'1.5px solid var(--border)', boxShadow:tab===t?'none':'var(--sh)' }}>
            {l}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab==='overview' && (
        <div>
          <div style={{ display:'flex', gap:8, marginBottom:14 }}>
            {[['🎬',`${pct}%`,'Hoàn thành','var(--primary)'],['🔥',streak,'Ngày liên tiếp','var(--amber)'],['📋',reportCount,'Báo cáo Đô La','var(--teal)'],['📓',journalCount,'Nhật ký bé','var(--purple)']].map(([icon,val,lbl,color]) => (
              <div key={lbl} style={{ background:'var(--surface2)', borderRadius:'var(--rsm)', padding:'12px 14px', flex:1, minWidth:0 }}>
                <div style={{ fontSize:18, marginBottom:2 }}>{icon}</div>
                <div style={{ fontSize:22, fontWeight:800, color, lineHeight:1 }}>{val}</div>
                <div style={{ fontSize:11, color:'var(--text3)', marginTop:3, fontWeight:700 }}>{lbl}</div>
              </div>
            ))}
          </div>

          {badges.length > 0 && (
            <div style={{ background:'var(--surface)', borderRadius:'var(--r)', padding:16, marginBottom:14, boxShadow:'var(--sh)' }}>
              <p style={{ fontWeight:800, fontSize:14, marginBottom:12 }}>🏆 Huy hiệu đã đạt được</p>
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                {badges.map(b => {
                  const badge=BADGES[b]; if(!badge) return null
                  return <div key={b} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, background:'var(--surface2)', borderRadius:12, padding:'12px 16px', minWidth:90 }}>
                    <span style={{ fontSize:28 }}>{badge.emoji}</span>
                    <span style={{ fontSize:11, fontWeight:800, color:'var(--text2)', textAlign:'center' }}>{badge.label}</span>
                    <span style={{ fontSize:10, color:'var(--text3)' }}>Ngày {badge.day}</span>
                  </div>
                })}
              </div>
            </div>
          )}

          <div style={{ background:'var(--surface)', borderRadius:'var(--r)', padding:18, marginBottom:14, boxShadow:'var(--sh)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontWeight:800, fontSize:14 }}>Hành trình làm phim 20 ngày</span>
              <span style={{ fontSize:13, color:'var(--text2)' }}>{completedDays.length}/20</span>
            </div>
            <div style={{ height:10, background:'var(--border)', borderRadius:99, overflow:'hidden', marginBottom:12 }}>
              <div style={{ height:'100%', width:`${pct}%`, background:'linear-gradient(90deg,var(--primary),var(--purple))', borderRadius:99 }} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
              {PHASES.map(ph => {
                const d=ph.days.filter(id=>completedDays.includes(id)).length
                return <div key={ph.id} style={{ background:ph.bg, borderRadius:'var(--rsm)', padding:'10px 12px' }}>
                  <div style={{ fontSize:14, marginBottom:3 }}>{ph.emoji}</div>
                  <div style={{ fontSize:12, fontWeight:800, color:ph.color }}>{ph.title}</div>
                  <div style={{ fontSize:14, fontWeight:800, color:ph.color, marginTop:2 }}>{d}/{ph.days.length}</div>
                  <div style={{ height:4, background:`${ph.color}25`, borderRadius:99, marginTop:5, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${Math.round(d/ph.days.length*100)}%`, background:ph.color, borderRadius:99 }} />
                  </div>
                </div>
              })}
            </div>
          </div>

          {completedDays.length===0 && (
            <div style={{ textAlign:'center', padding:40, color:'var(--text3)' }}>
              <div style={{ fontSize:48, marginBottom:10 }}>🎬</div>
              <p style={{ fontSize:16, fontWeight:800, color:'var(--text2)' }}>Hành trình chưa bắt đầu</p>
              <p style={{ fontSize:14 }}>Mở tab Học để bắt đầu Ngày 1!</p>
            </div>
          )}
        </div>
      )}

      {/* ── JOURNAL & REPORTS ── */}
      {tab==='journal' && (
        <div>
          <p style={{ fontWeight:800, marginBottom:4, fontSize:14 }}>🎬 Nhật ký & Báo cáo của {childName}</p>
          <p style={{ fontSize:13, color:'var(--text3)', marginBottom:16 }}>{reportCount} báo cáo Đô La · {journalCount} nhật ký</p>

          {completedDays.length===0
            ? <div style={{ textAlign:'center', padding:40, color:'var(--text3)' }}><div style={{ fontSize:40 }}>📓</div><p style={{ marginTop:8 }}>Chưa có dữ liệu.</p></div>
            : [...completedDays].sort((a,b)=>b-a).map(id => {
                const d=DAYS.find(x=>x.id===id), ph=PHASES.find(p=>p.days.includes(id))
                const report=autoReports[id], journal=journalEntries[id], chatHist=chatHistories[id]||[]
                const isExpanded=expandedDay===id
                return (
                  <div key={id} style={{ background:'var(--surface)', borderRadius:'var(--rsm)', marginBottom:10, border:'1px solid var(--border)', overflow:'hidden' }}>
                    <button onClick={()=>setExpandedDay(isExpanded?null:id)}
                      style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'12px 14px', background:'none', cursor:'pointer', textAlign:'left' }}>
                      <div style={{ width:32, height:32, borderRadius:'50%', background:ph?.bg||'var(--primary-lt)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>{ph?.emoji}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontSize:13, fontWeight:800, color:'var(--text)' }}>Ngày {id}: {d?.title}</p>
                        <div style={{ display:'flex', gap:8, marginTop:2 }}>
                          {report&&<span style={{ fontSize:11, color:'var(--primary)', fontWeight:700 }}>📋 Báo cáo</span>}
                          {journal&&<span style={{ fontSize:11, color:'var(--teal)', fontWeight:700 }}>📓 Nhật ký</span>}
                          {chatHist.length>0&&<span style={{ fontSize:11, color:'var(--text3)' }}>💬 {Math.floor(chatHist.length/2)} lượt</span>}
                        </div>
                      </div>
                      <span style={{ fontSize:14, color:'var(--text3)', transform:isExpanded?'rotate(180deg)':'', transition:'transform .2s' }}>▼</span>
                    </button>

                    {isExpanded && (
                      <div style={{ padding:'0 14px 14px' }}>
                        {report && (
                          <div style={{ background:'var(--primary-lt)', border:'1px solid #c7d2fe', borderRadius:'var(--rsm)', padding:14, marginBottom:10 }}>
                            <p style={{ fontSize:11, fontWeight:800, color:'var(--primary)', marginBottom:8, textTransform:'uppercase', letterSpacing:.5 }}>📋 Báo cáo của Đô La</p>
                            <p style={{ fontSize:13, color:'var(--text)', lineHeight:1.75, whiteSpace:'pre-wrap' }}>{report.content}</p>
                          </div>
                        )}
                        {journal && (
                          <div style={{ background:'var(--teal-lt)', border:'1px solid #99f6e4', borderRadius:'var(--rsm)', padding:14, marginBottom:10 }}>
                            <p style={{ fontSize:11, fontWeight:800, color:'var(--teal)', marginBottom:8, textTransform:'uppercase', letterSpacing:.5 }}>📓 Cảm nhận của bé</p>
                            <p style={{ fontSize:13, color:'var(--text)', lineHeight:1.7, whiteSpace:'pre-wrap' }}>{journal.text}</p>
                          </div>
                        )}
                        {chatHist.length>0 && (
                          <details style={{ marginTop:4 }}>
                            <summary style={{ fontSize:12, fontWeight:800, color:'var(--text3)', cursor:'pointer', padding:'4px 0' }}>💬 Xem {Math.floor(chatHist.length/2)} lượt chat với Đô La</summary>
                            <div style={{ marginTop:8, maxHeight:300, overflow:'auto', border:'1px solid var(--border)', borderRadius:'var(--rsm)', padding:10 }}>
                              {chatHist.map((m,i) => (
                                <div key={i} style={{ display:'flex', gap:6, marginBottom:8, flexDirection:m.role==='user'?'row-reverse':'row', alignItems:'flex-start' }}>
                                  <span style={{ fontSize:11, fontWeight:800, color:m.role==='user'?'var(--primary)':'var(--text3)', flexShrink:0, marginTop:2 }}>{m.role==='user'?childName:'Đô La'}</span>
                                  <p style={{ fontSize:12, color:'var(--text2)', lineHeight:1.55, background:m.role==='user'?'var(--primary-lt)':'var(--surface2)', padding:'6px 10px', borderRadius:8, maxWidth:'80%' }}>{m.content}</p>
                                </div>
                              ))}
                            </div>
                          </details>
                        )}
                      </div>
                    )}
                  </div>
                )
              })
          }
        </div>
      )}

      {/* ── PROGRESS ── */}
      {tab==='progress' && (
        <div>
          <p style={{ fontWeight:800, marginBottom:14, fontSize:14 }}>📈 Chi tiết từng ngày</p>
          {completedDays.length===0
            ? <div style={{ textAlign:'center', padding:40, color:'var(--text3)' }}><div style={{ fontSize:40 }}>📋</div><p style={{ marginTop:8 }}>Chưa có dữ liệu.</p></div>
            : [...completedDays].sort((a,b)=>b-a).map(id => {
                const s=sessions[id]||{}, d=DAYS.find(x=>x.id===id), ph=PHASES.find(p=>p.days.includes(id))
                return (
                  <div key={id} style={{ background:'var(--surface)', borderRadius:'var(--rsm)', padding:'12px 14px', marginBottom:8, border:'1px solid var(--border)', display:'flex', gap:12, alignItems:'flex-start' }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', background:ph?.bg||'var(--primary-lt)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{ph?.emoji}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:13, fontWeight:800, color:'var(--text)', marginBottom:3 }}>Ngày {id}: {d?.title}</p>
                      <p style={{ fontSize:12, color:'var(--primary)', marginBottom:3 }}>🎯 {d?.output}</p>
                      <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                        {s.duration!=null&&<span style={{ fontSize:11, color:'var(--text3)' }}>⏱ {s.duration} phút</span>}
                        {s.activitiesDone!=null&&<span style={{ fontSize:11, color:'var(--text3)' }}>✅ {s.activitiesDone}/3 hoạt động</span>}
                        {s.supportLevel&&<span style={{ fontSize:11, color:s.supportLevel==='A'?'var(--green)':'var(--text3)', fontWeight:800 }}>🧠 Tự chủ {s.supportLevel}</span>}
                        {!s.supportLevel&&s.selfSolved&&<span style={{ fontSize:11, color:'var(--green)', fontWeight:800 }}>💪 Tự làm được</span>}
                      </div>
                    </div>
                    <span style={{ fontSize:18 }}>{s.supportLevel==='A'||s.selfSolved?'⭐':'✅'}</span>
                  </div>
                )
              })
          }
        </div>
      )}

      {/* ── SETTINGS ── */}
      {tab==='settings' && (
        <div>
          <div style={{ background:'var(--surface)', borderRadius:'var(--r)', padding:20, boxShadow:'var(--sh)', marginBottom:14 }}>
            <p style={{ fontWeight:800, marginBottom:16, fontSize:14 }}>⚙️ Cài đặt</p>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:13, fontWeight:800, color:'var(--text2)', display:'block', marginBottom:6 }}>Tên bé</label>
              <input value={newName} onChange={e=>setNewName(e.target.value)}
                style={{ width:'100%', padding:'12px 14px', borderRadius:'var(--rsm)', border:'1.5px solid var(--border)', fontSize:15, outline:'none', fontFamily:'inherit', background:'var(--surface)', color:'var(--text)' }}
                onFocus={e=>e.target.style.borderColor='var(--primary)'}
                onBlur={e=>e.target.style.borderColor='var(--border)'} />
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:13, fontWeight:800, color:'var(--text2)', display:'block', marginBottom:4 }}>Gemini API Key</label>
              <p style={{ fontSize:12, color:'var(--text3)', marginBottom:6 }}>Lấy miễn phí tại <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color:'var(--primary)' }}>aistudio.google.com</a></p>
              <input type="password" value={newKey} onChange={e=>{setNewKey(e.target.value);setTestStatus(null)}} placeholder="AIzaSy..."
                style={{ width:'100%', padding:'12px 14px', borderRadius:'var(--rsm)', border:'1.5px solid var(--border)', fontSize:14, outline:'none', fontFamily:'monospace', background:'var(--surface)', color:'var(--text)' }}
                onFocus={e=>e.target.style.borderColor='var(--primary)'}
                onBlur={e=>e.target.style.borderColor='var(--border)'} />
              <button onClick={testConn} disabled={testStatus==='testing'}
                style={{ marginTop:10, width:'100%', padding:11, background:'var(--surface2)', border:'1.5px solid var(--border)', borderRadius:'var(--rsm)', fontSize:13, fontWeight:800, color:'var(--text2)' }}>
                {testStatus==='testing'?'⏳ Đang kiểm tra...':'🔌 Kiểm tra kết nối'}
              </button>
              {testStatus==='ok'&&<div style={{ marginTop:10, padding:'10px 14px', background:'var(--green-lt)', border:'1px solid #a7f3d0', borderRadius:'var(--rsm)', fontSize:13, color:'var(--green)', fontWeight:700 }}>✅ Kết nối thành công!</div>}
              {testStatus==='ok-lite'&&<div style={{ marginTop:10, padding:'10px 14px', background:'var(--amber-lt)', border:'1px solid #fde68a', borderRadius:'var(--rsm)', fontSize:13, color:'var(--amber)', fontWeight:700 }}>✅ Key hoạt động (qua model dự phòng).</div>}
              {testStatus&&typeof testStatus==='object'&&<div style={{ marginTop:10, padding:'10px 14px', background:'var(--rose-lt)', border:'1px solid #fecdd3', borderRadius:'var(--rsm)', fontSize:13, color:'var(--rose)' }}>❌ {testStatus.error}</div>}
            </div>
            <button onClick={saveSettings}
              style={{ width:'100%', padding:14, background:saved?'var(--green)':'var(--primary)', color:'#fff', borderRadius:'var(--rsm)', fontSize:15, fontWeight:800, transition:'background .3s' }}>
              {saved?'✓ Đã lưu!':'💾 Lưu cài đặt'}
            </button>
          </div>

          <div style={{ background:'var(--surface)', borderRadius:'var(--r)', padding:20, boxShadow:'var(--sh)', marginBottom:14 }}>
            <p style={{ fontWeight:800, fontSize:14, marginBottom:6 }}>💾 Sao lưu dữ liệu</p>
            <p style={{ fontSize:13, color:'var(--text2)', marginBottom:12 }}>Tải toàn bộ dữ liệu ra file JSON để lưu an toàn.</p>
            <button onClick={()=>onExport(state)}
              style={{ width:'100%', padding:12, background:'var(--teal)', color:'#fff', borderRadius:'var(--rsm)', fontSize:14, fontWeight:800 }}>
              📥 Xuất dữ liệu (.json)
            </button>
          </div>

          <div style={{ background:'var(--rose-lt)', borderRadius:'var(--r)', padding:20, border:'1.5px solid #fecdd3' }}>
            <p style={{ fontWeight:800, color:'var(--rose)', marginBottom:8, fontSize:14 }}>⚠️ Xóa toàn bộ dữ liệu</p>
            <p style={{ fontSize:13, color:'#9f1239', marginBottom:14 }}>Xóa tất cả tiến độ, nhật ký và cài đặt. Không thể hoàn tác!</p>
            <button onClick={()=>{
              if(window.confirm('Bạn muốn tải file backup trước khi xóa không?\n\nOK = Tải backup rồi xóa\nCancel = Hủy')){
                onExport(state)
                setTimeout(()=>{if(window.confirm('Đã tải backup. Xác nhận xóa toàn bộ?'))onReset()},500)
              }
            }} style={{ padding:'10px 20px', background:'var(--rose)', color:'#fff', borderRadius:'var(--rsm)', fontSize:14, fontWeight:800 }}>
              🗑 Xóa tất cả và bắt đầu lại
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
