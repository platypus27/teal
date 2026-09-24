import fc from 'fast-check'
import { addDays, addMonths, dateKey, getMonthGrid, isSameDay, monthShortNames, weekdayNames } from '../src/date-utils'

const dateArbitrary = fc
  .record({
    year: fc.integer({ min: 1900, max: 2100 }),
    month: fc.integer({ min: 0, max: 11 }),
    day: fc.integer({ min: 1, max: 28 }),
    hours: fc.integer({ min: 0, max: 23 }),
  })
  .map(({ year, month, day, hours }) => new Date(year, month, day, hours))

describe('date-utils properties', () => {
  it('addDays is invertible', () => {
    fc.assert(
      fc.property(dateArbitrary, fc.integer({ min: -400, max: 400 }), (date, delta) => {
        expect(addDays(addDays(date, delta), -delta)).toEqual(date)
      }),
    )
  })

  it('addDays advances exactly N calendar days and stays forward for positive deltas', () => {
    fc.assert(
      fc.property(dateArbitrary, fc.integer({ min: 1, max: 60 }), (date, days) => {
        const next = addDays(date, days)
        expect(next.getTime()).toBeGreaterThan(date.getTime())
        const civil = (d: Date) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
        expect((civil(next) - civil(date)) / 86400000).toBe(days)
      }),
    )
  })

  it('addMonths pins day 1 and resolves year wraparound', () => {
    fc.assert(
      fc.property(
        dateArbitrary,
        fc.integer({ min: -48, max: 48 }),
        (date, delta) => {
          const next = addMonths(date, delta)
          expect(next.getDate()).toBe(1)
          const totalMonths = date.getMonth() + delta
          expect(next.getFullYear()).toBe(date.getFullYear() + Math.floor(totalMonths / 12))
          expect(next.getMonth()).toBe(((totalMonths % 12) + 12) % 12)
        },
      ),
    )
  })

  it('getMonthGrid always renders six Sunday-started weeks covering the whole month exactly once', () => {
    fc.assert(
      fc.property(
        fc.record({
          year: fc.integer({ min: 1900, max: 2100 }),
          month: fc.integer({ min: 0, max: 11 }),
        }).map(({ year, month }) => new Date(year, month, 1)),
        (month) => {
          const grid = getMonthGrid(month)
          expect(grid).toHaveLength(42)
          expect(grid[0]!.getDay()).toBe(0)
          const daysOfMonth = grid.filter((day) => day.getMonth() === month.getMonth())
          expect(daysOfMonth).toHaveLength(new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate())
          expect(new Set(daysOfMonth.map((day) => day.getDate())).size).toBe(daysOfMonth.length)
          expect(grid.some((day) => day.getDate() === 1 && day.getMonth() === month.getMonth())).toBe(true)
        },
      ),
    )
  })

  it('dateKey round-trips through its components', () => {
    fc.assert(
      fc.property(dateArbitrary, (date) => {
        const [year = 0, month = 0, day = 0] = dateKey(date).split('-').map(Number)
        expect(new Date(year, month, day)).toEqual(new Date(date.getFullYear(), date.getMonth(), date.getDate()))
      }),
    )
  })

  it('isSameDay ignores the time of day and distinguishes adjacent days', () => {
    fc.assert(
      fc.property(dateArbitrary, fc.integer({ min: 1, max: 27 }), (date, day) => {
        expect(isSameDay(date, new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59))).toBe(true)
        expect(isSameDay(date, new Date(date.getFullYear(), date.getMonth(), day))).toBe(day === date.getDate())
      }),
    )
  })

  it('locale name tables cover every month and weekday', () => {
    expect(monthShortNames).toHaveLength(12)
    expect(weekdayNames).toHaveLength(7)
    for (const name of [...monthShortNames, ...weekdayNames]) {
      expect(name.length).toBeGreaterThan(0)
    }
  })
})
