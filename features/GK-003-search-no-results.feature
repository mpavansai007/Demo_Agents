Feature: GreenKart search with no matching products
  As a shopper
  I want to clear an unsuccessful search
  So that I can return to the full catalog

  @GK-003
  Scenario: No-match search and clearing search recover cleanly
    Given I open the GreenKart catalog
    And I record the number of catalog products
    When I search for "no-such-vegetable-xyz"
    Then no products should be shown
    When I clear the product search
    Then the full catalog should be restored
