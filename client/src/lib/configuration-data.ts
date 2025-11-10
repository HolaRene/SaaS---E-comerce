import type { CompanyFiscalData, SecurityConfig, NotificationConfig, AuditLog } from "./configuration-types"

export const companyData: CompanyFiscalData = {
  legalName: "MiComercio Digital S.A. de C.V.",
  taxId: "MCD850101ABC",
  country: "México",
  address: {
    street: "Av. Reforma",
    number: "500",
    city: "Ciudad de México",
    state: "CDMX",
    postalCode: "06600",
    country: "México",
  },
  fiscalYear: {
    startMonth: 1,
    endMonth: 12,
    taxRegime: "General de Ley Personas Morales",
  },
  documentTemplates: [
    {
      id: "1",
      name: "Factura Estándar",
      type: "invoice",
      content: "Plantilla de factura con logo y datos fiscales",
      variables: ["cliente", "fecha", "total", "items"],
      lastModified: new Date("2025-01-15"),
      version: 3,
    },
    {
      id: "2",
      name: "Cotización",
      type: "quote",
      content: "Plantilla de cotización corporativa",
      variables: ["cliente", "vigencia", "items", "condiciones"],
      lastModified: new Date("2025-01-10"),
      version: 2,
    },
  ],
  brandColors: {
    primary: "#0F62FE",
    secondary: "#393939",
  },
}

export const securityConfig: SecurityConfig = {
  passwordPolicy: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expirationDays: 90,
    preventReuse: 5,
  },
  accessLimits: [
    {
      id: "1",
      role: "admin",
      maxConcurrentSessions: 3,
      allowedCountries: ["México", "Estados Unidos"],
      timeRestrictions: {
        startHour: 6,
        endHour: 22,
        daysOfWeek: [1, 2, 3, 4, 5],
      },
    },
    {
      id: "2",
      role: "manager",
      maxConcurrentSessions: 2,
      allowedCountries: ["México"],
    },
  ],
  sessionTimeout: 30,
  mfaEnabled: true,
  auditRetention: 365,
}

export const notificationConfig: NotificationConfig = {
  criticalAlerts: [
    {
      id: "1",
      name: "Stock Crítico",
      trigger: "inventory_low",
      conditions: { threshold: 10 },
      channels: ["email", "sms"],
      recipients: ["admin@micomercio.com", "inventory@micomercio.com"],
      enabled: true,
    },
    {
      id: "2",
      name: "Ventas Anormales",
      trigger: "sales_anomaly",
      conditions: { deviation: 50 },
      channels: ["email", "push"],
      recipients: ["admin@micomercio.com"],
      enabled: true,
    },
  ],
  automatedReports: [
    {
      id: "1",
      name: "Reporte Diario de Ventas",
      reportType: "daily_sales",
      frequency: "daily",
      time: "08:00",
      recipients: ["management@micomercio.com"],
      format: "pdf",
      enabled: true,
    },
    {
      id: "2",
      name: "Análisis Semanal",
      reportType: "weekly_analysis",
      frequency: "weekly",
      time: "09:00",
      recipients: ["admin@micomercio.com", "ceo@micomercio.com"],
      format: "excel",
      enabled: true,
    },
  ],
  roleConfigurations: [
    {
      role: "admin",
      emailEnabled: true,
      smsEnabled: true,
      pushEnabled: true,
      criticalOnly: false,
    },
    {
      role: "manager",
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      criticalOnly: true,
    },
  ],
  channels: [
    {
      id: "1",
      type: "email",
      name: "SMTP Corporativo",
      config: { host: "smtp.micomercio.com", port: 587 },
      enabled: true,
      lastTest: new Date("2025-01-20"),
      status: "active",
    },
    {
      id: "2",
      type: "sms",
      name: "Twilio SMS",
      config: { provider: "twilio" },
      enabled: true,
      status: "active",
    },
  ],
}

export const auditLogs: AuditLog[] = [
  {
    id: "1",
    userId: "user1",
    userName: "Carlos Rodríguez",
    action: "update",
    resource: "password_policy",
    oldValue: { minLength: 8 },
    newValue: { minLength: 12 },
    timestamp: new Date("2025-01-20T10:30:00"),
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0",
    status: "success",
  },
  {
    id: "2",
    userId: "user2",
    userName: "Ana Martínez",
    action: "create",
    resource: "notification_alert",
    newValue: { name: "Stock Crítico", trigger: "inventory_low" },
    timestamp: new Date("2025-01-19T15:45:00"),
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0",
    status: "success",
  },
  {
    id: "3",
    userId: "user1",
    userName: "Carlos Rodríguez",
    action: "update",
    resource: "fiscal_data",
    oldValue: { taxId: "OLD123" },
    newValue: { taxId: "MCD850101ABC" },
    timestamp: new Date("2025-01-18T09:15:00"),
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0",
    status: "success",
  },
]
