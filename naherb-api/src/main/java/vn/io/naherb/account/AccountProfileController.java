package vn.io.naherb.account;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import vn.io.naherb.account.dto.AccountProfileResponse;
import vn.io.naherb.account.dto.UpdateProfileRequest;
import vn.io.naherb.common.response.ApiResponse;

@RestController
@RequestMapping("/api/account/profile")
@RequiredArgsConstructor
public class AccountProfileController {

    private final AccountProfileService accountProfileService;

    @GetMapping
    public ApiResponse<AccountProfileResponse> getProfile(JwtAuthenticationToken authentication) {
        return ApiResponse.ok(accountProfileService.getProfile(authentication));
    }

    @PutMapping
    public ApiResponse<AccountProfileResponse> updateProfile(
            JwtAuthenticationToken authentication, @Valid @RequestBody UpdateProfileRequest request) {
        return ApiResponse.ok(accountProfileService.updateProfile(authentication, request));
    }

    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<AccountProfileResponse> uploadAvatar(
            JwtAuthenticationToken authentication, @RequestPart("file") MultipartFile file) {
        return ApiResponse.ok(accountProfileService.uploadAvatar(authentication, file));
    }
}
