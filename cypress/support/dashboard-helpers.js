// Dashboard-specific helper functions

// Format currency for comparison
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount / 100) // Convert from cents
}

// Date helpers
export const getDateRange = (days) => {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - days)
  
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  }
}

export const formatDateForInput = (date) => {
  return new Date(date).toISOString().split('T')[0]
}

// Chart helpers
export const waitForChartsToRender = () => {
  cy.get('.chart-container canvas').should('be.visible')
  cy.wait(2000) // Allow time for chart animations
}

// Table helpers
export const verifyTableHasData = () => {
  cy.get('[data-cy="dashboard-table"] tbody tr').should('have.length.at.least', 1)
  cy.get('[data-cy="dashboard-table"] tbody tr').first().should('be.visible')
}

export const getTableData = () => {
  const data = []
  cy.get('[data-cy="dashboard-table"] tbody tr').each(($row) => {
    const rowData = {}
    cy.wrap($row).find('td').each(($cell, index) => {
      const headers = ['select', 'invoice_number', 'status', 'date', 'customer', 'total', 'due_amount', 'actions']
      rowData[headers[index]] = $cell.text().trim()
    })
    data.push(rowData)
  })
  return cy.wrap(data)
}

// Export helpers
export const verifyExportFile = (filename, expectedType) => {
  cy.verifyDownload(filename)
  
  if (expectedType === 'pdf') {
    expect(filename).to.include('.pdf')
  } else if (expectedType === 'xlsx') {
    expect(filename).to.include('.xlsx')
  } else if (expectedType === 'csv') {
    expect(filename).to.include('.csv')
  }
}

// Metrics validation helpers
export const validateMetrics = (expectedMinimums = {}) => {
  const defaults = {
    totalSales: 0,
    totalInvoices: 0,
    totalCustomers: 0,
    amountDue: 0
  }
  
  const minimums = { ...defaults, ...expectedMinimums }
  
  // Check each metric
  cy.get('[data-cy="metric-total-sales"]').invoke('text').then((text) => {
    const value = parseFloat(text.replace(/[^0-9.]/g, ''))
    expect(value).to.be.at.least(minimums.totalSales)
  })
  
  cy.get('[data-cy="metric-total-invoices"]').invoke('text').then((text) => {
    const value = parseInt(text.replace(/[^0-9]/g, ''))
    expect(value).to.be.at.least(minimums.totalInvoices)
  })
  
  cy.get('[data-cy="metric-total-customers"]').invoke('text').then((text) => {
    const value = parseInt(text.replace(/[^0-9]/g, ''))
    expect(value).to.be.at.least(minimums.totalCustomers)
  })
  
  cy.get('[data-cy="metric-amount-due"]').invoke('text').then((text) => {
    const value = parseFloat(text.replace(/[^0-9.]/g, ''))
    expect(value).to.be.at.least(minimums.amountDue)
  })
}

// Filter validation helpers
export const validateFilteredResults = (filterType, filterValue) => {
  cy.get('[data-cy="dashboard-table"] tbody tr').each(($row) => {
    switch (filterType) {
      case 'status':
        cy.wrap($row).find('[data-cy="invoice-status"]').should('contain', filterValue)
        break
      case 'customer':
        cy.wrap($row).find('[data-cy="customer-name"]').should('contain', filterValue)
        break
      case 'date':
        // Date validation logic here
        break
    }
  })
}

// Pagination helpers
export const testPagination = () => {
  // Get total count
  cy.get('[data-cy="pagination-info"]').invoke('text').then((text) => {
    const match = text.match(/(\d+) of (\d+)/)
    if (match) {
      const total = parseInt(match[2])
      const perPage = 10 // Default per page
      const expectedPages = Math.ceil(total / perPage)
      
      if (expectedPages > 1) {
        // Test next page
        cy.get('[data-cy="pagination-next"]').click()
        cy.waitForTableLoad()
        
        // Test previous page
        cy.get('[data-cy="pagination-prev"]').click()
        cy.waitForTableLoad()
        
        // Test direct page navigation if more than 2 pages
        if (expectedPages > 2) {
          cy.get('[data-cy="pagination-page-2"]').click()
          cy.waitForTableLoad()
        }
      }
    }
  })
}

// Sorting helpers
export const testSorting = (column) => {
  // Get initial order
  cy.get(`[data-cy="table-${column}"]`).then(($cells) => {
    const initialValues = Array.from($cells).map(cell => cell.textContent.trim())
    
    // Click sort header
    cy.sortTableBy(column)
    
    // Verify order changed
    cy.get(`[data-cy="table-${column}"]`).then(($newCells) => {
      const newValues = Array.from($newCells).map(cell => cell.textContent.trim())
      expect(newValues).to.not.deep.equal(initialValues)
    })
  })
}

// Status distribution helpers
export const validateStatusDistribution = () => {
  cy.get('[data-cy="status-distribution-chart"]').within(() => {
    cy.get('canvas').should('be.visible')
  })
  
  // Verify legend items
  const expectedStatuses = ['paid', 'pending', 'overdue']
  expectedStatuses.forEach(status => {
    cy.get(`[data-cy="status-${status}-count"]`).should('be.visible')
    cy.get(`[data-cy="status-${status}-count"]`).invoke('text').should('match', /^\d+$/)
  })
}

// Outstanding invoices helpers
export const validateOutstandingInvoices = () => {
  cy.get('[data-cy="outstanding-invoices-chart"]').within(() => {
    cy.get('canvas').should('be.visible')
  })
  
  // Check that chart has data
  cy.wait('@topOutstanding').then((interception) => {
    expect(interception.response.statusCode).to.equal(200)
    expect(interception.response.body).to.be.an('array')
  })
}

// Cash flow chart helpers
export const validateCashFlowChart = () => {
  cy.get('[data-cy="predictive-cashflow-chart"]').within(() => {
    cy.get('canvas').should('be.visible')
  })
  
  cy.wait('@cashFlow').then((interception) => {
    expect(interception.response.statusCode).to.equal(200)
    expect(interception.response.body).to.be.an('array')
  })
} 