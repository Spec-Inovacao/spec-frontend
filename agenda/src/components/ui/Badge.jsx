export function Badge({ children, tone = 'blue', className = '' }) {
  return <span className={`ui-badge ui-badge-${tone} ${className}`.trim()}>{children}</span>
}
