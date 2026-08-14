import { addDays, addMonths, dateKey, getMonthGrid, isSameDay, pad, startOfDay, weekdayNames } from '../src/date-utils'

describe('date-utils', () => {
  it('pads single digits to two characters', () => {
    expect(pad(3)).toBe('03')
    expect(pad(12)).toBe('12')
  })

  it('startOfDay zeroes the time portion', () => {
    expect(startOfDay(new Date(2024, 0, 15, 9, 30))).toEqual(new Date(2024, 0, 15))
  })

  it('isSameDay compares calendar days, not timestamps', () => {
    expect(isSameDay(new Date(2024, 0, 15, 0, 0), new Date(2024, 0, 15, 23, 59))).toBe(true)
    expect(isSameDay(new Date(2024, 0, 15), new Date(2024, 0, 16))).toBe(false)
  })

  it('addDays crosses month boundaries', () => {
    expect(addDays(new Date(2024, 0, 31), 1)).toEqual(new Date(2024, 1, 1))
    expect(addDays(new Date(2024, 0, 1), -1)).toEqual(new Date(2023, 11, 31))
  })

  it('addMonths keeps the first of the resulting month', () => {
    expect(addMonths(new Date(2024, 0, 20), 1)).toEqual(new Date(2024, 1, 1))
  })

  it('dateKey uses the 0-based month', () => {
    expect(dateKey(new Date(2024, 0, 15))).toBe('2024-0-15')
  })

  it('getMonthGrid returns 42 days starting on the Sunday of the first week', () => {
    const days = getMonthGrid(new Date(2024, 0, 1))
    expect(days).toHaveLength(42)
    expect(days[0]?.getDay()).toBe(0)
    expect(days.some((d) => isSameDay(d, new Date(2024, 0, 1)))).toBe(true)
  })

  it('weekdayNames has seven entries', () => {
    expect(weekdayNames).toHaveLength(7)
  })
})
