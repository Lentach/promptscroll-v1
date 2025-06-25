// @ts-nocheck
describe('Authentication flows', () => {
  const email = 'test@example.com';
  const password = 'SuperSecret123!';

  it('allows a user to sign up', () => {
    cy.visit('/register');

    cy.get('input#email').type(email);
    cy.get('input#displayName').type('E2E Tester');
    cy.get('input#password').type(password);

    cy.contains('button', 'Sign Up').click();

    // Should show confirmation message
    cy.contains('Please check your email to confirm your account.').should('be.visible');

    // Supabase API call should have happened
    cy.wait('@signUp');
  });

  it('allows a user to sign in', () => {
    cy.visit('/login');

    cy.get('input#email').type(email);
    cy.get('input#password').type(password);

    cy.contains('button', 'Sign In').click();

    // Supabase signIn API call should have happened
    cy.wait('@signIn');

    // App should navigate away from /login (modal closed)
    cy.location('pathname').should('eq', '/');
  });
}); 