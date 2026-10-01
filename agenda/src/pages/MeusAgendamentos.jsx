import { useEffect, useState } from 'react'
import { AppointmentList } from '../components/appointments/AppointmentList.jsx'
import { CancellationNotice } from '../components/appointments/CancellationNotice.jsx'
import { PageHeader } from '../components/ui/PageHeader.jsx'
import { Button } from '../components/ui/Button.jsx'
import { cancelarAgendamento, listarAgendamentos } from '../services/agendamentos.js'
import { getSavedClient } from '../services/clientStorage.js'

export function MeusAgendamentos({ configuration, onNewAppointment }) {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [cancellingId, setCancellingId] = useState(null)
  const [reload, setReload] = useState(0)
  const minimumHours = Number(configuration?.cancelamentominhora) || 2
  const clientId = getSavedClient()?.id

  useEffect(() => {
    let active = true
    async function loadAppointments() {
      setLoading(true)
      setError('')
      if (clientId == null) {
        setAppointments([])
        setLoading(false)
        return
      }
      try {
        const payload = await listarAgendamentos(clientId)
        if (active) setAppointments(Array.isArray(payload) ? payload : payload?.items || payload?.data || [])
      } catch (loadError) {
        if (active) setError(loadError.message || 'Não foi possível carregar seus agendamentos.')
      } finally {
        if (active) setLoading(false)
      }
    }
    loadAppointments()
    return () => { active = false }
  }, [clientId, reload])

  async function handleCancel(appointment) {
    if (!window.confirm('Deseja realmente cancelar este agendamento?')) return
    setCancellingId(appointment.id)
    setError('')
    setSuccess('')
    try {
      await cancelarAgendamento(appointment.id)
      setSuccess('Agendamento cancelado com sucesso.')
      setReload((current) => current + 1)
    } catch (cancelError) {
      setError(cancelError.message)
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <main className="appointments-page">
      <PageHeader title="Meus agendamentos" description="Acompanhe ou cancele seus próximos horários." action={<Button onClick={onNewAppointment}>Novo agendamento</Button>} />
      {loading && <p className="appointments-state">Carregando seus agendamentos...</p>}
      {error && <div className="appointments-feedback error" role="alert"><span>{error}</span><Button variant="secondary" onClick={() => setReload((current) => current + 1)}>Tentar novamente</Button></div>}
      {success && <p className="appointments-feedback success" role="status">{success}</p>}
      {!loading && !error && appointments.length === 0 && <div className="appointments-empty"><p>Você ainda não possui agendamentos.</p><Button onClick={onNewAppointment}>Novo agendamento</Button></div>}
      {!loading && appointments.length > 0 && <AppointmentList appointments={appointments} cancellingId={cancellingId} minimumHours={minimumHours} onCancel={handleCancel} />}
      {!loading && appointments.some((item) => item.podeCancelar === false) && <CancellationNotice title="Cancelamento bloqueado" message={`O cancelamento exige antecedência mínima de ${minimumHours} horas antes do início do atendimento.`} />}
    </main>
  )
}
