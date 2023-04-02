/*
 * generateISODates generates an array of ISO dates to be used in tests
 */
export const generateISODates = (): string[] => {
  return Array.from({ length: 5 }, (_, i) => new Date(`2023-01-0${i + 1}`).toISOString())
}

// Tests for generateISODates
describe('test generateISODates function', () => {
  it('should generate an array of ISO dates', () => {
    const expectedDates = [
      '2023-01-01T00:00:00.000Z',
      '2023-01-02T00:00:00.000Z',
      '2023-01-03T00:00:00.000Z',
      '2023-01-04T00:00:00.000Z',
      '2023-01-05T00:00:00.000Z'
    ]

    expect(generateISODates()).toEqual(expectedDates)
  })
})
