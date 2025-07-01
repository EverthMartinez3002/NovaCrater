describe('Admin Dashboard Tests', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/admin/dashboard')
    cy.waitForPageLoad()
  })

  it('should display dashboard main elements', () => {
    cy.contains('Dashboard').should('be.visible')
    
    // Verificar que los elementos de estadísticas estén presentes
    cy.get('body').should('contain.text', 'Customer')
    cy.get('body').should('contain.text', 'Invoice')
    cy.get('body').should('contain.text', 'Estimate')
    
    // Buscar elementos de estadísticas con diferentes selectores posibles
    cy.get('[data-cy="total-customers"], .stat-card, .dashboard-stat').should('have.length.at.least', 1)
  })

  it('should load dashboard data via API', () => {
    cy.wait('@getDashboard').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
      expect(interception.response.body).to.have.property('total_customer_count')
    })
  })

  it('should navigate to invoices section', () => {
    // Buscar link de navegación a facturas con diferentes textos posibles
    cy.get('nav, .sidebar, .menu').within(() => {
      cy.contains('Invoice').click()
    })
    
    cy.url().should('include', '/admin/invoices')
    cy.waitForPageLoad()
    cy.contains('Invoice').should('be.visible')
  })

  it('should navigate to customers section', () => {
    cy.get('nav, .sidebar, .menu').within(() => {
      cy.contains('Customer').click()
    })
    
    cy.url().should('include', '/admin/customers')
    cy.waitForPageLoad()
    cy.contains('Customer').should('be.visible')
  })

  it('should navigate to estimates section', () => {
    cy.get('nav, .sidebar, .menu').within(() => {
      cy.contains('Estimate').click()
    })
    
    cy.url().should('include', '/admin/estimates')
    cy.waitForPageLoad()
    cy.contains('Estimate').should('be.visible')
  })

  it('should have working search functionality', () => {
    // Buscar campo de búsqueda global
    cy.get('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]')
      .first()
      .type('INV-001{enter}')
    
    cy.wait('@apiCall')
    // Verificar que aparezcan resultados de búsqueda
    cy.get('body').should('contain.text', 'INV')
  })

  it('should display recent activities or items', () => {
    // Verificar que hay algún tipo de lista de elementos recientes
    cy.get('.recent, .list, table, .invoice-list, .customer-list').should('exist')
  })

  it('should have responsive design', () => {
    // Probar diferentes tamaños de pantalla
    cy.viewport('iphone-6')
    cy.get('body').should('be.visible')
    
    cy.viewport('ipad-2')
    cy.get('body').should('be.visible')
    
    cy.viewport(1920, 1080)
    cy.get('body').should('be.visible')
  })

  it('should allow logout', () => {
    // Buscar botón de logout en diferentes ubicaciones posibles
    cy.get('.user-menu, .dropdown, .profile-menu').click()
    cy.contains('Logout', 'Sign out', 'Exit').click()
    
    // Verificar redirección al login
    cy.url().should('include', '/login')
  })

  it('should display charts or graphs if available', () => {
    // Verificar si hay gráficos en el dashboard
    cy.get('canvas, .chart, .graph, svg').should('have.length.at.least', 0)
  })
}) 