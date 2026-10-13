Feature: GreenKart catalog
  As a shopper
  I want to browse the GreenKart catalog and search for produce
  So that I can find products to buy

  @GK-001
  Scenario: Initial catalog and navigation controls render
    Given I open the GreenKart catalog
    Then the catalog and navigation controls should be rendered

  @GK-002
  Scenario: Search by exact, partial, and case-varied product name
    Given I open the GreenKart catalog
    When I search for "Apple"
    Then only "Apple - 1 Kg" should be shown and its price should be saved
    When I search for "app"
    Then only "Apple - 1 Kg" should be shown with the saved price
    When I search for "aPpLe"
    Then only "Apple - 1 Kg" should be shown with the saved price
    And I should remain on the catalog page
