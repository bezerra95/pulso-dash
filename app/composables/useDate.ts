import dayjs from 'dayjs'

type DateInput = string | Date | number | null | undefined

export const useDateFormat = () => {
  // ─── Formatting ───────────────────────────────────────────────────────────

  const formatDate = (date: DateInput, format = 'DD/MM/YYYY'): string => {
    if (!date) return '-'
    const d = dayjs(date)
    return d.isValid() ? d.format(format) : '-'
  }

  const formatDateTime = (date: DateInput): string => {
    if (!date) return '-'
    const d = dayjs(date)
    return d.isValid() ? d.format('DD/MM/YYYY HH:mm') : '-'
  }

  const formatTime = (date: DateInput): string => {
    if (!date) return '-'
    const d = dayjs(date)
    return d.isValid() ? d.format('HH:mm') : '-'
  }

  const formatLong = (date: DateInput): string => {
    if (!date) return '-'
    const d = dayjs(date)
    return d.isValid() ? d.format('D [de] MMMM [de] YYYY') : '-'
  }

  // ─── Relative Time ────────────────────────────────────────────────────────

  const formatRelative = (date: DateInput): string => {
    if (!date) return '-'
    const d = dayjs(date)
    return d.isValid() ? d.fromNow() : '-'
  }

  const formatRelativeTo = (
    date: DateInput,
    reference: DateInput
  ): string => {
    if (!date || !reference) return '-'
    const d = dayjs(date)
    return d.isValid()
      ? d.from(dayjs(reference as string | Date | number))
      : '-'
  }

  // ─── Duration ─────────────────────────────────────────────────────────────

  const formatDuration = (seconds: number): string => {
    if (seconds < 0) return '00:00:00'
    const d = dayjs.duration(seconds, 'seconds')
    return [Math.floor(d.asHours()), d.minutes(), d.seconds()]
      .map((v) => String(v).padStart(2, '0'))
      .join(':')
  }

  const formatDurationHuman = (minutes: number): string => {
    if (minutes < 60) return `${minutes}min`
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return m > 0 ? `${h}h ${m}min` : `${h}h`
  }

  // ─── Parsing ──────────────────────────────────────────────────────────────

  const parseDate = (date: string, format?: string): dayjs.Dayjs =>
    format ? dayjs(date, format) : dayjs(date)

  const brToIso = (date: string): string => {
    const d = dayjs(date, 'DD/MM/YYYY')
    return d.isValid() ? d.format('YYYY-MM-DD') : ''
  }

  const isoToBr = (date: string): string => {
    const d = dayjs(date, 'YYYY-MM-DD')
    return d.isValid() ? d.format('DD/MM/YYYY') : ''
  }

  // ─── Guards ───────────────────────────────────────────────────────────────

  const isToday = (date: DateInput): boolean =>
    !!date && dayjs(date).isToday()

  const isValid = (date: DateInput): boolean =>
    !!date && dayjs(date).isValid()

  const isBefore = (
    date: DateInput,
    reference: DateInput = new Date()
  ): boolean =>
    !!date &&
    dayjs(date).isBefore(dayjs(reference as string | Date | number))

  const isAfter = (
    date: DateInput,
    reference: DateInput = new Date()
  ): boolean =>
    !!date &&
    dayjs(date).isAfter(dayjs(reference as string | Date | number))

  // ─── Calculations ─────────────────────────────────────────────────────────

  const diffInDays = (
    dateA: DateInput,
    dateB: DateInput = new Date()
  ): number =>
    !dateA
      ? 0
      : dayjs(dateB as string | Date | number).diff(dayjs(dateA), 'day')

  const addDays = (date: DateInput, days: number): string =>
    !date ? '' : dayjs(date).add(days, 'day').format('YYYY-MM-DD')

  const startOfMonth = (date: DateInput = new Date()): string =>
    dayjs(date as string | Date | number)
      .startOf('month')
      .format('YYYY-MM-DD')

  const endOfMonth = (date: DateInput = new Date()): string =>
    dayjs(date as string | Date | number)
      .endOf('month')
      .format('YYYY-MM-DD')

  const now = (): string => dayjs().format('DD/MM/YYYY HH:mm:ss')

  // ─── Number / Currency (project utilities) ────────────────────────────────

  const formatCurrency = (value: number): string =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)

  const formatNumber = (value: number): string =>
    new Intl.NumberFormat('pt-BR').format(Math.round(value))

  return {
    formatDate,
    formatDateTime,
    formatTime,
    formatLong,
    formatRelative,
    formatRelativeTo,
    formatDuration,
    formatDurationHuman,
    parseDate,
    brToIso,
    isoToBr,
    isToday,
    isValid,
    isBefore,
    isAfter,
    diffInDays,
    addDays,
    startOfMonth,
    endOfMonth,
    now,
    formatCurrency,
    formatNumber,
  }
}
