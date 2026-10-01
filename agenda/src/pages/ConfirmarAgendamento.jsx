import { useState } from 'react'
import { BookingSummaryCard } from '../components/booking/BookingSummaryCard.jsx'
import { Button } from '../components/ui/Button.jsx'
import { criarAgendamento } from '../services/agendamentos.js'
import { getSavedClient, saveClient } from '../services/clientStorage.js'
import { criarUsuario } from '../services/usuarios.js'

function sameCustomer(saved, customer) {
  return saved
    && saved.nome === customer.nome
    && saved.email === customer.email
    && saved.telefone === customer.telefone
}

export function ConfirmarAgendamento({ appointment, minimumHours, onBack, onConfirmed, onStart }) {
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState('')
  const [customer, setCustomer] = useState(() => {
    const saved = getSavedClient()
    return { nome: saved?.nome || '', email: saved?.email || '', telefone: saved?.telefone || '' }
  })

  if (!appointment) {
    return (
      <main className="schedule-page confirmation-page confirmation-empty">
        <div className="page-heading"><h1>Confirme seu agendamento</h1><p>Não encontramos um serviço, data ou horário selecionado.</p></div>
        <Button onClick={onStart}>Escolher serviço</Button>
      </main>
    )
  }

  function handleCustomerChange(event) {
    const { name, value } = event.target
    setCustomer((current) => ({ ...current, [name]: value }))
  }

  async function handleConfirm(event) {
    event.preventDefault()
    setConfirming(true)
    setError('')
    try {
      const profile = {
        nome: customer.nome.trim(),
        email: customer.email.trim(),
        telefone: customer.telefone.trim(),
      }
      let saved = getSavedClient()
      if (!sameCustomer(saved, profile)) {
        const created = await criarUsuario(profile)
        const user = created?.data || created?.usuario || created
        if (user?.id == null) throw new Error('A API não retornou o ID do cliente criado.')
        saved = { id: user.id, ...profile }
        saveClient(saved)
      }
      const payload = {
        clienteId: saved.id,
        servicoId: appointment.service.id,
        dtInicio: appointment.dtInicio,
        dtFim: appointment.dtFim,
      }
      const result = await criarAgendamento(payload)
      onConfirmed({ ...appointment, ...(result?.data || result || {}), clienteId: saved.id })
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
      <form onSubmit={handleConfirm}>
        <BookingSummaryCard booking={appointment} customer={customer} onCustomerChange={handleCustomerChange} minimumHours={minimumHours ?? appointment.cancellationMinimumHours} onBack={onBack} confirming={confirming} />
      </form>
    </main>
  )
}
