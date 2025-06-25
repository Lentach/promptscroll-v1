// @ts-nocheck
import './commands';

// Runs once before every test
beforeEach(() => {
  cy.mockAuth();
}); 