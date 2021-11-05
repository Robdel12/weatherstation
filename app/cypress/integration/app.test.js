describe('application smoke test', () => {
  it('renders home without error', () => {
    cy.visit('http://localhost:8080');
    cy.get('h3.text-3xl').then(($h3) => {
      expect($h3).to.have.text('Highs & lows');
    });
  });

  it('renders live without error', () => {
    cy.visit('http://localhost:8080/live');
    cy.get('h1').then(($h1) => {
      expect($h1).to.have.text('Live weather');
    });
  });
});
