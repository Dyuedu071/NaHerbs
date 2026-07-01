package vn.io.naherb.health;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthComponent;
import org.springframework.boot.actuate.health.HealthEndpoint;

class HealthServiceTests {

    @Test
    void resolveStatusDelegatesToActuator() {
        HealthEndpoint healthEndpoint = mock(HealthEndpoint.class);
        HealthComponent healthComponent = Health.up().build();
        when(healthEndpoint.health()).thenReturn(healthComponent);

        HealthService healthService = new HealthService(healthEndpoint);

        assertEquals("UP", healthService.resolveStatus());
    }
}
