// Importar comandos personalizados
import './commands'
import 'cypress-mochawesome-reporter/register'

// Configuración global para todas las pruebas E2E
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevenir que Cypress falle en errores JavaScript no capturados
  // Esto es útil para aplicaciones que pueden tener errores menores
  console.log('Uncaught exception:', err.message)
  return false
})

// Configuración antes de cada prueba
beforeEach(() => {
  // Interceptar llamadas API comunes para poder usar cy.wait()
  cy.intercept('GET', '/api/v1/**').as('apiCall')
  cy.intercept('POST', '/api/v1/**').as('apiPost')
  cy.intercept('PUT', '/api/v1/**').as('apiPut')
  cy.intercept('DELETE', '/api/v1/**').as('apiDelete')
  
  // Interceptar llamadas específicas
  cy.intercept('GET', '/api/v1/dashboard').as('getDashboard')
  cy.intercept('GET', '/api/v1/invoices*').as('getInvoices')
  cy.intercept('GET', '/api/v1/customers*').as('getCustomers')
  cy.intercept('GET', '/api/v1/estimates*').as('getEstimates')
  
  // Configurar viewport por defecto
  cy.viewport(1280, 720)
})

// Configuración después de cada prueba
afterEach(() => {
  // Limpiar datos de la sesión después de cada prueba
  cy.cleanupTestData()
})

// Configuración global de timeouts
Cypress.config('defaultCommandTimeout', 10000)
Cypress.config('requestTimeout', 10000)
Cypress.config('responseTimeout', 10000) 