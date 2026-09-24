export function Card({ children, className = '', ...props }) {
  return <section className={`surface-card ${className}`.trim()} {...props}>{children}</section>
}
