import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, Route, Switch } from 'wouter'
import './App.css'
import './forms.css'

type QualificationFile = { id: number; title: string; owner: string; status: 'Draft' | 'Review' | 'Approved'; priority: 'Low' | 'Medium' | 'High' }
const api = '/api/items'

async function readEvidence(): Promise<QualificationFile[]> {
  const response = await fetch(api)
  if (!response.ok) throw new Error('The materials qualification service is unavailable.')
  return response.json()
}

async function createEvidence(item: Omit<QualificationFile, 'id'>): Promise<QualificationFile> {
  const response = await fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) })
  if (!response.ok) throw new Error('The qualification file could not be saved.')
  return response.json()
}

async function advanceEvidence(item: QualificationFile): Promise<QualificationFile> {
  const status = item.status === 'Draft' ? 'Review' : 'Approved'
  const response = await fetch(`${api}/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...item, status }) })
  if (!response.ok) throw new Error('The qualification file could not be updated.')
  return response.json()
}

function Register() {
  const cache = useQueryClient()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { data = [], isPending, error } = useQuery({ queryKey: ['evidence'], queryFn: readEvidence })
  const save = useMutation({ mutationFn: createEvidence, onSuccess: () => { cache.invalidateQueries({ queryKey: ['evidence'] }); setOpen(false) } })
  const advance = useMutation({ mutationFn: advanceEvidence, onSuccess: () => cache.invalidateQueries({ queryKey: ['evidence'] }) })
  const visible = data.filter((item) => `${item.title} ${item.owner} ${item.status}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => a.title.localeCompare(b.title))
  const approved = data.filter((item) => item.status === 'Approved').length
  const high = data.filter((item) => item.priority === 'High').length

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    save.mutate({ title: String(values.get('title')), owner: String(values.get('owner')), status: 'Draft', priority: String(values.get('priority')) as QualificationFile['priority'] })
  }

  return <main>
    <header className="hero"><div><span className="eyebrow">Move strategic materials from laboratory evidence to qualified industrial use</span><h1>Advanced Materials Qualification Office</h1><p>Help research, manufacturing and assurance teams coordinate test evidence, circularity checks and production readiness.</p></div><button className="primary" onClick={() => setOpen(!open)}>{open ? 'Close form' : 'Add qualification file'}</button></header>
    <section className="metrics" aria-label="materials qualification summary"><article><span>Files tracked</span><strong>{isPending ? '…' : data.length}</strong><small>Shared qualification view</small></article><article><span>Approved</span><strong>{approved}</strong><small>Evidence accepted</small></article><article><span>High priority</span><strong>{high}</strong><small>Industrial dependency risk</small></article></section>
    {open && <form className="panel form" onSubmit={submit}><h2>Add a qualification file</h2><label>Material or qualification programme<input required name="title" minLength={4} placeholder="Example: nanocoating corrosion qualification" /></label><label>Responsible laboratory or industrial team<input required name="owner" minLength={3} placeholder="Example: Brussels Materials Assurance Lab" /></label><label>Priority<select name="priority"><option>High</option><option>Medium</option><option>Low</option></select></label><button className="primary" disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save qualification file'}</button>{save.error && <p role="alert">{save.error.message}</p>}</form>}
    <section className="panel"><div className="panel-title"><h2>Industrial qualification pipeline</h2><span>{error ? 'Connection problem' : 'Live API data'}</span></div><label className="search">Find a qualification file<input aria-label="Find a qualification file" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by material, laboratory, sector or status" /></label>{error && <p role="alert">{error.message}</p>}{!isPending && !error && visible.length === 0 && <p>No qualification files match this view.</p>}{visible.map((item) => <div className="row" key={item.id}><span className={`dot ${item.status === 'Approved' ? '' : 'degraded'}`} /><div><b>{item.title}</b><small>{item.owner} · {item.status}</small></div><strong>{item.priority}</strong>{item.status !== 'Approved' && <button className="secondary" disabled={advance.isPending} onClick={() => advance.mutate(item)}>Move to {item.status === 'Draft' ? 'review' : 'approved'}</button>}</div>)}</section>
  </main>
}

function About() { return <main><header className="hero"><div><span className="eyebrow">Why it matters</span><h1>Industrial uptake depends on trusted, reusable qualification evidence</h1></div></header><section className="panel prose"><h2>A clear path from laboratory result to production decision</h2><p>Teams can see who owns each material file, which evidence is ready and what remains before qualification.</p></section></main> }

export default function App() { return <div className="shell"><nav><b>MaterialPathEU<span>/qualification office</span></b><div><Link href="/">Qualification files</Link><Link href="/about">Purpose</Link></div></nav><Switch><Route path="/" component={Register} /><Route path="/about" component={About} /></Switch></div> }
