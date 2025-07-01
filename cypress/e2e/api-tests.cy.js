describe('API Tests', () => {
  let authToken

  before(() => {
    cy.apiLogin().then((token) => {
      authToken = token
    })
  })

  describe('Authentication API', () => {
    it('should login via API and receive token', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/auth/login`,
        body: {
          email: Cypress.env('adminEmail'),
          password: Cypress.env('adminPassword'),
          device_name: 'cypress-test'
        }
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('token')
        expect(response.body.token).to.be.a('string')
        expect(response.body.user).to.have.property('email')
      })
    })

    it('should fail login with invalid credentials', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/auth/login`,
        body: {
          email: 'invalid@email.com',
          password: 'wrongpassword',
          device_name: 'cypress-test'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 422])
      })
    })
  })

  describe('Dashboard API', () => {
    it('should get dashboard data via API', () => {
      cy.apiRequest('GET', '/dashboard', null, authToken).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('total_customer_count')
        expect(response.body).to.have.property('total_invoice_count')
        expect(response.body).to.have.property('total_estimate_count')
        expect(response.body.total_customer_count).to.be.a('number')
      })
    })

    it('should get dashboard with active filter', () => {
      cy.apiRequest('GET', '/dashboard?active_only=true', null, authToken).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('active_filter_applied', true)
      })
    })
  })

  describe('Invoices API', () => {
    it('should get invoices list via API', () => {
      cy.apiRequest('GET', '/invoices', null, authToken).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('data')
        expect(response.body.data).to.be.an('array')
        expect(response.body).to.have.property('meta')
      })
    })

    it('should create invoice via API', () => {
      const invoiceData = {
        customer_id: 1,
        invoice_date: '2024-12-30',
        due_date: '2025-01-30',
        status: 'DRAFT',
        items: [
          {
            name: 'Cypress Test Service',
            quantity: 1,
            price: 150.00,
            description: 'Test service created by Cypress'
          }
        ]
      }

      cy.apiRequest('POST', '/invoices', invoiceData, authToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 201])
        expect(response.body.data).to.have.property('id')
        expect(response.body.data.status).to.eq('DRAFT')
        
        // Guardar ID para pruebas posteriores
        cy.wrap(response.body.data.id).as('invoiceId')
      })
    })

    it('should get specific invoice via API', function() {
      if (this.invoiceId) {
        cy.apiRequest('GET', `/invoices/${this.invoiceId}`, null, authToken).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.data).to.have.property('id', this.invoiceId)
          expect(response.body.data).to.have.property('status')
        })
      }
    })

    it('should filter invoices by status', () => {
      cy.apiRequest('GET', '/invoices?status=DRAFT', null, authToken).then((response) => {
        expect(response.status).to.eq(200)
        if (response.body.data.length > 0) {
          response.body.data.forEach(invoice => {
            expect(invoice.status).to.eq('DRAFT')
          })
        }
      })
    })
  })

  describe('Customers API', () => {
    it('should get customers list via API', () => {
      cy.apiRequest('GET', '/customers', null, authToken).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('data')
        expect(response.body.data).to.be.an('array')
      })
    })

    it('should create customer via API', () => {
      const customerData = {
        name: 'Cypress Test Customer',
        email: 'cypress.test@example.com',
        phone: '+1234567890',
        billing: {
          name: 'Cypress Test Customer',
          address_street_1: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          zip: '12345',
          country_id: 1
        }
      }

      cy.apiRequest('POST', '/customers', customerData, authToken).then((response) => {
        expect(response.status).to.be.oneOf([200, 201])
        expect(response.body.data).to.have.property('id')
        expect(response.body.data.name).to.eq('Cypress Test Customer')
      })
    })
  })

  describe('Estimates API', () => {
    it('should get estimates list via API', () => {
      cy.apiRequest('GET', '/estimates', null, authToken).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('data')
        expect(response.body.data).to.be.an('array')
      })
    })
  })

  describe('Configuration API', () => {
    it('should get languages configuration', () => {
      cy.apiRequest('GET', '/config?key=languages', null, authToken).then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    it('should get currencies configuration', () => {
      cy.apiRequest('GET', '/config?key=fiscal_years', null, authToken).then((response) => {
        expect(response.status).to.eq(200)
      })
    })
  })

  describe('Error Handling', () => {
    it('should return 401 for unauthorized requests', () => {
      cy.apiRequest('GET', '/dashboard', null, 'invalid-token').then((response) => {
        expect(response.status).to.eq(401)
      })
    })

    it('should return 404 for non-existent endpoints', () => {
      cy.apiRequest('GET', '/non-existent-endpoint', null, authToken).then((response) => {
        expect(response.status).to.eq(404)
      })
    })

    it('should handle malformed requests', () => {
      cy.apiRequest('POST', '/invoices', { invalid: 'data' }, authToken).then((response) => {
        expect(response.status).to.be.oneOf([400, 422])
      })
    })
  })
}) 