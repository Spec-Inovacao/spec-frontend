import { useCallback, useEffect, useState } from 'react'
import { Button } from '../components/ui/Button.jsx'
import { PageHeader } from '../components/ui/PageHeader.jsx'
import { AvailabilitySettingsCard, ApiUnavailableCard } from '../components/owner/OwnerComponents.jsx'
import { ownerApi } from '../services/ownerApi.js'
import '../styles/owner.css'

const initialValue = { startTime: '', endTime: '', cancellationHours: '', days: [] }
export function ConfiguracoesProprietario({ onNavigate }) {
  const [value, setValue] = useState(initialValue); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [feedback, setFeedback] = useState('')
  const load = useCallback(async () => { setLoading(true); setFeedback(''); try { setValue(await ownerApi.getConfiguration()) } catch (error) { setFeedback(error.message) } finally { setLoading(false) } }, [])
  useEffect(() => { queueMicrotask(() => { void load() }) }, [load])
  const change = (field, fieldValue) => setValue((current) => ({ ...current, [field]: fieldValue }))
  const changeDay = (day, selected) => setValue((current) => ({ ...current, days: selected ? [...current.days, day] : current.days.filter((item) => item !== day) }))
  async function save() { setSaving(true); setFeedback(''); try { setValue(await ownerApi.saveConfiguration(value)); setFeedback('Configurações salvas com sucesso.') } catch (error) { setFeedback(error.message) } finally { setSaving(false) } }
  return <section className="owner-page"><PageHeader title="Configurações de disponibilidade" description="Defina quando sua agenda pode receber atendimentos." action={<Button variant="secondary" onClick={() => onNavigate('owner-agenda')}>Voltar à agenda</Button>} /><nav className="owner-tabs" aria-label="Navegação da área do proprietário"><button type="button" onClick={() => onNavigate('owner-agenda')}>Agenda</button><button className="active" type="button">Configurações</button><button type="button" onClick={() => onNavigate('owner-add')}>Novo agendamento</button></nav>{loading ? <p className="owner-state">Carregando configurações...</p> : <><AvailabilitySettingsCard value={value} onChange={change} onDayChange={changeDay} onSave={save} saving={saving} />{feedback && <p className={`owner-feedback ${feedback.includes('sucesso') ? 'success' : 'error'}`}>{feedback}</p>}<ApiUnavailableCard title="Bloqueio de horário" description="Esta ação será habilitada quando houver suporte de endpoint no backend." /></>}</section>
}
