export interface LegalAddress {
  street: string
  number: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface FiscalYearConfig {
  startMonth: number
  endMonth: number
  taxRegime: string
}

export interface DocumentTemplate {
  id: string
  name: string
  type: "invoice" | "receipt" | "quote" | "report"
  content: string
  variables: string[]
  lastModified: Date
  version: number
}

export interface CompanyFiscalData {
  legalName: string
  taxId: string
  country: string
  address: LegalAddress
  fiscalYear: FiscalYearConfig
  documentTemplates: DocumentTemplate[]
  logo?: string
  brandColors: {
    primary: string
    secondary: string
  }
}

export interface PasswordPolicy {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  expirationDays: number
  preventReuse: number
}

export interface AccessLimit {
  id: string
  role: string
  maxConcurrentSessions: number
  allowedIPs?: string[]
  allowedCountries?: string[]
  timeRestrictions?: {
    startHour: number
    endHour: number
    daysOfWeek: number[]
  }
}

export interface SecurityConfig {
  passwordPolicy: PasswordPolicy
  accessLimits: AccessLimit[]
  sessionTimeout: number
  mfaEnabled: boolean
  auditRetention: number
}

export interface AlertConfig {
  id: string
  name: string
  trigger: string
  conditions: Record<string, unknown>
  channels: string[]
  recipients: string[]
  enabled: boolean
}

export interface ReportSchedule {
  id: string
  name: string
  reportType: string
  frequency: "daily" | "weekly" | "monthly"
  time: string
  recipients: string[]
  format: "pdf" | "excel" | "csv"
  enabled: boolean
}

export interface RoleNotificationConfig {
  role: string
  emailEnabled: boolean
  smsEnabled: boolean
  pushEnabled: boolean
  criticalOnly: boolean
}

export interface NotificationChannel {
  id: string
  type: "email" | "sms" | "push" | "webhook"
  name: string
  config: Record<string, unknown>
  enabled: boolean
  lastTest?: Date
  status: "active" | "error" | "untested"
}

export interface NotificationConfig {
  criticalAlerts: AlertConfig[]
  automatedReports: ReportSchedule[]
  roleConfigurations: RoleNotificationConfig[]
  channels: NotificationChannel[]
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  oldValue?: unknown
  newValue?: unknown
  timestamp: Date
  ipAddress: string
  userAgent: string
  status: "success" | "failed"
}

export interface ActionState {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}
