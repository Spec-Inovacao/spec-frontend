export function StatusBadge({ children, className = '' }) {
  return <span className={`status-badge ${className}`.trim()}>{children}</span>
}
