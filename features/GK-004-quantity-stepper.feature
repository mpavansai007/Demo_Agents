Feature: GreenKart product quantity stepper
  As a shopper
  I want product quantities to respect the minimum value
  So that I cannot select an invalid quantity

  @GK-004
  Scenario: Quantity stepper respects its lower boundary
    Given I open the GreenKart catalog
    And I record the first product quantity and a neighboring product quantity
    When I decrement the first product at its minimum
    Then the first product quantity should remain at its minimum
    When I increment and then decrement the first product quantity
    Then the first product quantity should return to its minimum
    And the neighboring product quantity should remain unchanged
