package vn.io.naherb.account;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.io.naherb.account.dto.AccountAddressResponse;
import vn.io.naherb.account.dto.UpsertAddressRequest;
import vn.io.naherb.common.response.ApiResponse;

@RestController
@RequestMapping("/api/account/addresses")
@RequiredArgsConstructor
public class AccountAddressController {

    private final AccountAddressService accountAddressService;

    @GetMapping
    public ApiResponse<List<AccountAddressResponse>> listAddresses(JwtAuthenticationToken authentication) {
        return ApiResponse.ok(accountAddressService.listAddresses(authentication));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AccountAddressResponse>> createAddress(
            JwtAuthenticationToken authentication, @Valid @RequestBody UpsertAddressRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(accountAddressService.createAddress(authentication, request)));
    }

    @PutMapping("/{addressId}")
    public ApiResponse<AccountAddressResponse> updateAddress(
            JwtAuthenticationToken authentication,
            @PathVariable UUID addressId,
            @Valid @RequestBody UpsertAddressRequest request) {
        return ApiResponse.ok(accountAddressService.updateAddress(authentication, addressId, request));
    }

    @DeleteMapping("/{addressId}")
    public ApiResponse<Void> deleteAddress(
            JwtAuthenticationToken authentication, @PathVariable UUID addressId) {
        accountAddressService.deleteAddress(authentication, addressId);
        return ApiResponse.ok(null);
    }

    @PatchMapping("/{addressId}/default")
    public ApiResponse<Void> setDefaultAddress(
            JwtAuthenticationToken authentication, @PathVariable UUID addressId) {
        accountAddressService.setDefaultAddress(authentication, addressId);
        return ApiResponse.ok(null);
    }
}
