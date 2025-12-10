import { cronJobs } from 'convex/server'
import { internal } from './_generated/api'

const crons = cronJobs()

crons.daily(
  'Limpiar notificaciones viejas',
  { hourUTC: 8, minuteUTC: 0 }, // 2 AM CST
  internal.notificaciones.limpiarNotificacionesAntiguas
)

export default crons
