import { useEffect, useState } from 'react'
import { consultarDisponibilidade, normalizarHorarios } from '../services/disponibilidade.js'
import { listarServicos } from '../services/servicos.js'

function today() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function formatCurrency(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function BookingFlow({ configuration, scrollToServices = false, onScrolledToServices, onViewAppointments, onChooseService }) {
  const [services, setServices] = useState([])
  const [availability, setAvailability] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [availabilityError, setAvailabilityError] = useState('')
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let active = true
    async function loadHome() {
      setLoading(true)
      setError('')
      setAvailabilityError('')
      try {
        const availableServices = await listarServicos()
        if (!active) return
        setServices(availableServices)
        const firstService = availableServices[0]
        if (firstService) {
          try {
            const payload = await consultarDisponibilidade(firstService.id, today())
            if (active) setAvailability(normalizarHorarios(payload).filter((slot) => slot.status === 'available'))
          } catch (requestError) {
            if (active) setAvailabilityError(requestError.message || 'Não foi possível carregar os horários de hoje.')
          }
        } else {
          setAvailability([])
        }
      } catch (requestError) {
        if (active) setError(requestError.message || 'Não foi possível carregar os serviços.')
      } finally {
        if (active) setLoading(false)
      }
    }
    loadHome()
    return () => { active = false }
  }, [retry])

  useEffect(() => {
    if (loading || !scrollToServices) return
    const frame = window.requestAnimationFrame(() => {
      document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' })
      onScrolledToServices?.()
    })
    return () => window.cancelAnimationFrame(frame)
  }, [loading, scrollToServices, onScrolledToServices])

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
          <h2>Disponibilidade de hoje</h2>
          <p className="availability-date">{new Date(`${today()}T12:00:00`).toLocaleDateString('pt-BR', { dateStyle: 'full' })}</p>
          {services[0] && <p className="availability-date">Serviço: {services[0].nome}</p>}
          <div className="availability-times">
            {availability?.map((slot) => <span key={slot.time}>{slot.time}</span>)}
            {availability && availability.length === 0 && <span className="availability-empty">Sem horários disponíveis hoje</span>}
          </div>
          {availabilityError && <p className="availability-error" role="alert">{availabilityError} <button type="button" onClick={() => setRetry((value) => value + 1)}>Tentar novamente</button></p>}
          {configuration && <p className="availability-hours">Expediente: {configuration.horainicio}–{configuration.horafim}</p>}
          {configuration && <p className="availability-policy">Cancelamento mínimo: {configuration.cancelamentominhora} h</p>}
        </aside>
      </section>

      <section className="services-section" id="servicos">
        <div className="section-heading compact-heading">
          <h2>Escolha um serviço</h2>
        </div>
        {error && <div className="service-api-error" role="alert">{error} <button type="button" onClick={() => setRetry((value) => value + 1)}>Tentar novamente</button></div>}
        {!error && services.length === 0 && <p className="loading">Nenhum serviço disponível no momento.</p>}
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.id}>
              <div className="service-card-top"><h3>{service.nome}</h3><span>{service.tempoMin ?? service.tempomin} min</span></div>
              {service.descricao && <p className="service-description">{service.descricao}</p>}
              <div className="service-card-bottom"><strong>{formatCurrency(service.preco)}</strong><button className="choose-button" type="button" onClick={() => onChooseService(service)}>Escolher</button></div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
