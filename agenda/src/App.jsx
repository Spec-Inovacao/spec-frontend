import { useEffect, useState } from 'react'
import { BookingFlow } from './components/BookingFlow.jsx'
import { Footer } from './components/layout/Footer.jsx'
import { Header } from './components/layout/Header.jsx'
import { ConfirmarAgendamento } from './pages/ConfirmarAgendamento.jsx'
import { EscolherHorario } from './pages/EscolherHorario.jsx'
import { MeusAgendamentos } from './pages/MeusAgendamentos.jsx'
import { AgendaProprietario } from './pages/AgendaProprietario.jsx'
import { ConfiguracoesProprietario } from './pages/ConfiguracoesProprietario.jsx'
import { AdicionarAgendamento } from './pages/AdicionarAgendamento.jsx'
import { buscarConfiguracao } from './services/configuracao.js'
import './App.css'

function App() {
  const [view, setView] = useState('booking')
  const [selectedService, setSelectedService] = useState(null)
  const [appointment, setAppointment] = useState(null)
  const [configuration, setConfiguration] = useState(null)
  const [configurationError, setConfigurationError] = useState('')
  const [scrollToServices, setScrollToServices] = useState(false)

  useEffect(() => {
    let active = true
    buscarConfiguracao()
      .then((result) => {
        if (!active) return
        setConfiguration(result)
        setConfigurationError('')
      })
      .catch((error) => {
        if (active) setConfigurationError(error.message || 'Não foi possível carregar as configurações.')
      })
    return () => { active = false }
  }, [])

  const cancellationHours = Number(configuration?.cancelamentominhora) || 2
  function navigate(nextView) {
    if (nextView === 'servicos') {
      setView('booking')
      setScrollToServices(true)
      return
    }
    if (nextView === 'agendamentos') {
      setScrollToServices(false)
      setView('appointments')
      return
    }
    setScrollToServices(false)
    setView(nextView === 'inicio' ? 'booking' : nextView)
  }

  function chooseService(service) {
    setScrollToServices(false)
    setSelectedService(service)
    setView('schedule')
  }

  function continueToConfirmation(nextAppointment) {
    setAppointment(nextAppointment)
    setView('confirmation')
  }

  function finishConfirmation(confirmedBooking) {
    setAppointment(confirmedBooking)
    setView('appointments')
  }

  return (
    <main className="app-shell" id="inicio">
      <Header active={view === 'schedule' || view === 'confirmation' ? 'servicos' : view === 'appointments' ? 'agendamentos' : 'inicio'} onNavigate={navigate} />
      {configurationError && (
        <p className="configuration-error" role="alert">
          {configurationError}
          {' '}
          <button
            type="button"
            className="configuration-error-retry"
            onClick={() => {
              setConfigurationError('')
              buscarConfiguracao()
                .then((result) => {
                  setConfiguration(result)
                  setConfigurationError('')
                })
                .catch((error) => {
                  setConfigurationError(error.message || 'Não foi possível carregar as configurações.')
                })
            }}
          >
            Tentar novamente
          </button>
        </p>
      )}
      {view === 'booking' && (
        <BookingFlow
          configuration={configuration}
          scrollToServices={scrollToServices}
          onScrolledToServices={() => setScrollToServices(false)}
          onViewAppointments={() => setView('appointments')}
          onChooseService={chooseService}
        />
      )}
      {view === 'appointments' && <MeusAgendamentos configuration={configuration} onNewAppointment={() => navigate('servicos')} />}
      {view === 'schedule' && <EscolherHorario configuration={configuration} service={selectedService} onContinue={continueToConfirmation} />}
      {view === 'confirmation' && <ConfirmarAgendamento appointment={appointment} minimumHours={cancellationHours} onBack={() => setView('schedule')} onConfirmed={finishConfirmation} onStart={() => setView('booking')} />}
      {view === 'owner-agenda' && <AgendaProprietario onNavigate={navigate} />}
      {view === 'owner-settings' && <ConfiguracoesProprietario onNavigate={navigate} />}
      {view === 'owner-add' && <AdicionarAgendamento onNavigate={navigate} />}
      <Footer cancellationHours={cancellationHours} />
    </main>
  )
}

export default App
