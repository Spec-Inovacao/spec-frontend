import { useEffect, useState } from 'react'
import { consultarDisponibilidade, listarServicos } from '../services/mockAgendaService.js'

function tomorrow() {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().slice(0, 10)
}

function formatCurrency(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function BookingFlow({ onViewAppointments, onCancellationHours, onChooseService }) {
  const [services, setServices] = useState([])
  const [availability, setAvailability] = useState(null)
  const [serviceId, setServiceId] = useState('')
  const [date, setDate] = useState(tomorrow())
  const [loading, setLoading] = useState(true)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [showBooking, setShowBooking] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [confirmation, setConfirmation] = useState(null)

  useEffect(() => {
    Promise.all([listarServicos(), consultarDisponibilidade()])
      .then(([availableServices, initialAvailability]) => {
        setServices(availableServices)
        setAvailability(initialAvailability)
        onCancellationHours(initialAvailability.cancellationHours)
      })
      .finally(() => setLoading(false))
  }, [onCancellationHours])

  useEffect(() => {
    if (!serviceId) return
    consultarDisponibilidade()
      .then((nextAvailability) => {
        setAvailability(nextAvailability)
        onCancellationHours(nextAvailability.cancellationHours)
      })
      .finally(() => setLoadingSlots(false))
  }, [serviceId, onCancellationHours])

  function selectService(value) {
    const selectedService = services.find((service) => String(service.id) === String(value))
    if (onChooseService) {
      onChooseService(selectedService)
      return
    }
    setServiceId(String(value))
    setSelectedSlot('')
    setLoadingSlots(true)
    setShowBooking(true)
    setConfirmation(null)
  }

  function changeDate(value) {
    setDate(value)
    setSelectedSlot('')
    setLoadingSlots(true)
    consultarDisponibilidade().then((nextAvailability) => {
      setAvailability(nextAvailability)
      setLoadingSlots(false)
    })
  }

  function confirmAppointment() {
    setConfirmation({ slot: selectedSlot })
  }

  if (loading) return <p className="loading page-state">Carregando agenda...</p>

  return (
    <div className="booking-home">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Agende sem complicação</p>
          <h1>Seu próximo atendimento,<br />no melhor horário.</h1>
          <p>Escolha o serviço e veja apenas horários realmente disponíveis dentro do expediente.</p>
          <div className="hero-actions">
            <button className="button button-primary" type="button" onClick={() => document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' })}>Agendar atendimento</button>
            <button className="button button-secondary" type="button" onClick={onViewAppointments}>Ver meus horários</button>
          </div>
        </div>
        <aside className="availability-card" aria-live="polite">
          <h2>Disponibilidade</h2>
          <p className="availability-date">{availability?.dateLabel}</p>
          <div className="availability-times">
            {availability?.slots.map((slot) => <span key={slot}>{slot}</span>)}
          </div>
          <p className="availability-hours">Expediente: {availability?.workHours}</p>
          <p className="availability-policy">{availability?.cancellationText}</p>
        </aside>
      </section>

      <section className="services-section" id="servicos">
        <div className="section-heading compact-heading">
          <h2>Escolha um serviço</h2>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article className={`service-card ${String(service.id) === serviceId ? 'selected' : ''}`} key={service.id}>
              <div className="service-card-top"><h3>{service.nome}</h3><span>{service.tempomin} min</span></div>
              <p className="service-description">{service.descricao}</p>
              <div className="service-card-bottom"><strong>{formatCurrency(service.preco)}</strong><button className="choose-button" type="button" onClick={() => selectService(service.id)}>Escolher</button></div>
            </article>
          ))}
        </div>
      </section>

      {showBooking && (
        <div className="booking-dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setShowBooking(false)}>
          <section className="booking-dialog" role="dialog" aria-modal="true" aria-labelledby="booking-dialog-title">
            <button className="dialog-close" type="button" aria-label="Fechar" onClick={() => setShowBooking(false)}>×</button>
            {confirmation ? (
              <div className="dialog-success">
                <span className="success-mark">OK</span>
                <p className="eyebrow">Agendamento confirmado</p>
                <h2 id="booking-dialog-title">Seu horário está reservado.</h2>
                <p>{availability.dateLabel} às {confirmation.slot}</p>
                <button className="button button-primary" type="button" onClick={() => setShowBooking(false)}>Fechar</button>
              </div>
            ) : (
              <>
                <p className="eyebrow">Escolha seu horário</p>
                <h2 id="booking-dialog-title">Quando você prefere?</h2>
                <p className="dialog-service">{services.find((service) => String(service.id) === serviceId)?.nome}</p>
                <label className="field"><span>Data do atendimento</span><input type="date" value={date} onChange={(event) => changeDate(event.target.value)} /></label>
                <div className="dialog-slots"><span className="field-label">Horários disponíveis</span>{loadingSlots ? <p className="muted">Consultando horários...</p> : <div className="slot-grid">{availability.slots.map((slot) => <button className={`slot ${selectedSlot === slot ? 'selected' : ''}`} key={slot} type="button" onClick={() => setSelectedSlot(slot)}>{slot}</button>)}</div>}</div>
                <button className="button button-primary dialog-submit" disabled={!selectedSlot} type="button" onClick={confirmAppointment}>Confirmar agendamento</button>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
