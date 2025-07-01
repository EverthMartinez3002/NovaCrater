// Comandos personalizados para NovaCrater

Cypress.Commands.add('login', (email = 'admin@invoiceshelf.com', password = 'admin@123') => {
  cy.visit('/admin/login')
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password)
  cy.get('button[type="submit"]').click()
  // Esperar redirección al dashboard
  cy.url().should('include', '/admin/dashboard')
})

Cypress.Commands.add('loginCustomer', (email, password) => {
  cy.visit('/customer/login')
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password)
  cy.get('button[type="submit"]').click()
})

Cypress.Commands.add('createInvoice', (customerName = 'Test Customer') => {
  cy.visit('/admin/invoices')
  cy.contains('New Invoice').click()
  cy.get('[data-cy="customer-select"]').click()
  cy.get('[data-cy="customer-option"]').contains(customerName).click()
  cy.get('[data-cy="invoice-save-button"]').click()
})

Cypress.Commands.add('apiLogin', () => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/auth/login`,
    body: {
      email: Cypress.env('adminEmail'),
      password: Cypress.env('adminPassword'),
      device_name: 'cypress-test'
    }
  }).then((response) => {
    expect(response.status).to.eq(200)
    window.localStorage.setItem('auth_token', response.body.token)
    return response.body.token
  })
})

Cypress.Commands.add('apiRequest', (method, endpoint, body = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json'
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return cy.request({
    method,
    url: `${Cypress.env('apiUrl')}${endpoint}`,
    body,
    headers,
    failOnStatusCode: false
  })
})

// Comando para esperar que la página cargue completamente
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible')
  cy.wait(1000) // Esperar un poco más para asegurar que todo cargue
})

// Comando para limpiar datos de prueba
Cypress.Commands.add('cleanupTestData', () => {
  cy.window().then((win) => {
    win.localStorage.clear()
    win.sessionStorage.clear()
  })
}) 