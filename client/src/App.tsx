import { useState } from 'react'
import type { FormEvent } from 'react'

const sampleDialogue = `Alex: The client wants the campaign ready by Friday.
Maya: I can finish the copy and visuals by Wednesday afternoon.
Alex: Great. I will send the final assets to the client on Thursday for approval.
Maya: Perfect, I will share the draft with you once it is ready.`

const API_URL = import.meta.env.VITE_API_URL ?? ''

const Sparkle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="size-5">
    <path d="m12 3-1.4 5.6L5 10l5.6 1.4L12 17l1.4-5.6L19 10l-5.6-1.4L12 3Z" />
    <path d="m19 15-.6 2.4L16 18l2.4.6L19 21l.6-2.4L22 18l-2.4-.6L19 15Z" />
  </svg>
)

const Copy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="size-4">
    <rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
  </svg>
)

function App() {
  const [dialogue, setDialogue] = useState('')
  const [summary, setSummary] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const summarize = async (event: FormEvent) => {
    event.preventDefault()
    if (!dialogue.trim()) return
    setStatus('loading')
    setError('')
    setCopied(false)
    try {
      const response = await fetch(`${API_URL}/summarize`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dialogue }) })
      if (!response.ok) throw new Error(`The server returned ${response.status}.`)
      const data: { summary?: string } = await response.json()
      setSummary(data.summary || 'No summary was returned. Try a different dialogue.')
      setStatus('idle')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not reach the summarizer.')
      setStatus('error')
    }
  }

  const copySummary = async () => {
    await navigator.clipboard.writeText(summary)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const wordCount = dialogue.trim() ? dialogue.trim().split(/\s+/).length : 0

  return (
    <main className="min-h-screen overflow-hidden bg-[#060d1f] text-blue-50">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[38rem] bg-[radial-gradient(ellipse_at_top_left,_#123d7a_0%,_#0a2153_38%,_#060d1f_74%)]" />
      <div className="pointer-events-none absolute right-0 top-28 -z-0 size-80 rounded-full bg-cyan-400/20 blur-[110px]" />
      <nav className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <a href="/" className="flex items-center gap-3 font-semibold tracking-tight"><span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 text-white shadow-lg shadow-blue-500/30"><Sparkle /></span><span>Briefly<span className="text-cyan-300">.</span></span></a>
        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-blue-200 backdrop-blur">AI dialogue summarizer</span>
      </nav>
      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-14 pt-12 text-center sm:pt-20">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-100"><span className="size-1.5 rounded-full bg-cyan-300" /> Powered by T5 transformer</div>
        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl">Turn conversations into<br /><span className="bg-gradient-to-r from-cyan-200 via-blue-300 to-indigo-300 bg-clip-text text-transparent">clear next steps.</span></h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-blue-200/70 sm:text-lg">Paste any dialogue and get a polished, concise summary in seconds.</p>
      </section>
      <section className="relative z-10 mx-auto grid max-w-6xl gap-5 px-6 pb-16 lg:grid-cols-2 lg:px-8">
        <form onSubmit={summarize} className="rounded-3xl border border-white/10 bg-[#0c1d42]/80 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-7">
          <div className="mb-5 flex items-center justify-between"><div><h2 className="font-semibold text-white">Your dialogue</h2><p className="mt-1 text-sm text-blue-200/60">Add a conversation, meeting transcript, or notes.</p></div><button type="button" onClick={() => setDialogue(sampleDialogue)} className="text-sm font-medium text-cyan-300 transition hover:text-cyan-100">Use example</button></div>
          <textarea value={dialogue} onChange={(event) => setDialogue(event.target.value)} placeholder="Paste your conversation here..." className="h-72 w-full resize-none rounded-2xl border border-white/10 bg-[#07132e] p-4 text-sm leading-6 text-blue-50 outline-none transition placeholder:text-blue-300/30 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-400/15" />
          <div className="mt-3 flex items-center justify-between text-xs text-blue-300/45"><span>{wordCount} words</span><button type="button" onClick={() => setDialogue('')} className="hover:text-blue-100">Clear text</button></div>
          <button disabled={!dialogue.trim() || status === 'loading'} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40">{status === 'loading' ? <><span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Waking up the summarizer...</> : <><Sparkle /> Summarize dialogue</>}</button>
          <p className="mt-4 flex gap-2 rounded-xl border border-cyan-300/10 bg-cyan-300/5 px-3 py-2.5 text-xs leading-5 text-blue-100/65"><span className="font-semibold text-cyan-300">Note</span><span>The free API may sleep after inactivity. The first summary can take up to 50 seconds while the server wakes up—please keep this page open.</span></p>
          {status === 'error' && <p className="mt-4 rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}
        </form>
        <article className="relative overflow-hidden rounded-3xl border border-cyan-300/15 bg-[#0a1c40] p-5 text-white shadow-2xl shadow-black/30 sm:p-7">
          <div className="absolute -right-16 -top-16 size-52 rounded-full bg-cyan-400/25 blur-3xl" />
          <div className="relative flex items-center justify-between"><div><h2 className="font-semibold">Your brief</h2><p className="mt-1 text-sm text-blue-200/60">The essential context, without the noise.</p></div><span className="rounded-xl bg-white/10 p-2.5 text-cyan-200"><Sparkle /></span></div>
          <div className="relative mt-6 flex min-h-72 flex-col rounded-2xl border border-white/10 bg-black/15 p-5">{summary ? <><p className="whitespace-pre-wrap text-[15px] leading-7 text-blue-50">{summary}</p><div className="mt-auto pt-6"><button onClick={copySummary} className="flex items-center gap-2 text-sm font-medium text-cyan-200 transition hover:text-white"><Copy /> {copied ? 'Copied!' : 'Copy summary'}</button></div></> : <div className="m-auto max-w-xs text-center"><div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-white/10 text-cyan-200"><Sparkle /></div><p className="font-medium text-blue-100">Your summary will appear here</p><p className="mt-2 text-sm leading-6 text-blue-200/60">Add a dialogue on the left, then let the model do the heavy lifting.</p></div>}</div>
          <div className="relative mt-5 flex items-center gap-2 text-xs text-blue-200/60"><span className="size-1.5 rounded-full bg-cyan-300" /> Ready when you are</div>
        </article>
      </section>
    </main>
  )
}

export default App
