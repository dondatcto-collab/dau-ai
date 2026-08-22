import { DAYS, PHASES } from '../data/curriculum'

const BADGES = {
  phase1:   { emoji:'🎭', label:'Nhà Sáng Tạo',   day:5  },
  phase2:   { emoji:'📋', label:'Nhà Biên Kịch',   day:10 },
  phase3:   { emoji:'🎬', label:'Đạo Diễn Nhí',    day:15 },
  director: { emoji:'⭐', label:'Đạo Diễn Chính Thức', day:20 },
}

export default function Home({ state, onOpenDay }) {
  const { childName, completedDays = [], streak = 0, badges = [] } = state
  const pct = Math.round(completedDays.length / 20 * 100)
  const nextDay = DAYS.find(d => !completedDays.includes(d.id))

  return (
    <div style={{ maxWidth:680, margin:'0 auto', padding:'20px 16px' }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
        <div>
          <p style={{ fontSize:12, color:'var(--text3)', marginBottom:2 }}>Xưởng Phim Hoạt Hình</p>
          <h1 style={{ fontSize:22, fontWeight:800 }}>Chào đạo diễn {childName}! 🎬</h1>
        </div>
        <div style={{ textAlign:'center', background:'var(--surface)', borderRadius:12, padding:'8px 14px', boxShadow:'var(--sh)', minWidth:64 }}>
          <div style={{ fontSize:20 }}>🔥</div>
          <div style={{ fontSize:20, fontWeight:800, color:'var(--primary)', lineHeight:1 }}>{streak}</div>
          <div style={{ fontSize:10, color:'var(--text3)', fontWeight:700 }}>ngày liên tiếp</div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ background:'var(--surface)', borderRadius:'var(--r)', padding:18, marginBottom:14, boxShadow:'var(--sh)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:8 }}>
          <span style={{ fontSize:14, fontWeight:800 }}>Hành trình làm phim 20 ngày</span>
          <span style={{ fontSize:22, fontWeight:800, color:'var(--primary)' }}>{pct}%</span>
        </div>
        <div style={{ height:10, background:'var(--border)', borderRadius:99, overflow:'hidden', marginBottom:10 }}>
          <div style={{ height:'100%', width:`${pct}%`, background:'linear-gradient(90deg,var(--primary),var(--purple))', borderRadius:99, transition:'width .5s' }} />
        </div>
        <div style={{ display:'flex', gap:3, flexWrap:'wrap' }}>
          {Array.from({length:20},(_,i) => {
            const done = completedDays.includes(i+1)
            const ph = PHASES.find(p => p.days.includes(i+1))
            return <button key={i} onClick={() => onOpenDay(i+1)} title={`Ngày ${i+1}`}
              style={{ width:18, height:18, borderRadius:'50%', background:done?(ph?.color||'var(--primary)'):'var(--border)', border:'none', cursor:'pointer', transition:'transform .1s' }}
              onMouseEnter={e => e.target.style.transform='scale(1.4)'}
              onMouseLeave={e => e.target.style.transform=''} />
          })}
        </div>
        <p style={{ marginTop:8, fontSize:12, color:'var(--text3)' }}>{completedDays.length} / 20 ngày • {20 - completedDays.length} ngày còn lại</p>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:14 }}>
          {badges.map(b => {
            const badge = BADGES[b]; if (!badge) return null
            return <div key={b} style={{ display:'flex', alignItems:'center', gap:6, background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:99, padding:'5px 12px', boxShadow:'var(--sh)' }}>
              <span style={{ fontSize:16 }}>{badge.emoji}</span>
              <span style={{ fontSize:12, fontWeight:800, color:'var(--text2)' }}>{badge.label}</span>
            </div>
          })}
        </div>
      )}

      {/* Next badge preview */}
      {badges.length < 4 && (() => {
        const nextBadge = Object.entries(BADGES).find(([k]) => !badges.includes(k))
        if (!nextBadge) return null
        const [,b] = nextBadge
        return <div style={{ background:'var(--surface)', borderRadius:'var(--rsm)', padding:'10px 14px', marginBottom:14, border:'1px dashed var(--border)', display:'flex', gap:10, alignItems:'center' }}>
          <span style={{ fontSize:22 }}>{b.emoji}</span>
          <div>
            <p style={{ fontSize:12, fontWeight:800, color:'var(--text2)' }}>Huy hiệu tiếp theo: {b.label}</p>
            <p style={{ fontSize:11, color:'var(--text3)' }}>Còn {b.day - completedDays.length} ngày nữa để mở khóa</p>
          </div>
        </div>
      })()}

      {/* Next day CTA */}
      {nextDay && (
        <button onClick={() => onOpenDay(nextDay.id)}
          style={{ width:'100%', background:'linear-gradient(135deg,var(--primary),var(--purple))', color:'#fff', borderRadius:'var(--r)', padding:'16px 20px', textAlign:'left', boxShadow:'var(--shlg)', marginBottom:20, display:'flex', justifyContent:'space-between', alignItems:'center' }}
          onMouseDown={e => e.currentTarget.style.transform='scale(.98)'}
          onMouseUp={e => e.currentTarget.style.transform=''}>
          <div>
            <p style={{ fontSize:11, opacity:.8, fontWeight:700, letterSpacing:1, textTransform:'uppercase', marginBottom:4 }}>
              {completedDays.length === 0 ? 'Bắt đầu hành trình!' : `Tiếp theo — Ngày ${nextDay.id}`}
            </p>
            <p style={{ fontSize:17, fontWeight:800, lineHeight:1.3 }}>{nextDay.title}</p>
            <p style={{ fontSize:12, opacity:.8, marginTop:4 }}>🎯 {nextDay.output}</p>
          </div>
          <span style={{ fontSize:28, marginLeft:12 }}>▶</span>
        </button>
      )}

      {completedDays.length === 20 && (
        <div style={{ background:'linear-gradient(135deg,#ffd700,#ff6b35)', borderRadius:'var(--r)', padding:24, textAlign:'center', marginBottom:20, boxShadow:'var(--shlg)' }}>
          <div style={{ fontSize:48, marginBottom:8 }}>🎬</div>
          <h2 style={{ fontSize:20, fontWeight:800, color:'#fff', marginBottom:6 }}>Đạo diễn {childName} đã hoàn thành!</h2>
          <p style={{ fontSize:14, color:'rgba(255,255,255,.9)' }}>Bộ phim hoạt hình đầu tiên đã ra đời 🎉</p>
        </div>
      )}

      {/* Phases */}
      {PHASES.map(phase => {
        const phaseDays = DAYS.filter(d => d.phase === phase.id)
        const done = phaseDays.filter(d => completedDays.includes(d.id)).length
        return (
          <div key={phase.id} style={{ marginBottom:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:20 }}>{phase.emoji}</span>
                <div>
                  <div style={{ fontSize:14, fontWeight:800 }}>Phase {phase.id}: {phase.title}</div>
                  <div style={{ fontSize:11, color:'var(--text3)' }}>{phase.desc}</div>
                </div>
              </div>
              <span style={{ fontSize:13, fontWeight:800, color:done===phaseDays.length?phase.color:'var(--text3)' }}>{done}/{phaseDays.length}</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(148px,1fr))', gap:8 }}>
              {phaseDays.map(day => {
                const isDone = completedDays.includes(day.id)
                return (
                  <button key={day.id} onClick={() => onOpenDay(day.id)}
                    style={{ background:isDone?phase.bg:'var(--surface)', border:`1.5px solid ${isDone?phase.color:'var(--border)'}`, borderRadius:'var(--rsm)', padding:'11px 12px', textAlign:'left', cursor:'pointer', transition:'transform .1s', boxShadow:isDone?'none':'var(--sh)' }}
                    onMouseDown={e => e.currentTarget.style.transform='scale(.97)'}
                    onMouseUp={e => e.currentTarget.style.transform=''}>
                    <div style={{ fontSize:11, color:isDone?phase.color:'var(--text3)', fontWeight:800, marginBottom:3 }}>{isDone?'✓ ':''}Ngày {day.id}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:isDone?phase.color:'var(--text)', lineHeight:1.3, marginBottom:5 }}>{day.title}</div>
                    <div style={{ fontSize:11, color:isDone?phase.color:'var(--primary)', fontWeight:600, lineHeight:1.4 }}>{day.output?.slice(0,40)}...</div>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
