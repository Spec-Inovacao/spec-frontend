import { useCallback, useEffect, useState } from 'react'
import { Button } from '../components/ui/Button.jsx'
import { PageHeader } from '../components/ui/PageHeader.jsx'
import { ApiUnavailableCard, OwnerAgendaCard, OwnerMetricCard, OwnerRulesCard } from '../components/owner/OwnerComponents.jsx'
import { ownerApi } from '../services/ownerApi.js'
import '../styles/owner.css'

const today = () => new Date().toISOString().slice(0, 10)
export function AgendaProprietario({ onNavigate }) {
  const [date, setDate] = useState(today)
  const [agenda, setAgenda] = useState([])
  const [summary, setSummary] = useState([])
  const [state, setState] = useState('loading')
  const [error, setError] = useState('')
  const load = useCallback(async () => {
    setState('loading'); setError('')
    try { const [nextAgenda, nextSummary] = await Promise.all([ownerApi.getAgenda(date), ownerApi.getSummary(date)]); setAgenda(nextAgenda); setSummary(nextSummary); setState('ready') } catch (nextError) { setError(nextError.message); setState('error') }
  }, [date])
  useEffect(() => { queueMicrotask(() => { void load() }) }, [load])
  return <section className="owner-page"><PageHeader title="Agenda diária" description="Acompanhe os atendimentos e a operação do dia." action={<Button onClick={() => onNavigate('owner-add')}>Adicionar agendamento</Button>} /><nav className="owner-tabs" aria-label="Navegação da área do proprietário"><button className="active" type="button">Agenda</button><button type="button" onClick={() => onNavigate('owner-settings')}>Configurações</button><button type="button" onClick={() => onNavigate('owner-add')}>Novo agendamento</button></nav><div className="owner-toolbar"><label>Data<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label><Button variant="secondary" onClick={load}>Atualizar</Button></div>{state === 'loading' && <p className="owner-state">Carregando agenda...</p>}{state === 'error' && <div className="owner-feedback error"><p>{error}</p><Button onClick={load}>Tentar novamente</Button></div>}{state === 'ready' && <><div className="owner-metrics">{summary.map((metric) => <OwnerMetricCard key={metric.label} {...metric} />)}</div><div className="owner-content-grid"><div><h2>Atendimentos</h2>{agenda.length ? <div className="owner-agenda-list">{agenda.map((item, index) => <OwnerAgendaCard key={index} item={item} />)}</div> : <div className="owner-empty">Não há atendimentos para esta data.</div>}</div><div className="owner-side"><OwnerRulesCard onSettings={() => onNavigate('owner-settings')} /><ApiUnavailableCard title="Bloqueio de horário" description="O bloqueio de horário depende de um endpoint administrativo do backend." /><ApiUnavailableCard title="Finalização de atendimento" description="A finalização de atendimento depende de um endpoint administrativo do backend." /></div></div></>}</section>
}
