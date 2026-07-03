package vn.io.naherb.setting;

import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import vn.io.naherb.common.response.ApiResponse;

@RestController
@RequiredArgsConstructor
public class SiteSettingController {

    private final SiteSettingService siteSettingService;

    /** Admin: đọc toàn bộ settings */
    @GetMapping("/api/admin/settings")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Map<String, String>> getSettings() {
        return ApiResponse.ok(siteSettingService.getAllSettings());
    }

    /** Admin: cập nhật settings */
    @PutMapping("/api/admin/settings")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> updateSettings(@RequestBody Map<String, String> updates) {
        siteSettingService.saveSettings(updates);
        return ApiResponse.ok(null);
    }

    /** Public: chỉ trả về các key cần thiết cho SEO / frontend hiển thị */
    @GetMapping("/api/v1/settings/site-info")
    public ApiResponse<Map<String, String>> getPublicSiteInfo() {
        var publicKeys = List.of(
                "store_name", "store_tagline",
                "store_seo_title", "store_seo_description",
                "store_phone", "store_hotline", "store_email",
                "store_address", "store_city", "store_working_hours",
                "store_facebook_url", "store_zalo_url", "store_instagram_url"
        );
        return ApiResponse.ok(siteSettingService.getSettingsByKeys(publicKeys));
    }
}
