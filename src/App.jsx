import { useState } from 'react'
import { useProgress } from './hooks/useProgress'
import Setup from './pages/Setup'
import Home from './pages/Home'
import DayView from './pages/DayView'
import Dashboard from './pages/Dashboard'

function BottomNav({ view, setView }) {
  const tabs = [{ id:'home', icon:'🎬', label:'Làm Phim' }, { id:'parent', icon:'📊', label:'Phụ Huynh' }]
  return (
    <nav style={{ position:'fixed', bottom:0, left:0, right:0, height:64, background:'var(--surface)', borderTop:'1px solid var(--border)', display:'flex', zIndex:50 }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setView(t.id)}
          style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2, background:'none',
            color:view===t.id?'var(--primary)':'var(--text3)', fontSize:12, fontWeight:800,
            borderTop:`3px solid ${view===t.id?'var(--primary)':'transparent'}` }}>
          <span style={{ fontSize:22 }}>{t.icon}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default function App() {
  const { state, update, completeDay, saveActivityProgress, saveChatMessage, saveJournal, saveAutoReport, exportData, resetAll } = useProgress()
  const [view, setView] = useState('home')
  const [activeDay, setActiveDay] = useState(null)

  if (!state.childName) return <Setup onComplete={update} />

  if (view === 'day' && activeDay) {
    return <DayView
      dayId={activeDay} state={state}
      onBack={() => { setActiveDay(null); setView('home') }}
      onComplete={completeDay}
      onSaveJournal={saveJournal}
      onSaveChatMessage={saveChatMessage}
      onSaveActivityProgress={saveActivityProgress}
      onSaveAutoReport={saveAutoReport}
    />
  }

  return (
    <div style={{ paddingBottom:64 }}>
      {view==='home' && <Home state={state} onOpenDay={(id) => { setActiveDay(id); setView('day') }} />}
      {view==='parent' && <Dashboard state={state} onUpdate={update} onReset={resetAll} onExport={exportData} />}
      <BottomNav view={view} setView={setView} />
    </div>
  )
}
