package vn.io.naherb.health;

import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.io.naherb.common.response.ApiResponse;
import vn.io.naherb.common.response.HealthStatusData;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class HealthController {

    private final HealthService healthService;

    /**
     * Liveness for Docker: process is up. Does not probe Redis/DB.
     * Keeps compose from blocking FE when dependencies flap.
     */
    @GetMapping("/live")
    public ResponseEntity<ApiResponse<Map<String, String>>> getLiveness() {
        return ResponseEntity.ok(ApiResponse.ok(Map.of("status", "UP")));
    }

    /** Readiness: includes Actuator dependency checks (DB/Redis/...). */
    @GetMapping
    public ResponseEntity<ApiResponse<HealthStatusData>> getHealth() {
        String status = healthService.resolveStatus();
        HealthStatusData data = new HealthStatusData(status);
        if ("UP".equals(status)) {
            return ResponseEntity.ok(ApiResponse.ok(data));
        }
        return ResponseEntity.status(503).body(ApiResponse.failure("Service unavailable", data));
    }
}
