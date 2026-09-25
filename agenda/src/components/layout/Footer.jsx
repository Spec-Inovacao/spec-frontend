export function Footer({ cancellationHours = 2 }) {
  return (
    <footer className="footer">
      <span>Agenda Fácil · protótipo acadêmico SDD</span>
      <span>Sem conflito &nbsp;&nbsp; Respeita expediente &nbsp;&nbsp; Cancelamento mínimo: {cancellationHours} h</span>
    </footer>
  )
}
