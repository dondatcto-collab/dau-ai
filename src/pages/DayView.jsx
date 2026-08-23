import { useState, useEffect, useRef, useCallback } from 'react'
import { DAYS, getPhase, TOOLS_INFO } from '../data/curriculum'
import { useAI } from '../hooks/useAI'

function Confetti({ show }) {
  if (!show) return null
  const pieces = Array.from({length:28},(_,i)=>({ id:i, color:['#ff6b35','#7c3aed','#0d9488','#d97706','#e11d48'][i%5], left:`${Math.random()*100}%`, delay:`${Math.random()*.5}s`, size:8+Math.random()*7 }))
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:999 }}>
      {pieces.map(p => <div key={p.id} style={{ position:'absolute', top:'-20px', left:p.left, width:p.size, height:p.size, borderRadius:'50%', background:p.color, animationDelay:p.delay, animation:'fall 1.6s ease-in forwards' }} />)}
      <style>{`@keyframes fall{to{transform:translateY(110vh) rotate(720deg);opacity:0}}`}</style>
    </div>
  )
}

function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [fileError, setFileError] = useState('')
  const imageRef = useRef(null)
  const audioRef = useRef(null)
  const videoRef = useRef(null)
  const sending = useRef(false)

  const LIMITS = {
    image: 8 * 1024 * 1024,
    audio: 12 * 1024 * 1024,
    video: 12 * 1024 * 1024,
  }

  const KIND_LABEL = {
    image: 'ảnh',
    audio: 'âm thanh',
    video: 'video',
  }

  const guessMimeType = (file, kind) => {
    if (file.type) return file.type
    const ext = (file.name.split('.').pop() || '').toLowerCase()
    const byExt = {
      jpg:'image/jpeg', jpeg:'image/jpeg', png:'image/png', webp:'image/webp',
      mp3:'audio/mpeg', m4a:'audio/mp4', aac:'audio/aac', wav:'audio/wav',
      mp4:'video/mp4', mov:'video/quicktime', webm:'video/webm',
    }
    return byExt[ext] || (kind === 'image' ? 'image/jpeg' : kind === 'audio' ? 'audio/mpeg' : 'video/mp4')
  }

  const isValidFile = (file, kind) => {
    const mime = guessMimeType(file, kind)
    if (kind === 'image') return ['image/jpeg','image/png','image/webp'].includes(mime)
    if (kind === 'audio') return ['audio/mpeg','audio/mp4','audio/x-m4a','audio/aac','audio/wav','audio/x-wav'].includes(mime) || mime.startsWith('audio/')
    if (kind === 'video') return ['video/mp4','video/quicktime','video/webm'].includes(mime)
    return false
  }

  const readFile = (file, kind) => {
    if (!file) return
    const label = KIND_LABEL[kind]
    if (!isValidFile(file, kind)) {
      setFileError(`Em chọn đúng file ${label} nhé.`)
      return
    }
    if (file.size > LIMITS[kind]) {
      const mb = Math.round(LIMITS[kind] / 1024 / 1024)
      setFileError(`${label.charAt(0).toUpperCase() + label.slice(1)} hơi lớn. Em chọn file dưới ${mb} MB nhé.`)
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result || '')
      const dataBase64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : ''
      setAttachment({
        kind,
        name: file.name,
        mimeType: guessMimeType(file, kind),
        size: file.size,
        dataUrl,
        dataBase64,
      })
      setFileError('')
      setMenuOpen(false)
    }
    reader.onerror = () => setFileError('Anh chưa đọc được file này. Em thử file khác nhé.')
    reader.readAsDataURL(file)
  }

  const clearInputs = () => {
    if (imageRef.current) imageRef.current.value = ''
    if (audioRef.current) audioRef.current.value = ''
    if (videoRef.current) videoRef.current.value = ''
  }

  const send = () => {
    if ((!text.trim() && !attachment) || disabled || sending.current) return
    sending.current = true
    onSend(text.trim(), attachment)
    setText('')
    setAttachment(null)
    setMenuOpen(false)
    clearInputs()
    setTimeout(() => { sending.current = false }, 1500)
  }

  const canSend = (!!text.trim() || !!attachment) && !disabled
  const kindIcon = attachment?.kind === 'image' ? '📷' : attachment?.kind === 'audio' ? '🎤' : '🎬'
  const kindHelp = attachment?.kind === 'image'
    ? 'Ảnh gửi cho Đô La xem'
    : attachment?.kind === 'audio'
      ? 'Âm thanh gửi cho Đô La nghe'
      : 'Video gửi cho Đô La xem và nghe'

  return (
    <div style={{ background:'var(--surface)', borderTop:'1px solid var(--border)', padding:'8px 12px 10px' }}>
      {attachment && (
        <div style={{ marginBottom:8, padding:10, border:'1px solid var(--border)', borderRadius:12, background:'var(--surface2)', display:'flex', gap:10, alignItems:'center' }}>
          {attachment.kind === 'image' ? (
            <img src={attachment.dataUrl} alt="Ảnh em chọn" style={{ width:54, height:54, objectFit:'cover', borderRadius:10, border:'1px solid var(--border)' }} />
          ) : attachment.kind === 'video' ? (
            <video src={attachment.dataUrl} muted playsInline style={{ width:72, height:54, objectFit:'cover', borderRadius:10, border:'1px solid var(--border)', background:'#111' }} />
          ) : (
            <div style={{ width:54, height:54, borderRadius:10, background:'var(--primary-lt)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>🎤</div>
          )}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:800, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{attachment.name}</div>
            <div style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>{kindHelp}</div>
          </div>
          <button onClick={() => { setAttachment(null); clearInputs() }} aria-label="Bỏ file" style={{ width:30, height:30, borderRadius:'50%', background:'var(--surface)', border:'1px solid var(--border)', color:'var(--text2)', fontWeight:800 }}>×</button>
        </div>
      )}

      {fileError && <div style={{ marginBottom:7, fontSize:12, color:'var(--rose)' }}>⚠️ {fileError}</div>}

      <div style={{ display:'flex', gap:8, alignItems:'center', position:'relative' }}>
        <input ref={imageRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={e => readFile(e.target.files?.[0], 'image')} />
        <input ref={audioRef} type="file" accept="audio/mpeg,audio/mp4,audio/x-m4a,audio/aac,audio/wav,audio/*" hidden onChange={e => readFile(e.target.files?.[0], 'audio')} />
        <input ref={videoRef} type="file" accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm" hidden onChange={e => readFile(e.target.files?.[0], 'video')} />

        <div style={{ position:'relative' }}>
          <button onClick={() => setMenuOpen(v => !v)} disabled={disabled} aria-label="Thêm ảnh, âm thanh hoặc video"
            style={{ width:44, height:44, borderRadius:'50%', background:'var(--surface2)', border:'1.5px solid var(--border)', color:'var(--primary)', fontSize:24, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>＋</button>
          {menuOpen && !disabled && (
            <div style={{ position:'absolute', bottom:52, left:0, width:205, background:'var(--surface)', border:'1px solid var(--border)', boxShadow:'var(--shlg)', borderRadius:14, padding:7, zIndex:30 }}>
              <button onClick={() => imageRef.current?.click()} style={{ width:'100%', padding:'10px 11px', borderRadius:9, textAlign:'left', background:'transparent', color:'var(--text)', fontSize:13, fontWeight:700 }}>📷 Gửi ảnh</button>
              <button onClick={() => audioRef.current?.click()} style={{ width:'100%', padding:'10px 11px', borderRadius:9, textAlign:'left', background:'transparent', color:'var(--text)', fontSize:13, fontWeight:700 }}>🎤 Gửi âm thanh</button>
              <button onClick={() => videoRef.current?.click()} style={{ width:'100%', padding:'10px 11px', borderRadius:9, textAlign:'left', background:'transparent', color:'var(--text)', fontSize:13, fontWeight:700 }}>🎬 Gửi video</button>
              <div style={{ borderTop:'1px solid var(--border)', margin:'4px 4px 0', padding:'8px 7px 3px', fontSize:10.5, color:'var(--text3)', lineHeight:1.4 }}>
                🛡️ Không gửi địa chỉ nhà, trường học, giấy tờ hay thông tin riêng tư nhé.<br />
                🎬 Video nên là đoạn ngắn dưới 12 MB.
              </div>
            </div>
          )}
        </div>

        <input value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key==='Enter' && !e.shiftKey && (e.preventDefault(), send())}
          placeholder={attachment ? `Nói Đô La biết em muốn anh ${attachment.kind === 'audio' ? 'nghe' : 'xem'} gì...` : 'Hỏi anh Đô La...'} disabled={disabled}
          style={{ flex:1, minWidth:0, padding:'10px 14px', borderRadius:99, border:'1.5px solid var(--border)', fontSize:15, outline:'none', fontFamily:'inherit', background:'var(--surface)', color:'var(--text)' }}
          onFocus={e => e.target.style.borderColor='var(--primary)'}
          onBlur={e => e.target.style.borderColor='var(--border)'} />
        <button onClick={send} disabled={!canSend}
          style={{ width:44, height:44, borderRadius:'50%', background:canSend?'var(--primary)':'var(--border)', color:'#fff', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'background .2s' }}>▶</button>
      </div>
    </div>
  )
}

export default function DayView({ dayId, state, onBack, onComplete, onSaveJournal, onSaveChatMessage, onSaveActivityProgress, onSaveAutoReport }) {
  const day = DAYS.find(d => d.id === dayId)
  const phase = getPhase(dayId)
  const [tab, setTab] = useState('guide')
  const [journal, setJournal] = useState(state.journalEntries?.[dayId]?.text || '')
  const [supportLevel, setSupportLevel] = useState('B')
  const [journalSaved, setJournalSaved] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [reportDone, setReportDone] = useState(!!state.autoReports?.[dayId])

  const savedProg = state.activityProgress?.[dayId] || {}
  const [currentAct, setCurrentAct] = useState(savedProg.current || 1)
  const [completedActs, setCompletedActs] = useState(savedProg.completed || [])
  const [checking, setChecking] = useState(null)

  const sessionStart = useRef(Date.now())
  const chatInited = useRef(false)
  const bottomRef = useRef(null)
  const isDone = state.completedDays?.includes(dayId)
  const ai = useAI(state.apiKey)

  useEffect(() => {
    if (tab === 'chat' && !chatInited.current && day) {
      chatInited.current = true
      const hist = (state.chatHistories?.[dayId] || []).filter(m => m.content?.trim().length > 2)
      ai.startSession(day.title, phase.id, state.childName, hist)
    }
  }, [tab])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [ai.messages, ai.loading])

  if (!day) return null

  const activities = day.activities || []
  const allDone = completedActs.length >= activities.length

  const handleSaveMsg = useCallback((msg) => { if (onSaveChatMessage) onSaveChatMessage(dayId, msg) }, [dayId])

  const handleSend = (text, attachment) => ai.sendMessage(text, day.title, phase.id, state.childName, activities, currentAct, handleSaveMsg, attachment)

  const handleActDone = (idx) => {
    if (checking === idx) return
    setChecking(idx)
    ai.sendMessage(`Em xong hoạt động ${idx}: "${activities[idx-1]}". Anh hỏi em nhé!`, day.title, phase.id, state.childName, activities, idx, handleSaveMsg)
  }

  const handleActPassed = (idx) => {
    const newDone = [...new Set([...completedActs, idx])]
    const nextIdx = idx < activities.length ? idx + 1 : idx
    setCompletedActs(newDone); setCurrentAct(nextIdx); setChecking(null)
    if (onSaveActivityProgress) onSaveActivityProgress(dayId, { current:nextIdx, completed:newDone })
    if (newDone.length >= activities.length && !reportDone) {
      setTimeout(() => ai.generateReport(state.childName, day.title, activities, (report) => {
        if (onSaveAutoReport) onSaveAutoReport(dayId, report)
        setReportDone(true)
      }), 1000)
    }
  }

  const handleComplete = () => {
    const duration = Math.round((Date.now() - sessionStart.current) / 60000)
    if (journal.trim()) onSaveJournal(dayId, journal)
    onComplete(dayId, { hintsUsed:ai.hintCount, supportLevel, selfSolved:supportLevel==='A', duration, activitiesDone:completedActs.length })
    setConfetti(true)
    setTimeout(onBack, 1800)
  }

  const pc = phase.color; const pb = phase.bg

  return (
    <div style={{ maxWidth:680, margin:'0 auto', minHeight:'100dvh', display:'flex', flexDirection:'column', background:'var(--bg)' }}>
      <Confetti show={confetti} />

      {/* Header */}
      <div style={{ background:'var(--surface)', borderBottom:'1px solid var(--border)', padding:'12px 14px', position:'sticky', top:0, zIndex:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
          <button onClick={onBack} style={{ background:'var(--surface2)', border:'1px solid var(--border)', color:'var(--text2)', fontSize:14, padding:'6px 12px', borderRadius:8 }}>← Về</button>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontSize:11, color:pc, fontWeight:800, textTransform:'uppercase', letterSpacing:.5, marginBottom:1 }}>
              {phase.emoji} Ngày {dayId} / 20 — {phase.title}
            </p>
            <h1 style={{ fontSize:15, fontWeight:800, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{day.title}</h1>
          </div>
          {isDone && <span style={{ fontSize:11, background:'var(--green-lt)', color:'var(--green)', padding:'4px 10px', borderRadius:99, fontWeight:800, flexShrink:0 }}>✓ Xong</span>}
        </div>

        {/* Activity progress bar */}
        <div style={{ display:'flex', gap:4, marginBottom:10 }}>
          {activities.map((_,i) => {
            const idx=i+1, done=completedActs.includes(idx), active=currentAct===idx&&!done
            return <div key={idx} style={{ flex:1, height:4, borderRadius:99, background:done?pc:active?`${pc}60`:'var(--border)', transition:'background .3s' }} />
          })}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:4 }}>
          {[['guide','🎬 Nhiệm vụ'],['chat','🤖 Chat Đô La'],['journal','📓 Nhật ký']].map(([t,l]) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex:1, padding:'8px 2px', borderRadius:8, fontSize:12, fontWeight:800,
                background:tab===t?pc:'var(--surface2)', color:tab===t?'#fff':'var(--text2)', border:tab===t?'none':'1px solid var(--border)' }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, overflow:'auto', padding:16 }}>

        {/* ── GUIDE ── */}
        {tab === 'guide' && (
          <div>
            {/* Mission box */}
            <div style={{ background:pb, borderRadius:'var(--r)', padding:16, marginBottom:14, borderLeft:`4px solid ${pc}` }}>
              <p style={{ fontSize:12, fontWeight:800, color:pc, marginBottom:4 }}>🎯 NHIỆM VỤ HÔM NAY</p>
              <p style={{ fontSize:14, color:'var(--text)', lineHeight:1.65, marginBottom:8 }}>{day.mission || day.goal}</p>
              <p style={{ fontSize:12, color:'var(--text3)', fontStyle:'italic' }}>🏆 Sản phẩm: <strong style={{ color:pc }}>{day.output}</strong></p>
            </div>

            {/* Activities */}
            <p style={{ fontSize:12, fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:.5, marginBottom:8 }}>
              Hoạt động — ({completedActs.length}/{activities.length} hoàn thành)
            </p>
            {activities.map((a, i) => {
              const idx=i+1, done=completedActs.includes(idx), active=currentAct===idx&&!done
              return (
                <div key={idx} style={{ background:done?'var(--green-lt)':active?pb:'var(--surface)', border:`1.5px solid ${done?'#a7f3d0':active?pc:'var(--border)'}`, borderRadius:'var(--rsm)', padding:'12px 14px', marginBottom:8 }}>
                  <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                    <span style={{ fontWeight:800, color:done?'var(--green)':pc, flexShrink:0, fontSize:15, minWidth:22 }}>{done?'✓':`${idx}.`}</span>
                    <p style={{ fontSize:14, color:done?'var(--green)':'var(--text)', lineHeight:1.6, margin:0, flex:1 }}>{a}</p>
                  </div>
                  {active && !isDone && (
                    <button onClick={() => { setTab('chat'); handleActDone(idx) }}
                      style={{ marginTop:10, width:'100%', padding:9, background:pc, color:'#fff', borderRadius:'var(--rsm)', fontSize:13, fontWeight:800 }}>
                      ✅ Xong hoạt động {idx} — Đô La hỏi nhé!
                    </button>
                  )}
                </div>
              )
            })}

            {/* Tools */}
            {day.tools && day.tools.length > 0 && (
              <div style={{ marginTop:12 }}>
                <p style={{ fontSize:12, fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:.5, marginBottom:8 }}>🔧 Công cụ hôm nay</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {day.tools.map((tool, i) => {
                    const info = TOOLS_INFO[tool]
                    return info ? (
                      <a key={i} href={info.url} target="_blank" rel="noreferrer"
                        style={{ fontSize:12, padding:'5px 12px', background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:99, color:'var(--primary)', fontWeight:700, textDecoration:'none', display:'flex', alignItems:'center', gap:5 }}>
                        🔗 {tool.split('(')[0].trim()}
                      </a>
                    ) : (
                      <span key={i} style={{ fontSize:12, padding:'5px 12px', background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:99, color:'var(--text2)', fontWeight:600 }}>
                        {tool}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {day.tip && (
              <div style={{ background:'var(--amber-lt)', borderRadius:'var(--rsm)', padding:'12px 14px', marginTop:14, display:'flex', gap:10, border:'1px solid #fde68a' }}>
                <span>💡</span>
                <p style={{ fontSize:13, color:'#92400e', lineHeight:1.55, margin:0, fontStyle:'italic' }}>{day.tip}</p>
              </div>
            )}

            <button onClick={() => setTab('chat')}
              style={{ width:'100%', marginTop:16, padding:14, background:`linear-gradient(135deg,${pc},var(--purple))`, color:'#fff', borderRadius:'var(--r)', fontSize:14, fontWeight:800, boxShadow:'var(--shlg)' }}>
              🤖 Chat cùng anh Đô La →
            </button>
          </div>
        )}

        {/* ── CHAT ── */}
        {tab === 'chat' && (
          <div>
            {!state.apiKey && (
              <div style={{ background:'var(--rose-lt)', borderRadius:'var(--rsm)', padding:12, marginBottom:12, fontSize:13, color:'var(--rose)', border:'1px solid #fecdd3' }}>
                ⚠️ Chưa có Gemini API key. Vào <strong>tab Phụ huynh → Cài đặt</strong>.
              </div>
            )}

            {checking && !completedActs.includes(checking) && (
              <div style={{ background:'var(--primary-lt)', border:`1px solid ${pc}`, borderRadius:'var(--rsm)', padding:'12px 14px', marginBottom:12, display:'flex', justifyContent:'space-between', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:13, color:pc, fontWeight:700 }}>Đô La đã hỏi về hoạt động {checking}</span>
                <button onClick={() => handleActPassed(checking)}
                  style={{ padding:'7px 14px', background:pc, color:'#fff', borderRadius:'var(--rsm)', fontSize:13, fontWeight:800, whiteSpace:'nowrap' }}>
                  Xác nhận ✓
                </button>
              </div>
            )}

            {ai.messages.map((m, i) => (
              <div key={i} style={{ display:'flex', flexDirection:m.role==='user'?'row-reverse':'row', gap:8, marginBottom:14, alignItems:'flex-end' }}>
                {m.role==='assistant' && (
                  <div style={{ width:34, height:34, borderRadius:'50%', background:`linear-gradient(135deg,${pc},var(--purple))`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, color:'#fff', fontWeight:800, flexShrink:0 }}>Đ</div>
                )}
                <div style={{ maxWidth:'78%', padding:'10px 14px',
                  borderRadius:m.role==='user'?'16px 4px 16px 16px':'4px 16px 16px 16px',
                  background:m.role==='user'?`linear-gradient(135deg,${pc},var(--purple))`:'var(--surface)',
                  color:m.role==='user'?'#fff':'var(--text)', fontSize:14, lineHeight:1.65, boxShadow:'var(--sh)',
                  border:m.role==='assistant'?'1px solid var(--border)':'none', whiteSpace:'pre-wrap' }}>
                  {m.attachment && m.attachment.kind === 'image' && m.attachment.dataUrl && (
                    <img src={m.attachment.dataUrl} alt={m.attachment.name || 'Ảnh em gửi'} style={{ display:'block', width:'100%', maxHeight:260, objectFit:'contain', borderRadius:10, marginBottom:m.content?8:0, background:'#fff' }} />
                  )}
                  {m.attachment && m.attachment.kind === 'audio' && m.attachment.dataUrl && (
                    <audio controls src={m.attachment.dataUrl} style={{ display:'block', width:'100%', maxWidth:280, marginBottom:m.content?8:0 }} />
                  )}
                  {m.attachment && m.attachment.kind === 'video' && m.attachment.dataUrl && (
                    <video controls playsInline src={m.attachment.dataUrl} style={{ display:'block', width:'100%', maxHeight:280, borderRadius:10, marginBottom:m.content?8:0, background:'#111' }} />
                  )}
                  {m.attachment && !m.attachment.dataUrl && (
                    <div style={{ fontSize:12, fontWeight:700, marginBottom:m.content?6:0, opacity:.9 }}>
                      {m.attachment.kind === 'image' ? '📷' : m.attachment.kind === 'audio' ? '🎤' : '🎬'} {m.attachment.name || 'Tệp đã gửi'}
                    </div>
                  )}
                  {m.content}
                </div>
              </div>
            ))}

            {ai.loading && (
              <div style={{ display:'flex', gap:8, alignItems:'flex-end', marginBottom:14 }}>
                <div style={{ width:34, height:34, borderRadius:'50%', background:`linear-gradient(135deg,${pc},var(--purple))`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, color:'#fff', fontWeight:800 }}>Đ</div>
                <div style={{ padding:'12px 16px', borderRadius:'4px 16px 16px 16px', background:'var(--surface)', border:'1px solid var(--border)', display:'flex', gap:5 }}>
                  {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'var(--text3)', animation:`bounce .8s ${i*.16}s ease-in-out infinite` }} />)}
                </div>
              </div>
            )}

            {ai.reportLoading && (
              <div style={{ padding:'10px 14px', background:'var(--primary-lt)', borderRadius:'var(--rsm)', fontSize:13, color:'var(--primary)', marginBottom:12, border:`1px solid ${pc}` }}>
                ⏳ Đô La đang viết báo cáo buổi làm phim cho bố/mẹ...
              </div>
            )}
            {reportDone && !ai.reportLoading && (
              <div style={{ padding:'10px 14px', background:'var(--green-lt)', borderRadius:'var(--rsm)', fontSize:13, color:'var(--green)', marginBottom:12, border:'1px solid #a7f3d0', fontWeight:700 }}>
                ✅ Đô La đã gửi báo cáo cho bố/mẹ!
              </div>
            )}
            {ai.error && (
              <div style={{ padding:'10px 14px', background:'var(--rose-lt)', borderRadius:'var(--rsm)', fontSize:13, color:'var(--rose)', marginBottom:12, border:'1px solid #fecdd3' }}>
                ❌ {ai.error}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {/* ── JOURNAL ── */}
        {tab === 'journal' && (
          <div>
            {state.autoReports?.[dayId] && (
              <div style={{ background:'var(--primary-lt)', border:`1.5px solid ${pc}30`, borderRadius:'var(--r)', padding:16, marginBottom:16 }}>
                <p style={{ fontSize:12, fontWeight:800, color:pc, marginBottom:10, textTransform:'uppercase', letterSpacing:.5 }}>📋 Báo cáo của Đô La</p>
                <p style={{ fontSize:13.5, color:'var(--text)', lineHeight:1.75, whiteSpace:'pre-wrap' }}>{state.autoReports[dayId].content}</p>
                <p style={{ fontSize:11, color:'var(--text3)', marginTop:8 }}>{new Date(state.autoReports[dayId].createdAt).toLocaleString('vi-VN')}</p>
              </div>
            )}

            <p style={{ fontSize:14, fontWeight:800, color:'var(--text)', marginBottom:6 }}>📓 Cảm nhận của em hôm nay</p>
            <p style={{ fontSize:13, color:'var(--text2)', marginBottom:10, lineHeight:1.6 }}>
              Sổ khám phá: em phát hiện gì về AI, em tự làm được gì, AI sai/chưa đúng chỗ nào, và điều gì vui nhất? ✍️
            </p>
            <textarea value={journal} onChange={e => setJournal(e.target.value)} rows={5}
              placeholder={"💡 Em phát hiện...\n🤖 AI sai/chưa đúng ở...\n🧠 Em tự làm được...\n❤️ Em vui nhất khi..."}
              style={{ width:'100%', padding:14, borderRadius:'var(--rsm)', border:'2px solid var(--border)', fontSize:14, lineHeight:1.7, resize:'vertical', outline:'none', fontFamily:'inherit', color:'var(--text)', background:'var(--surface)' }}
              onFocus={e => e.target.style.borderColor='var(--primary)'}
              onBlur={e => e.target.style.borderColor='var(--border)'} />
            <button onClick={() => { if (journal.trim()) { onSaveJournal(dayId, journal); setJournalSaved(true); setTimeout(() => setJournalSaved(false), 2000) } }}
              style={{ marginTop:10, padding:'10px 20px', background:journalSaved?'var(--green)':'var(--teal)', color:'#fff', borderRadius:'var(--rsm)', fontSize:14, fontWeight:800, transition:'background .3s' }}>
              {journalSaved ? '✓ Đã lưu!' : '💾 Lưu cảm nhận'}
            </button>

            {!isDone && (
              <div style={{ marginTop:22, background:'var(--surface)', borderRadius:'var(--r)', padding:20, border:'2px solid var(--border)' }}>
                <p style={{ fontSize:15, fontWeight:800, marginBottom:12 }}>Đánh dấu hoàn thành ngày {dayId}?</p>
                <p style={{ fontSize:13, color:'var(--text2)', marginBottom:8 }}>Hôm nay em cần Đô La giúp tới mức nào?</p>
                <div style={{ display:'grid', gap:7, marginBottom:16 }}>
                  {[
                    ['A','🌟 A — Em tự làm gần như hoàn toàn'],
                    ['B','💡 B — Em cần 1–2 gợi ý nhỏ'],
                    ['C','🧭 C — Em cần hướng dẫn khá nhiều'],
                    ['D','🤝 D — Em và Đô La/bố mẹ làm cùng']
                  ].map(([v,l]) => <label key={v} style={{ display:'flex', gap:9, alignItems:'center', cursor:'pointer', fontSize:13, color:'var(--text2)' }}>
                    <input type="radio" name="support" value={v} checked={supportLevel===v} onChange={()=>setSupportLevel(v)} style={{ accentColor:'var(--primary)' }} /> {l}
                  </label>)}
                </div>
                <button onClick={handleComplete}
                  style={{ width:'100%', padding:16, background:`linear-gradient(135deg,var(--green),var(--teal))`, color:'#fff', borderRadius:'var(--rsm)', fontSize:16, fontWeight:800, boxShadow:'var(--shlg)' }}>
                  🎉 Hoàn thành ngày {dayId}!
                </button>
              </div>
            )}
            {isDone && (
              <div style={{ marginTop:20, background:'var(--green-lt)', borderRadius:'var(--rsm)', padding:16, textAlign:'center', border:'1px solid #a7f3d0' }}>
                <p style={{ fontSize:15, fontWeight:800, color:'var(--green)' }}>🎉 Ngày {dayId} đã hoàn thành!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {tab==='chat' && <ChatInput onSend={handleSend} disabled={ai.loading || !state.apiKey} />}
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}`}</style>
    </div>
  )
}
