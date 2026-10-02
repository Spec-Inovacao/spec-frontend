import { useEffect, useState } from 'react'
import { AppointmentList } from '../components/appointments/AppointmentList.jsx'
import { CancelConfirmation } from '../components/appointments/CancelConfirmation.jsx'
import { CancellationNotice } from '../components/appointments/CancellationNotice.jsx'
import { PageHeader } from '../components/ui/PageHeader.jsx'
import { Button } from '../components/ui/Button.jsx'
import { cancelarAgendamento, listarAgendamentos } from '../services/agendamentos.js'
import { isAppointmentCancelled } from '../utils/appointmentFormatters.js'

const SUCCESS_DISMISS_MS = 4000

export function MeusAgendamentos({ configuration, onNewAppointment }) {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [cancellingId, setCancellingId] = useState(null)
  const [pendingCancel, setPendingCancel] = useState(null)
  const [reload, setReload] = useState(0)
  const minimumHours = Number(configuration?.cancelamentominhora) || 2
  const clientId = 4

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

  useEffect(() => {
    if (!success) return undefined
    const timer = setTimeout(() => setSuccess(''), SUCCESS_DISMISS_MS)
    return () => clearTimeout(timer)
  }, [success])

  function handleCancelRequest(appointment) {
    setError('')
    setSuccess('')
    setPendingCancel(appointment)
  }

  function handleDismissConfirm() {
    if (cancellingId != null) return
    setPendingCancel(null)
  }

  async function handleConfirmCancel() {
    if (!pendingCancel) return
    const appointment = pendingCancel
    setCancellingId(appointment.id)
    setError('')
    setSuccess('')
    try {
      await cancelarAgendamento(appointment.id)
      setPendingCancel(null)
      setSuccess('Agendamento cancelado com sucesso.')
      setReload((current) => current + 1)
    } catch (cancelError) {
      setError(cancelError.message)
    } finally {
      setCancellingId(null)
    }
  }

  const hasBlockedActive = appointments.some(
    (item) => !isAppointmentCancelled(item) && item.podeCancelar === false,
  )

  return (
    <main className="appointments-page">
      <PageHeader title="Meus agendamentos" description="Acompanhe ou cancele seus próximos horários." action={<Button onClick={onNewAppointment}>Novo agendamento</Button>} />
      {loading && <p className="appointments-state">Carregando seus agendamentos...</p>}
      {error && <div className="appointments-feedback error" role="alert"><span>{error}</span><Button variant="secondary" onClick={() => setReload((current) => current + 1)}>Tentar novamente</Button></div>}
      {success && <p className="appointments-feedback success" role="status">{success}</p>}
      {!loading && !error && appointments.length === 0 && <div className="appointments-empty"><p>Você ainda não possui agendamentos.</p><Button onClick={onNewAppointment}>Novo agendamento</Button></div>}
      {!loading && appointments.length > 0 && <AppointmentList appointments={appointments} cancellingId={cancellingId} minimumHours={minimumHours} onCancel={handleCancelRequest} />}
      {!loading && hasBlockedActive && <CancellationNotice title="Cancelamento bloqueado" message={`O cancelamento exige antecedência mínima de ${minimumHours} horas antes do início do atendimento.`} />}
      <CancelConfirmation
        appointment={pendingCancel}
        confirming={cancellingId != null}
        onConfirm={handleConfirmCancel}
        onDismiss={handleDismissConfirm}
      />
    </main>
  )
}
