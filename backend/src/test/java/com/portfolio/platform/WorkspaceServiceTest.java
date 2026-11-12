package com.portfolio.platform;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;

class WorkspaceServiceTest {
  @Test void createsAndSearchesItems() {
    var service = new WorkspaceService();
    var created = service.create(new WorkspaceItem(null, "Ceramic coating dossier", "Assurance Lab", "Draft", "High"));
    assertEquals("Ceramic coating dossier", created.title());
    assertEquals(1, service.find("Ceramic coating").size());
  }

  @Test void updatesKnownItemsAndRejectsMissingOnes() {
    var service = new WorkspaceService();
    var updated = service.update(1, new WorkspaceItem(null, "Updated", "Owner", "Approved", "Low"));
    assertEquals("Approved", updated.status());
    assertThrows(ItemNotFoundException.class, () -> service.update(999, updated));
  }
}
