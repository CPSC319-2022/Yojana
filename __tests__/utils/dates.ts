export const generateISODates = (): string[] => {
  return Array.from({ length: 5 }, (_, i) => new Date(`2023-01-0${i + 1}`).toISOString())
}
