package vn.io.naherb.health;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.actuate.health.HealthComponent;
import org.springframework.boot.actuate.health.HealthEndpoint;
import org.springframework.boot.actuate.health.Status;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HealthService {

    private final HealthEndpoint healthEndpoint;

    public String resolveStatus() {
        HealthComponent health = healthEndpoint.health();
        Status status = health.getStatus();
        return status.getCode();
    }
}
