import { useState } from 'react'
import { BookingFlow } from './components/BookingFlow.jsx'
import { Footer } from './components/layout/Footer.jsx'
import { Header } from './components/layout/Header.jsx'
import { ConfirmarAgendamento } from './pages/ConfirmarAgendamento.jsx'
import { EscolherHorario } from './pages/EscolherHorario.jsx'
import { MeusAgendamentos } from './pages/MeusAgendamentos.jsx'
import { AgendaProprietario } from './pages/AgendaProprietario.jsx'
import { ConfiguracoesProprietario } from './pages/ConfiguracoesProprietario.jsx'
import { AdicionarAgendamento } from './pages/AdicionarAgendamento.jsx'
import './App.css'

function App() {
  const [view, setView] = useState('booking')
  const [selectedService, setSelectedService] = useState(null)
  const [appointment, setAppointment] = useState(null)
  const [cancellationHours, setCancellationHours] = useState(2)
  function navigate(nextView) {
    if (nextView === 'servicos') {
      setView('schedule')
      return
    }
    if (nextView === 'agendamentos') {
      setView('appointments')
      return
    }
    setView(nextView === 'inicio' ? 'booking' : nextView)
  }

  function chooseService(service) {
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
      {view === 'booking' && <BookingFlow onViewAppointments={() => setView('appointments')} onCancellationHours={setCancellationHours} onChooseService={chooseService} />}
      {view === 'appointments' && <MeusAgendamentos onNewAppointment={() => navigate('servicos')} />}
      {view === 'schedule' && <EscolherHorario service={selectedService} onContinue={continueToConfirmation} />}
      {view === 'confirmation' && <ConfirmarAgendamento appointment={appointment} onBack={() => setView('schedule')} onConfirmed={finishConfirmation} onStart={() => setView('booking')} />}
      {view === 'owner-agenda' && <AgendaProprietario onNavigate={navigate} />}
      {view === 'owner-settings' && <ConfiguracoesProprietario onNavigate={navigate} />}
      {view === 'owner-add' && <AdicionarAgendamento onNavigate={navigate} />}
      <Footer cancellationHours={cancellationHours} />
    </main>
  )
}

export default App
