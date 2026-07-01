package vn.io.naherb.health;

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
