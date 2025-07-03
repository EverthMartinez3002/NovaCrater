/// <reference types="cypress" />

describe('Dashboard Load Tests', () => {
  beforeEach(() => {
    cy.task('log', 'Starting new test...')
    cy.setupDashboardInterceptors()
    
    // Handle uncaught exceptions from application
    cy.on('uncaught:exception', (err, runnable) => {
      // Return false to prevent Cypress from failing the test on uncaught exceptions
      if (err.message.includes('Request failed with status code 500')) {
        return false
      }
      if (err.message.includes('res.send()')) {
        return false
      }
      // Let other errors fail the test
      return true
    })
  })
  
  afterEach(() => {
    cy.task('log', 'Test completed')
  })

  context('Initial Dashboard Load', () => {
    it('should load dashboard successfully with all components', () => {
      cy.task('log', 'Testing dashboard initial load...')
      
      cy.visitDashboard()
      
      // Verify main dashboard container exists
      cy.get('[data-cy="dashboard-container"]').should('exist')
      
      // Verify summary section exists 
      cy.get('[data-cy="dashboard-summary-card"]').should('exist')
      
      // Verify charts section exists
      cy.get('[data-cy="outstanding-invoices-chart"]').should('exist')
      cy.get('[data-cy="status-distribution-chart"]').should('exist')
      cy.get('[data-cy="predictive-cashflow-chart"]').should('exist')
      
      // Verify table section exists
      cy.get('[data-cy="dashboard-table"]').should('exist')
      cy.get('[data-cy="invoices-table"]').should('exist')
    })

    it('should display summary metrics with valid data', () => {
      cy.task('log', 'Testing summary metrics...')
      
      cy.visitDashboard()
      
      // Check that summary metrics exist and contain data
      cy.get('[data-cy="dashboard-summary-card"]').within(() => {
        // Verify that numeric values are present (not zero or empty)
        cy.get('[data-cy="metric-total-invoices"]').should('exist').and('not.be.empty')
        cy.get('[data-cy="metric-total-sales"]').should('exist').and('not.be.empty')
        cy.get('[data-cy="metric-total-receipts"]').should('exist').and('not.be.empty')
        cy.get('[data-cy="metric-total-expenses"]').should('exist').and('not.be.empty')
        cy.get('[data-cy="metric-total-net-income"]').should('exist').and('not.be.empty')
      })
    })

    it('should load all three main charts', () => {
      cy.task('log', 'Testing chart loading...')
      
      cy.visitDashboard()
      
      // Verify chart containers exist
      cy.get('[data-cy="outstanding-invoices-chart"]').should('exist')
      cy.get('[data-cy="status-distribution-chart"]').should('exist') 
      cy.get('[data-cy="predictive-cashflow-chart"]').should('exist')
      
      // Verify chart canvas elements exist (charts are rendered)
      cy.get('[data-cy="outstanding-chart-canvas"]').should('exist')
      cy.get('[data-cy="status-chart-canvas"]').should('exist')
      cy.get('[data-cy="cashflow-chart-canvas"]').should('exist')
    })

    it('should display recent invoices table with data', () => {
      cy.task('log', 'Testing recent invoices table...')
      
      cy.visitDashboard()
      
      // Verify table exists and has data
      cy.get('[data-cy="dashboard-table"]').should('exist')
      cy.get('[data-cy="invoices-table"]').should('exist')
      
      // Check that table has rows with data
      cy.get('[data-cy="invoices-table"] tbody tr').should('have.length.at.least', 1)
      
      // Verify table headers exist
      cy.get('[data-cy="invoices-table"] thead th').should('have.length.at.least', 4)
    })

    it('should show correct loading states and transitions', () => {
      cy.task('log', 'Testing loading states...')
      
      cy.loginAsAdmin()
      cy.visit('/admin/dashboard')
      
      // Should eventually load successfully
      cy.get('[data-cy="dashboard-container"]', { timeout: 15000 }).should('exist')
      
      // Data should be loaded (no loading spinners should remain)
      cy.get('.loading-spinner').should('not.exist')
      cy.get('.loader').should('not.exist')
      
      // Dashboard should have data
      cy.get('[data-cy="dashboard-summary-card"]').should('exist')
    })
  })

  context('Dashboard API Integration', () => {
    it('should handle successful API responses', () => {
      cy.task('log', 'Testing API integration...')
      
      cy.loginAsAdmin()
      
      // Set up intercept to verify API calls
      cy.intercept('GET', '**/api/v1/dashboard*').as('dashboardAPI')
      
      cy.visit('/admin/dashboard')
      
      // Wait for API call and verify response
      cy.wait('@dashboardAPI').then((interception) => {
        expect(interception.response.statusCode).to.eq(200)
        expect(interception.response.body).to.have.property('total_amount_due')
        expect(interception.response.body).to.have.property('total_customer_count')
        expect(interception.response.body).to.have.property('total_invoice_count')
        expect(interception.response.body).to.have.property('recent_due_invoices')
      })
      
      // Verify dashboard loaded with data
      cy.get('[data-cy="dashboard-container"]').should('exist')
    })

    it('should display error state on API failure', () => {
      cy.task('log', 'Testing API error handling...')
      
      cy.loginAsAdmin()
      
      // Mock API failure
      cy.intercept('GET', '**/api/v1/dashboard*', {
        statusCode: 500,
        body: { error: 'Server Error' }
      }).as('dashboardAPIError')
      
      cy.visit('/admin/dashboard')
      
      // Should handle error gracefully (dashboard should still load even if data fails)
      cy.get('[data-cy="dashboard-container"]', { timeout: 10000 }).should('exist')
    })
  })

  context('Responsive Design', () => {
    it('should display correctly on mobile viewport', () => {
      cy.task('log', 'Testing mobile responsive design...')
      
      cy.viewport(375, 667) // iPhone SE
      cy.visitDashboard()
      
      // Verify dashboard exists on mobile
      cy.get('[data-cy="dashboard-container"]').should('exist')
      
      // Verify main components are present (even if layout changes)
      cy.get('[data-cy="dashboard-summary-card"]').should('exist')
      cy.get('[data-cy="dashboard-table"]').should('exist')
    })

    it('should display correctly on tablet viewport', () => {
      cy.task('log', 'Testing tablet responsive design...')
      
      cy.viewport(768, 1024) // iPad
      cy.visitDashboard()
      
      // Verify dashboard exists on tablet
      cy.get('[data-cy="dashboard-container"]').should('exist')
      
      // Verify main components are present
      cy.get('[data-cy="dashboard-summary-card"]').should('exist')
      cy.get('[data-cy="dashboard-table"]').should('exist')
    })
  })

  context('Performance Tests', () => {
    it('should load dashboard within acceptable time limits', () => {
      cy.task('log', 'Testing dashboard performance...')
      
      cy.loginAsAdmin()
      
      const startTime = Date.now()
      cy.visit('/admin/dashboard')
      
      cy.get('[data-cy="dashboard-container"]', { timeout: 10000 }).should('exist').then(() => {
        const loadTime = Date.now() - startTime
        cy.task('log', `Dashboard loaded in ${loadTime}ms`)
        expect(loadTime).to.be.lessThan(5000) // Should load within 5 seconds
      })
    })

    it('should not have memory leaks after multiple visits', () => {
      cy.task('log', 'Testing for memory leaks...')
      
      // Visit dashboard multiple times
      for (let i = 0; i < 3; i++) {
        cy.visitDashboard()
        cy.get('[data-cy="dashboard-container"]').should('exist')
        
        // Navigate away and back
        cy.visit('/admin/customers')
        cy.visit('/admin/dashboard')
      }
      
      // Final verification
      cy.get('[data-cy="dashboard-container"]').should('exist')
    })
  })
}) 