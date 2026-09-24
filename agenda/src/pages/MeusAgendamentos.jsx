import { useEffect, useState } from 'react'
import { AppointmentList } from '../components/appointments/AppointmentList.jsx'
import { CancellationNotice } from '../components/appointments/CancellationNotice.jsx'
import { PageHeader } from '../components/ui/PageHeader.jsx'
import { Button } from '../components/ui/Button.jsx'
import { cancelarAgendamento, listarAgendamentos } from '../services/mockAppointmentService.js'

export function MeusAgendamentos({ onNewAppointment }) {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [cancellingId, setCancellingId] = useState(null)

  async function loadAppointments() {
    setLoading(true)
    setError('')
    try {
      setAppointments(await listarAgendamentos())
    } catch {
      setError('Não foi possível carregar seus agendamentos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    listarAgendamentos()
      .then((items) => setAppointments(items))
      .catch(() => setError('Não foi possível carregar seus agendamentos.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleCancel(appointment) {
    if (!window.confirm('Deseja realmente cancelar este agendamento?')) return
    setCancellingId(appointment.id)
    setError('')
    setSuccess('')
    try {
      const cancelled = await cancelarAgendamento(appointment.id)
      setAppointments((current) => current.map((item) => item.id === cancelled.id ? cancelled : item))
      setSuccess('Agendamento cancelado com sucesso.')
    } catch (cancelError) {
      setError(cancelError.message)
    } finally {
      setCancellingId(null)
    }
  }

  function showPolicy() {
    document.getElementById('cancelamento')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <main className="appointments-page">
      <PageHeader title="Meus agendamentos" description="Acompanhe ou cancele seus próximos horários." action={<Button onClick={onNewAppointment}>Novo agendamento</Button>} />
      {loading && <p className="appointments-state">Carregando seus agendamentos...</p>}
      {error && <div className="appointments-feedback error" role="alert"><span>{error}</span><Button variant="secondary" onClick={loadAppointments}>Tentar novamente</Button></div>}
      {success && <p className="appointments-feedback success" role="status">{success}</p>}
      {!loading && !error && appointments.length === 0 && <div className="appointments-empty"><p>Você ainda não possui agendamentos.</p><Button onClick={onNewAppointment}>Novo agendamento</Button></div>}
      {!loading && appointments.length > 0 && <AppointmentList appointments={appointments} cancellingId={cancellingId} onCancel={handleCancel} onShowPolicy={showPolicy} />}
      {!loading && appointments.length > 0 && <CancellationNotice id="cancelamento" title="Por que não posso cancelar o primeiro horário?" message="O atendimento começa em menos de 2 horas. Para preservar o expediente do negócio, entre em contato diretamente com o prestador." />}
    </main>
  )
}
