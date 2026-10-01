import { useEffect, useState } from 'react'
import { Button } from '../components/ui/Button.jsx'
import { PageHeader } from '../components/ui/PageHeader.jsx'
import { AddAppointmentCard } from '../components/owner/OwnerComponents.jsx'
import { ownerApi } from '../services/ownerApi.js'
import '../styles/owner.css'

const initialValue = { clienteId: '', servicoId: '', date: '', slot: '' }
export function AdicionarAgendamento({ onNavigate }) {
  const [clients, setClients] = useState([]); const [services, setServices] = useState([]); const [value, setValue] = useState(initialValue); const [slots, setSlots] = useState([]); const [loading, setLoading] = useState(true); const [loadingSlots, setLoadingSlots] = useState(false); const [saving, setSaving] = useState(false); const [feedback, setFeedback] = useState('')
  useEffect(() => { Promise.all([ownerApi.listUsers(), ownerApi.listServices()]).then(([nextClients, nextServices]) => { setClients(nextClients); setServices(nextServices) }).catch((error) => setFeedback(error.message)).finally(() => setLoading(false)) }, [])
  useEffect(() => { queueMicrotask(() => { if (!value.servicoId || !value.date) { setSlots([]); return } setLoadingSlots(true); setFeedback(''); ownerApi.getAvailability(value.servicoId, value.date).then(setSlots).catch((error) => setFeedback(error.message)).finally(() => setLoadingSlots(false)) }) }, [value.servicoId, value.date])
  const change = (field, fieldValue) => setValue((current) => ({ ...current, [field]: fieldValue, ...(field === 'servicoId' || field === 'date' ? { slot: '' } : {}) }))
  async function submit() { setSaving(true); setFeedback(''); try { await ownerApi.createAppointment({ clienteId: value.clienteId, servicoId: value.servicoId, dtInicio: value.slot }); setFeedback('Agendamento criado com sucesso.'); setValue(initialValue); setSlots([]) } catch (error) { setFeedback(error.message) } finally { setSaving(false) } }
  return <section className="owner-page"><PageHeader title="Adicionar agendamento" description="Registre um atendimento usando um horário confirmado como disponível." action={<Button variant="secondary" onClick={() => onNavigate('owner-agenda')}>Voltar à agenda</Button>} /><nav className="owner-tabs" aria-label="Navegação da área do proprietário"><button type="button" onClick={() => onNavigate('owner-agenda')}>Agenda</button><button type="button" onClick={() => onNavigate('owner-settings')}>Configurações</button><button className="active" type="button">Novo agendamento</button></nav>{loading ? <p className="owner-state">Carregando clientes e serviços...</p> : <><AddAppointmentCard clients={clients} services={services} value={value} slots={slots} loadingSlots={loadingSlots} onChange={change} onSelectSlot={(slot) => change('slot', slot)} onSubmit={submit} saving={saving} />{feedback && <p className={`owner-feedback ${feedback.includes('sucesso') ? 'success' : 'error'}`}>{feedback}</p>}</>}</section>
}
