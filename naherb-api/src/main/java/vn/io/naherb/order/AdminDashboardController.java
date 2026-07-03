package vn.io.naherb.order;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.io.naherb.common.response.ApiResponse;
import vn.io.naherb.order.dto.DashboardStatsResponse;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ApiResponse<DashboardStatsResponse> getDashboardStats() {
        return ApiResponse.ok(dashboardService.getDashboardStats());
    }
}
