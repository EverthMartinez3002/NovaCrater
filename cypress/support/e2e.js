// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import './dashboard-helpers'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Global setup and configuration
beforeEach(() => {
  // Clear downloads before each test
  cy.task('log', 'Starting new test...')
  
  // Setup common interceptors
  cy.setupDashboardInterceptors()
  
  // Set viewport for consistent testing
  cy.viewport(1280, 720)
})

afterEach(() => {
  // Clean up after each test
  cy.task('log', 'Test completed')
})

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // You might want to log these errors for debugging
  console.error('Uncaught exception:', err.message)
  
  // Don't fail the test for known issues
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
  
  // Let other errors fail the test
  return true
})

// Global configuration
Cypress.config('defaultCommandTimeout', 10000)
Cypress.config('requestTimeout', 15000)
Cypress.config('responseTimeout', 15000) 