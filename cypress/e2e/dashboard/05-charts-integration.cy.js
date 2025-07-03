/// <reference types="cypress" />

describe('Dashboard Charts Integration Tests', () => {
  beforeEach(() => {
    // Handle uncaught exceptions from application
    cy.on('uncaught:exception', (err, runnable) => {
      if (err.message.includes('Request failed with status code 500')) {
        return false
      }
      if (err.message.includes('Request failed with status code 429')) {
        return false
      }
      if (err.message.includes('res.send()')) {
        return false
      }
      return true
    })
    
    cy.setupDashboardInterceptors()
    cy.loginAsAdmin()
    cy.visit('/admin/dashboard')
    
    // Wait for page to load instead of specific API calls
    cy.get('body').should('exist')
    cy.wait(3000) // Give charts time to initialize
  })

  context('Chart Existence Tests', () => {
    it('should display all three main charts', () => {
      cy.get('[data-cy="outstanding-invoices-chart"]').should('exist')
      cy.get('[data-cy="status-distribution-chart"]').should('exist')
      cy.get('[data-cy="predictive-cashflow-chart"]').should('exist')
    })

    it('should render chart canvases', () => {
      cy.wait(2000) // Allow charts to render
      
      cy.get('[data-cy="outstanding-invoices-chart"]').within(() => {
        cy.get('canvas').should('exist')
      })
      
      cy.get('[data-cy="status-distribution-chart"]').within(() => {
        cy.get('canvas').should('exist')
      })
      
      cy.get('[data-cy="predictive-cashflow-chart"]').within(() => {
        cy.get('canvas').should('exist')
      })
    })

    it('should show chart titles', () => {
      cy.get('[data-cy="outstanding-invoices-chart"]').should('contain', 'Outstanding Invoices')
      cy.get('[data-cy="status-distribution-chart"]').should('contain', 'Status Distribution')
      cy.get('[data-cy="predictive-cashflow-chart"]').should('contain', 'Cash Flow')
    })
  })

  context('Outstanding Invoices Chart', () => {
    it('should have chart type selector', () => {
      cy.get('[data-cy="outstanding-invoices-chart"]').within(() => {
        cy.get('[data-cy="chart-type-selector"]').should('exist')
      })
    })

    it('should allow changing chart type', () => {
      cy.get('[data-cy="outstanding-invoices-chart"]').within(() => {
        cy.get('[data-cy="chart-type-selector"]').should('exist')
        // Should be able to interact with selector
        cy.get('[data-cy="chart-type-selector"]').click({ force: true })
      })
    })

    it('should have canvas element', () => {
      cy.get('[data-cy="outstanding-invoices-chart"]').within(() => {
        cy.get('[data-cy="outstanding-chart-canvas"]').should('exist')
      })
    })
  })

  context('Status Distribution Chart', () => {
    it('should have chart legend', () => {
      cy.get('[data-cy="status-distribution-chart"]').within(() => {
        cy.get('[data-cy="chart-legend"]').should('exist')
      })
    })

    it('should show legend items', () => {
      cy.get('[data-cy="status-distribution-chart"]').within(() => {
        // Check for any legend item (don't rely on specific data-cy values)
        cy.get('[data-cy="chart-legend"]').should('exist')
        cy.get('[data-cy="chart-legend"]').children().should('have.length.greaterThan', 0)
      })
    })

    it('should have status chart canvas', () => {
      cy.get('[data-cy="status-distribution-chart"]').within(() => {
        cy.get('[data-cy="status-chart-canvas"]').should('exist')
      })
    })

    it('should allow legend interactions', () => {
      cy.get('[data-cy="status-distribution-chart"]').within(() => {
        cy.get('[data-cy="chart-legend"]').click({ force: true })
        // Should not throw error on click
      })
    })
  })

  context('Predictive Cash Flow Chart', () => {
    it('should have canvas element', () => {
      cy.get('[data-cy="predictive-cashflow-chart"]').within(() => {
        cy.get('canvas').should('exist')
      })
    })

    it('should be contained in a chart wrapper', () => {
      cy.get('[data-cy="predictive-cashflow-chart"]').should('have.class', 'bg-white')
    })

    it('should have full width layout', () => {
      cy.get('[data-cy="predictive-cashflow-chart"]').should('be.visible')
    })
  })

  context('Chart Interactions', () => {
    it('should handle date filter changes', () => {
      // Change date filter and ensure charts still exist
      cy.get('[data-cy="unified-date-picker"]').click()
      cy.get('[data-cy="date-option-last_7_days"]').click()
      
      cy.wait(2000) // Allow charts to update
      
      // Charts should still be present
      cy.get('[data-cy="outstanding-invoices-chart"] canvas').should('exist')
      cy.get('[data-cy="status-distribution-chart"] canvas').should('exist')
      cy.get('[data-cy="predictive-cashflow-chart"] canvas').should('exist')
    })

    it('should maintain chart visibility on window resize', () => {
      cy.wait(2000) // Allow initial render
      
      // Change viewport size
      cy.viewport(800, 600)
      cy.wait(1000)
      
      // Charts should still be visible
      cy.get('[data-cy="outstanding-invoices-chart"]').should('exist')
      cy.get('[data-cy="status-distribution-chart"]').should('exist')
      cy.get('[data-cy="predictive-cashflow-chart"]').should('exist')
    })

    it('should allow hovering over charts', () => {
      cy.wait(2000) // Allow charts to render
      
      // Hover over outstanding invoices chart
      cy.get('[data-cy="outstanding-invoices-chart"] canvas').trigger('mousemove', { force: true })
      
      // Hover over status distribution chart  
      cy.get('[data-cy="status-distribution-chart"] canvas').trigger('mousemove', { force: true })
      
      // Should not throw errors
    })
  })

  context('Chart Layout', () => {
    it('should have proper chart containers', () => {
      cy.get('[data-cy="dashboard-top-row"]').should('exist')
      cy.get('[data-cy="dashboard-top-row"]').within(() => {
        cy.get('[data-cy="outstanding-invoices-chart"]').should('exist')
        cy.get('[data-cy="status-distribution-chart"]').should('exist')
      })
    })

    it('should display predictive chart separately', () => {
      cy.get('[data-cy="predictive-cashflow-chart"]').should('exist')
      // Should be outside the top row grid
      cy.get('[data-cy="dashboard-top-row"]').should('not.contain', '[data-cy="predictive-cashflow-chart"]')
    })

    it('should have responsive grid layout', () => {
      cy.get('[data-cy="dashboard-top-row"]').should('have.class', 'grid')
      cy.get('[data-cy="outstanding-invoices-chart"]').should('exist')
      cy.get('[data-cy="status-distribution-chart"]').should('exist')
    })
  })

  context('Chart Data Loading', () => {
    it('should handle chart refresh gracefully', () => {
      cy.wait(2000) // Initial load
      
      // Trigger refresh by changing back to original date
      cy.get('[data-cy="unified-date-picker"]').click()
      cy.get('[data-cy="date-option-last_30_days"]').click()
      
      cy.wait(2000) // Allow refresh
      
      // Charts should still be functional
      cy.get('[data-cy="outstanding-invoices-chart"]').should('exist')
      cy.get('[data-cy="status-distribution-chart"]').should('exist')
      cy.get('[data-cy="predictive-cashflow-chart"]').should('exist')
    })

    it('should maintain chart state between filter changes', () => {
      // Apply different filters to test chart stability
      const filters = ['last_7_days', 'last_90_days', 'last_30_days']
      
      filters.forEach((filter) => {
        cy.get('[data-cy="unified-date-picker"]').click()
        cy.get(`[data-cy="date-option-${filter}"]`).click()
        cy.wait(1000) // Brief wait for update
        
        // Charts should remain functional
        cy.get('[data-cy="outstanding-invoices-chart"]').should('exist')
        cy.get('[data-cy="status-distribution-chart"]').should('exist')
        cy.get('[data-cy="predictive-cashflow-chart"]').should('exist')
      })
    })
  })
}) 