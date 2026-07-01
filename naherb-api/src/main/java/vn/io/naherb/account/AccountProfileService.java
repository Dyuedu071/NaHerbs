package vn.io.naherb.account;

import java.util.Locale;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import vn.io.naherb.account.dto.AccountProfileResponse;
import vn.io.naherb.account.dto.UpdateProfileRequest;
import vn.io.naherb.exception.ConflictException;
import vn.io.naherb.exception.NotFoundException;
import vn.io.naherb.security.CurrentAccountHelper;

@Service
@RequiredArgsConstructor
public class AccountProfileService {

    private final AccountProfileRepository accountProfileRepository;
    private final AccountRepository accountRepository;
    private final AvatarStorageService avatarStorageService;

    @Transactional(readOnly = true)
    public AccountProfileResponse getProfile(JwtAuthenticationToken authentication) {
        AccountProfile profile = findProfileForCurrentAccount(authentication);
        return AccountProfileMapper.toResponse(profile);
    }

    @Transactional
    public AccountProfileResponse updateProfile(
            JwtAuthenticationToken authentication, UpdateProfileRequest request) {
        UUID accountId = CurrentAccountHelper.requireAccountId(authentication, accountRepository);
        AccountProfile profile = accountProfileRepository
                .findByAccountId(accountId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy hồ sơ"));

        String phone = normalizeOptional(request.phone());
        if (phone != null && accountProfileRepository.existsByPhoneAndAccount_IdNot(phone, accountId)) {
            throw new ConflictException("Số điện thoại đã được sử dụng");
        }

        profile.setFullName(request.fullName().trim());
        profile.setPhone(phone);
        profile.setContactEmail(normalizeEmailOptional(request.contactEmail()));
        profile.setAvatarUrl(blankToNull(request.avatarUrl()));

        Account account = profile.getAccount();
        account.setName(profile.getFullName());

        return AccountProfileMapper.toResponse(accountProfileRepository.save(profile));
    }

    @Transactional
    public AccountProfileResponse uploadAvatar(
            JwtAuthenticationToken authentication, MultipartFile file) {
        UUID accountId = CurrentAccountHelper.requireAccountId(authentication, accountRepository);
        AccountProfile profile = accountProfileRepository
                .findByAccountId(accountId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy hồ sơ"));

        String avatarUrl = avatarStorageService.storeAvatar(accountId, file, profile.getAvatarUrl());
        profile.setAvatarUrl(avatarUrl);
        return AccountProfileMapper.toResponse(accountProfileRepository.save(profile));
    }

    private AccountProfile findProfileForCurrentAccount(JwtAuthenticationToken authentication) {
        UUID accountId = CurrentAccountHelper.requireAccountId(authentication, accountRepository);
        return accountProfileRepository
                .findByAccountId(accountId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy hồ sơ"));
    }

    private static String normalizeOptional(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private static String normalizeEmailOptional(String email) {
        String normalized = normalizeOptional(email);
        return normalized == null ? null : normalized.toLowerCase(Locale.ROOT);
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
