export default function friendlyStatus (s: string) {
  return s[0].toUpperCase() + s.slice(1).toLowerCase().replace(/_/g, ' ')
}
