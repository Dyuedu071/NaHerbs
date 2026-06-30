package vn.io.naherb.account;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.io.naherb.account.dto.AccountAddressResponse;
import vn.io.naherb.account.dto.UpsertAddressRequest;
import vn.io.naherb.exception.NotFoundException;
import vn.io.naherb.security.CurrentAccountHelper;

@Service
@RequiredArgsConstructor
public class AccountAddressService {

    private final AccountAddressRepository accountAddressRepository;
    private final AccountRepository accountRepository;

    @Transactional(readOnly = true)
    public List<AccountAddressResponse> listAddresses(JwtAuthenticationToken authentication) {
        UUID accountId = CurrentAccountHelper.requireAccountId(authentication, accountRepository);
        return accountAddressRepository.findByAccount_IdOrderByCreatedAtDesc(accountId).stream()
                .map(AccountAddressMapper::toResponse)
                .toList();
    }

    @Transactional
    public AccountAddressResponse createAddress(
            JwtAuthenticationToken authentication, UpsertAddressRequest request) {
        Account account = requireAccount(authentication);
        boolean shouldBeDefault = resolveDefaultOnCreate(account.getId(), request.isDefault());

        AccountAddress address = new AccountAddress(
                account,
                request.receiverName().trim(),
                request.receiverPhone().trim(),
                normalizeEmailOptional(request.email()),
                request.provinceCity().trim(),
                request.wardCommune().trim(),
                request.addressDetail().trim(),
                blankToNull(request.note()),
                shouldBeDefault);

        if (shouldBeDefault) {
            clearDefaultFlags(account.getId());
        }

        return AccountAddressMapper.toResponse(accountAddressRepository.save(address));
    }

    @Transactional
    public AccountAddressResponse updateAddress(
            JwtAuthenticationToken authentication, UUID addressId, UpsertAddressRequest request) {
        UUID accountId = CurrentAccountHelper.requireAccountId(authentication, accountRepository);
        AccountAddress address = findOwnedAddress(accountId, addressId);

        applyRequest(address, request);

        if (Boolean.TRUE.equals(request.isDefault())) {
            clearDefaultFlags(accountId);
            address.setDefault(true);
        }

        return AccountAddressMapper.toResponse(accountAddressRepository.save(address));
    }

    @Transactional
    public void deleteAddress(JwtAuthenticationToken authentication, UUID addressId) {
        UUID accountId = CurrentAccountHelper.requireAccountId(authentication, accountRepository);
        AccountAddress address = findOwnedAddress(accountId, addressId);
        boolean wasDefault = address.isDefault();

        accountAddressRepository.delete(address);

        if (wasDefault) {
            promoteNextDefault(accountId);
        }
    }

    @Transactional
    public void setDefaultAddress(JwtAuthenticationToken authentication, UUID addressId) {
        UUID accountId = CurrentAccountHelper.requireAccountId(authentication, accountRepository);
        AccountAddress address = findOwnedAddress(accountId, addressId);

        clearDefaultFlags(accountId);
        address.setDefault(true);
        accountAddressRepository.save(address);
    }

    private AccountAddress findOwnedAddress(UUID accountId, UUID addressId) {
        return accountAddressRepository
                .findByIdAndAccount_Id(addressId, accountId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy địa chỉ"));
    }

    private Account requireAccount(JwtAuthenticationToken authentication) {
        return accountRepository
                .findByEmailIgnoreCase(CurrentAccountHelper.requireAccountEmail(authentication))
                .orElseThrow(() -> new NotFoundException("Không tìm thấy tài khoản"));
    }

    private boolean resolveDefaultOnCreate(UUID accountId, Boolean requestedDefault) {
        if (accountAddressRepository.countByAccount_Id(accountId) == 0) {
            return true;
        }
        return Boolean.TRUE.equals(requestedDefault);
    }

    private void clearDefaultFlags(UUID accountId) {
        accountAddressRepository.findByAccount_IdOrderByCreatedAtDesc(accountId).forEach(address -> {
            if (address.isDefault()) {
                address.setDefault(false);
            }
        });
    }

    private void promoteNextDefault(UUID accountId) {
        accountAddressRepository.findByAccount_IdOrderByCreatedAtDesc(accountId).stream()
                .min(Comparator.comparing(AccountAddress::getCreatedAt))
                .ifPresent(next -> {
                    next.setDefault(true);
                    accountAddressRepository.save(next);
                });
    }

    private static void applyRequest(AccountAddress address, UpsertAddressRequest request) {
        address.setReceiverName(request.receiverName().trim());
        address.setReceiverPhone(request.receiverPhone().trim());
        address.setReceiverEmail(normalizeEmailOptional(request.email()));
        address.setProvinceName(request.provinceCity().trim());
        address.setWardName(request.wardCommune().trim());
        address.setAddressLine(request.addressDetail().trim());
        address.setNote(blankToNull(request.note()));
    }

    private static String normalizeEmailOptional(String email) {
        if (email == null || email.isBlank()) {
            return null;
        }
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
