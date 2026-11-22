import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Award, ChartNoAxesColumnIncreasing, Clock3, Keyboard, Menu, RotateCcw, ShieldCheck, Sparkles, Trophy, Zap } from 'lucide-react'

const passages = [
  'Great things are built one focused moment at a time. Stay calm, trust your rhythm, and let every keystroke move you closer to your goal.',
  'Speed is useful, but accuracy creates confidence. Practice with purpose, keep your hands relaxed, and improve a little every single day.',
  'Champions are not made in a single round. They learn from mistakes, build consistency, and return stronger with every new challenge.',
]
type Result = { wpm: number; accuracy: number; date: string; duration: number }

export default function App() {
  const [page, setPage] = useState<'home' | 'test' | 'dashboard'>('home')
  const [duration, setDuration] = useState(30)
  const [text, setText] = useState(passages[0])
  const [typed, setTyped] = useState('')
  const [timeLeft, setTimeLeft] = useState(30)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const [results, setResults] = useState<Result[]>(() => {
    try { return JSON.parse(localStorage.getItem('master-typing-results') || '[]') as Result[] } catch { return [] }
  })
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const correct = useMemo(() => typed.split('').filter((char, i) => char === text[i]).length, [typed, text])
  const errors = Math.max(0, typed.length - correct)
  const elapsed = duration - timeLeft
  const wpm = Math.round((correct / 5) / Math.max(elapsed / 60, 1 / 60))
  const accuracy = typed.length ? Math.round((correct / typed.length) * 100) : 100

  useEffect(() => {
    if (!running || timeLeft <= 0) return
    const timer = window.setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => window.clearInterval(timer)
  }, [running, timeLeft])

  useEffect(() => {
    if (timeLeft === 0 && running) finishTest()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, running])

  function startTest(nextDuration = duration) {
    const nextText = passages[Math.floor(Math.random() * passages.length)]
    setDuration(nextDuration); setTimeLeft(nextDuration); setText(nextText)
    setTyped(''); setFinished(false); setRunning(false)
    window.setTimeout(() => inputRef.current?.focus(), 50)
  }
  function finishTest() {
    setRunning(false); setFinished(true)
    const finalWpm = Math.round((correct / 5) / Math.max((duration - timeLeft) / 60, 1 / 60))
    const item = { wpm: finalWpm, accuracy, date: new Date().toLocaleDateString(), duration }
    setResults(old => {
      const updated = [item, ...old].slice(0, 20)
      localStorage.setItem('master-typing-results', JSON.stringify(updated))
      return updated
    })
  }
  function handleTyping(value: string) {
    if (finished) return
    if (!running && value.length > 0) setRunning(true)
    setTyped(value.slice(0, text.length))
    if (value.length >= text.length) {
      setRunning(false); setFinished(true)
      const finalCorrect = value.slice(0, text.length).split('').filter((c, i) => c === text[i]).length
      const item = { wpm: Math.round((finalCorrect / 5) / Math.max((duration - timeLeft) / 60, 1 / 60)), accuracy: Math.round(finalCorrect / text.length * 100), date: new Date().toLocaleDateString(), duration }
      setResults(old => { const updated = [item, ...old].slice(0, 20); localStorage.setItem('master-typing-results', JSON.stringify(updated)); return updated })
    }
  }

  const completed = results.length
  const best = results.length ? Math.max(...results.map(r => r.wpm)) : 0

  return <div className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={() => setPage('home')} aria-label="MASTER TYPING home"><span className="brand-mark"><Keyboard size={21}/></span><span>MASTER<span className="green">TYPING</span></span></button>
      <nav><button className={page === 'home' ? 'nav-active' : ''} onClick={() => setPage('home')}>Home</button><button className={page === 'test' ? 'nav-active' : ''} onClick={() => { setPage('test'); startTest(30) }}>Typing test</button><button className={page === 'dashboard' ? 'nav-active' : ''} onClick={() => setPage('dashboard')}>Dashboard</button></nav>
      <button className="nav-cta" onClick={() => { setPage('test'); startTest(30) }}>Start practicing <ArrowRight size={16}/></button>
    </header>

    {page === 'home' && <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse"/> THE NEXT LEVEL OF TYPING</div>
          <h1>TYPE FASTER.<br/><span>THINK SHARPER.</span><br/>OWN EVERY KEY.</h1>
          <p className="hero-description">Train your reflexes, sharpen your accuracy, and turn every keystroke into progress. Your next personal best starts here.</p>
          <div className="hero-actions"><button className="primary-btn" onClick={() => { setPage('test'); startTest(30) }}>Start typing test <ArrowRight size={18}/></button><button className="text-btn" onClick={() => setPage('dashboard')}>View my progress</button></div>
          <div className="hero-proof"><div className="avatar-stack"><i>⌨</i><i>⚡</i><i>✦</i></div><span>Practice. Compete. Improve.</span></div>
        </div>
        <div className="keyboard-stage">
          <div className="stage-glow"/><div className="orbit orbit-one"/><div className="orbit orbit-two"/>
          <div className="keyboard-3d"><div className="keyboard-top"><div className="keyboard-label">MASTER TYPING <span>MK–01</span></div><div className="key-grid">{['ESC','1','2','3','4','5','6','7','8','9','0','Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','SHIFT','Z','X','C','V','B','N','M','ENTER','CTRL','ALT','SPACE','ALT','FN'].map((key, i) => <span className={`key ${[13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30].includes(i) ? 'lit' : ''} ${key === 'SPACE' ? 'space-key' : ''}`} key={`${key}-${i}`}>{key}</span>)}</div></div></div>
          <div className="stage-caption"><span><i/> LIVE PRACTICE MODE</span><span>01 / 04</span></div>
        </div>
      </section>
      <section className="stats-strip"><div><strong>15–120<span>s</span></strong><small>TEST DURATIONS</small></div><div><strong>∞</strong><small>ROOM TO IMPROVE</small></div><div><strong>01<span>%</span></strong><small>BETTER EVERY DAY</small></div><div><strong>100<span>%</span></strong><small>YOUR NEXT MOVE</small></div></section>
      <section className="features"><div className="section-heading"><div className="eyebrow">BUILT FOR YOUR PROGRESS</div><h2>Every keystroke counts.</h2><p>Simple tools. Serious improvement. A space to build your edge.</p></div><div className="feature-grid">
        <article><span className="feature-icon"><Zap/></span><h3>Speed training</h3><p>Build a smoother rhythm with focused typing sessions and live feedback.</p></article>
        <article><span className="feature-icon"><ShieldCheck/></span><h3>Accuracy first</h3><p>Track mistakes as you type and learn to balance speed with precision.</p></article>
        <article><span className="feature-icon"><Trophy/></span><h3>Beat your best</h3><p>Keep your recent results close and challenge yourself to improve.</p></article>
      </div></section>
    </main>}

    {page === 'test' && <main className="inner-page"><div className="page-title"><div className="eyebrow">FOCUS MODE / 001</div><h1>Find your <span>rhythm.</span></h1><p>Type the passage below. The clock starts with your first keystroke.</p></div>
      <div className="test-panel">
        <div className="test-toolbar"><div className="duration-picks">{[15,30,60,120].map(d => <button key={d} className={duration === d ? 'selected' : ''} onClick={() => startTest(d)}>{d}s</button>)}</div><button className="reset-btn" onClick={() => startTest(duration)}><RotateCcw size={15}/> Restart</button></div>
        <div className="metrics"><div><small>TIME LEFT</small><strong>{timeLeft}<em>s</em></strong></div><div><small>WPM</small><strong>{wpm}</strong></div><div><small>ACCURACY</small><strong>{accuracy}<em>%</em></strong></div><div><small>ERRORS</small><strong>{errors}</strong></div></div>
        <div className="passage" onClick={() => inputRef.current?.focus()}>{text.split('').map((char, i) => <span key={i} className={i < typed.length ? (typed[i] === char ? 'correct-char' : 'wrong-char') : i === typed.length ? 'current-char' : ''}>{char}</span>)}</div>
        <textarea ref={inputRef} value={typed} onChange={e => handleTyping(e.target.value)} disabled={finished} placeholder={finished ? 'Test complete — restart to try again.' : 'Click here and start typing the passage...'} spellCheck={false}/>
        {finished ? <div className="result-banner"><Award/><div><b>Session complete!</b><span>Your result: {wpm} WPM · {accuracy}% accuracy</span></div><button onClick={() => startTest(duration)}>Try again <ArrowRight size={15}/></button></div> : <div className="test-hint"><span><kbd>TIP</kbd> Accuracy creates speed. Stay relaxed.</span><span>{typed.length} / {text.length} characters</span></div>}
      </div>
    </main>}

    {page === 'dashboard' && <main className="inner-page"><div className="page-title"><div className="eyebrow">YOUR PERSONAL SPACE</div><h1>Progress, <span>unlocked.</span></h1><p>Your practice history is saved in this browser.</p></div><div className="dashboard-grid"><div className="dash-card"><span className="feature-icon"><ChartNoAxesColumnIncreasing/></span><small>PERSONAL BEST</small><strong>{best} <em>WPM</em></strong></div><div className="dash-card"><span className="feature-icon"><Clock3/></span><small>TESTS COMPLETED</small><strong>{completed}</strong></div><div className="dash-card"><span className="feature-icon"><Sparkles/></span><small>KEEP THE STREAK</small><strong>{completed ? 'In motion' : 'Start today'}</strong></div></div><div className="history-card"><div className="history-head"><h2>Recent sessions</h2><button onClick={() => { localStorage.removeItem('master-typing-results'); setResults([]) }}>Clear history</button></div>{results.length ? results.map((r,i) => <div className="history-row" key={`${r.date}-${i}`}><span>{r.date}</span><b>{r.wpm} WPM</b><span>{r.accuracy}% accuracy</span><span>{r.duration}s test</span></div>) : <div className="empty-state"><Trophy size={30}/><b>Your first record is waiting.</b><span>Complete a typing test to see your progress here.</span><button className="primary-btn" onClick={() => { setPage('test'); startTest(30) }}>Take a test <ArrowRight size={16}/></button></div>}</div></main>}

    <footer><div className="footer-brand">MASTER<span className="green">TYPING</span></div><span>TYPE FASTER. THINK SHARPER. MASTER EVERY KEYSTROKE.</span><span>© 2026 MASTER TYPING</span></footer>
  </div>
}