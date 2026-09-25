import { Badge } from '../ui/Badge.jsx'

export function SelectionBadge({ children, tone = 'blue' }) {
  return <Badge tone={tone}>{children}</Badge>
}
