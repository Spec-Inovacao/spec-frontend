import { useState } from 'react'
import { BookingSummaryCard } from '../components/booking/BookingSummaryCard.jsx'
import { Button } from '../components/ui/Button.jsx'
import { confirmarAgendamento } from '../services/bookingService.js'

export function ConfirmarAgendamento({ appointment, onBack, onConfirmed, onStart }) {
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState('')

  if (!appointment) {
    return (
      <main className="schedule-page confirmation-page confirmation-empty">
        <div className="page-heading"><h1>Confirme seu agendamento</h1><p>Não encontramos um serviço, data ou horário selecionado.</p></div>
        <Button onClick={onStart}>Escolher serviço</Button>
      </main>
    )
  }

  async function handleConfirm() {
    setConfirming(true)
    setError('')
    try {
      const confirmedBooking = await confirmarAgendamento(appointment)
      onConfirmed(confirmedBooking)
    } catch (confirmationError) {
      setError(confirmationError.message || 'Não foi possível confirmar o agendamento.')
    } finally {
      setConfirming(false)
    }
  }

  return (
    <main className="schedule-page confirmation-page">
      <div className="page-heading">
        <h1>Confirme seu agendamento</h1>
        <p>Revise os dados antes de reservar o horário.</p>
      </div>
      {error && <p className="confirmation-error" role="alert">{error}</p>}
      <BookingSummaryCard booking={appointment} minimumHours={appointment.cancellationMinimumHours} onBack={onBack} onConfirm={handleConfirm} confirming={confirming} />
    </main>
  )
}
