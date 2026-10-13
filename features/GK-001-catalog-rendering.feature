Feature: GreenKart catalog rendering
  As a shopper
  I want the catalog and navigation controls to load correctly
  So that I can browse the store

  @GK-001
  Scenario: Initial catalog and navigation controls render
    Given I open the GreenKart catalog
    Then the catalog and navigation controls should be rendered
