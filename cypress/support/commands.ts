// @ts-nocheck
/// <reference types="cypress" />

Cypress.Commands.add('mockAuth', () => {
  // Intercept Supabase signUp API call
  cy.intercept('POST', '**/auth/v1/signup', {
    statusCode: 200,
    body: {
      user: {
        id: 'test-user',
        email: 'test@example.com',
      },
      session: null,
    },
  }).as('signUp');

  // Intercept Supabase signInWithPassword
  cy.intercept('POST', '**/auth/v1/token', (req) => {
    if (req.body?.grant_type === 'password') {
      req.reply({
        statusCode: 200,
        body: {
          access_token: 'fakeAccessToken',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'fakeRefreshToken',
          user: {
            id: 'test-user',
            email: 'test@example.com',
          },
        },
      });
    }
  }).as('signIn');
});

declare global {
  namespace Cypress {
    interface Chainable {
      /** Mocks Supabase auth endpoints for happy-path flows */
      mockAuth(): Chainable<void>;
    }
  }
} 