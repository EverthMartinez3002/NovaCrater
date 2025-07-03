// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import 'cypress-file-upload'
import 'cypress-downloadfile/lib/downloadFileCommand'

// Login command for admin users
Cypress.Commands.add('loginAsAdmin', (email = 'ferbio990@gmail.com', password = 'test1234') => {
  cy.session([email, password], () => {
    cy.visit('/admin/auth/login')
    cy.get('input[name="email"]').type(email)
    cy.get('input[name="password"]').type(password)
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/admin/dashboard')
    cy.window().its('localStorage').should('have.property', 'selectedCompany')
  })
})

// Wait for dashboard to fully load
Cypress.Commands.add('waitForDashboardLoad', () => {
  // Wait for dashboard API calls to complete
  cy.intercept('GET', '**/api/v1/dashboard*').as('dashboardData')
  cy.wait('@dashboardData')
  
  // Wait for key elements to exist and scroll them into view
  cy.get('[data-cy="dashboard-summary-card"]', { timeout: 10000 })
    .should('exist')
    .scrollIntoView()
    .should('be.visible')
    
  cy.get('[data-cy="dashboard-table"]', { timeout: 10000 })
    .should('exist')
    .scrollIntoView()
    .should('be.visible')
  
  // Wait for charts to load
  cy.get('[data-cy="outstanding-invoices-chart"]', { timeout: 15000 })
    .should('exist')
    .scrollIntoView()
    
  cy.get('[data-cy="status-distribution-chart"]', { timeout: 15000 })
    .should('exist')
    .scrollIntoView()
    
  cy.get('[data-cy="predictive-cashflow-chart"]', { timeout: 15000 })
    .should('exist')
    .scrollIntoView()
})

// Verify charts are loaded and contain data
Cypress.Commands.add('verifyChartsLoaded', () => {
  cy.get('[data-cy="outstanding-invoices-chart"]').within(() => {
    cy.get('[data-cy="outstanding-chart-canvas"]').should('be.visible')
  })
  
  cy.get('[data-cy="status-distribution-chart"]').within(() => {
    cy.get('[data-cy="status-chart-canvas"]').should('be.visible')
  })
  
  cy.get('[data-cy="predictive-cashflow-chart"]').within(() => {
    cy.get('[data-cy="cashflow-chart-canvas"]').should('be.visible')
  })
})

// Verify download exists and optionally check content
Cypress.Commands.add('verifyDownload', (filename, options = {}) => {
  const { timeout = 10000, verifyContent = false } = options
  
  cy.task('downloadExists', filename, { timeout }).then((exists) => {
    expect(exists).to.be.true
  })
  
  if (verifyContent) {
    cy.readFile(`cypress/downloads/${filename}`, { timeout }).should('exist')
  }
})

// Clear downloads folder
Cypress.Commands.add('clearDownloads', () => {
  cy.task('clearDownloads')
})

// Navigate to dashboard with proper setup
Cypress.Commands.add('visitDashboard', () => {
  cy.loginAsAdmin()
  cy.visit('/admin/dashboard')
  cy.waitForDashboardLoad()
})

// Setup API interceptors for dashboard
Cypress.Commands.add('setupDashboardInterceptors', () => {
  cy.intercept('GET', '**/api/v1/dashboard*').as('dashboardData')
  cy.intercept('POST', '**/api/v1/dashboard/export*').as('dashboardExport')
  cy.intercept('POST', '**/api/v1/dashboard/export-snapshot*').as('snapshotExport')
  cy.intercept('GET', '**/api/v1/dashboard/top-outstanding*').as('topOutstanding')
  cy.intercept('GET', '**/api/v1/dashboard/cash-flow*').as('cashFlow')
})

// Select date range in unified date picker
Cypress.Commands.add('selectDateRange', (range) => {
  cy.get('[data-cy="unified-date-picker"]').click()
  cy.get(`[data-cy="date-option-${range}"]`).click()
  cy.wait('@dashboardData')
})

// Apply custom date range
Cypress.Commands.add('applyCustomDateRange', (startDate, endDate) => {
  cy.get('[data-cy="unified-date-picker"]').click()
  cy.get('[data-cy="date-option-custom"]').click()
  cy.get('[data-cy="custom-start-date"]').type(startDate)
  cy.get('[data-cy="custom-end-date"]').type(endDate)
  cy.get('[data-cy="apply-custom-range"]').click()
  cy.wait('@dashboardData')
})

// Table operations
Cypress.Commands.add('sortTableBy', (column) => {
  cy.get(`[data-cy="sort-${column}"]`).click()
  cy.wait(1000) // Wait for sort animation
})

Cypress.Commands.add('filterTableByStatus', (status) => {
  cy.get('[data-cy="table-status-filter"]').click()
  cy.get(`[data-cy="status-${status}"]`).click()
})

Cypress.Commands.add('searchInTable', (searchTerm) => {
  cy.get('[data-cy="table-search"]').type(searchTerm)
  cy.wait(1000) // Wait for debounced search
})

// Export operations
Cypress.Commands.add('openExportDialog', (format) => {
  cy.get('[data-cy="export-dropdown"]').click()
  cy.get(`[data-cy="export-${format}"]`).click()
})

Cypress.Commands.add('exportWithSections', (format, sections) => {
  cy.openExportDialog(format)
  
  // Select sections
  sections.forEach(section => {
    cy.get(`[data-cy="section-${section}"]`).check()
  })
  
  cy.get('[data-cy="confirm-export"]').click()
})

// Utility commands
Cypress.Commands.add('getTableRowCount', () => {
  return cy.get('[data-cy="table-row"]').its('length')
})

Cypress.Commands.add('waitForTableLoad', () => {
  cy.get('[data-cy="dashboard-table"] [data-cy="invoices-table"] tbody tr').should('have.length.at.least', 1)
}) 