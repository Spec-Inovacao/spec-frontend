export function Header({ active = 'inicio', onNavigate }) {
  return (
    <header className="topbar">
      <button className="brand" type="button" onClick={() => onNavigate('inicio')} aria-label="Agenda Fácil, início">
        <span className="brand-mark">A</span><strong>Agenda Fácil</strong>
      </button>
      <nav aria-label="Navegação principal">
        <button className={`nav-link ${active === 'inicio' ? 'active' : ''}`} type="button" onClick={() => onNavigate('inicio')}>Início</button>
        <button className={`nav-link ${active === 'servicos' ? 'active' : ''}`} type="button" onClick={() => onNavigate('servicos')}>Serviços</button>
        <button className={`nav-link ${active === 'agendamentos' ? 'active' : ''}`} type="button" onClick={() => onNavigate('agendamentos')}>Meus agendamentos</button>
      </nav>
      <div className="header-actions">
        <button className="owner-link" type="button" disabled>Área do proprietário</button>
        <button className="header-cta" type="button" onClick={() => onNavigate('servicos')}>Agendar agora</button>
      </div>
    </header>
  )
}
