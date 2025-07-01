describe('Admin Login Tests', () => {
  beforeEach(() => {
    cy.visit('/admin/login')
    cy.waitForPageLoad()
  })

  it('should display login form elements', () => {
    cy.get('input[name="email"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
    cy.contains('Sign In').should('be.visible')
  })

  it('should login with valid credentials', () => {
    cy.get('input[name="email"]').type('admin@invoiceshelf.com')
    cy.get('input[name="password"]').type('admin@123')
    cy.get('button[type="submit"]').click()
    
    cy.url().should('include', '/admin/dashboard')
    cy.waitForPageLoad()
    cy.contains('Dashboard').should('be.visible')
  })

  it('should show error with invalid credentials', () => {
    cy.get('input[name="email"]').type('invalid@email.com')
    cy.get('input[name="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()
    
    // Buscar mensaje de error en diferentes posibles ubicaciones
    cy.get('body').should('contain.text', 'invalid')
      .or('contain.text', 'incorrect')
      .or('contain.text', 'failed')
      .or('contain.text', 'error')
  })

  it('should validate required fields', () => {
    cy.get('button[type="submit"]').click()
    
    // Verificar validación HTML5 o mensajes de error personalizados
    cy.get('input[name="email"]').then(($input) => {
      expect($input[0].validity.valid).to.be.false
    })
    
    cy.get('input[name="password"]').then(($input) => {
      expect($input[0].validity.valid).to.be.false
    })
  })

  it('should navigate to password reset page', () => {
    cy.contains('Forgot').click()
    cy.url().should('include', 'password')
  })

  it('should have proper form accessibility', () => {
    cy.get('input[name="email"]').should('have.attr', 'type', 'email')
    cy.get('input[name="password"]').should('have.attr', 'type', 'password')
    
    // Verificar labels asociados
    cy.get('label').should('exist')
  })
}) 