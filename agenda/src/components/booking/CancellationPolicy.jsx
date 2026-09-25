export function CancellationPolicy({ minimumHours }) {
  return (
    <div className="cancellation-policy">
      <strong>POLÍTICA DE CANCELAMENTO</strong>
      <p>Cancelamento sem custo até {minimumHours} horas antes do início.</p>
    </div>
  )
}
