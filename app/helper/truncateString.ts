export default function truncate(s: string) {
  if (s.length > 5) {
    return s.substring(0, 5) + '...'
  }
  return s
}
