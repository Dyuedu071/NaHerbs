package vn.io.naherb.order;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.io.naherb.common.enums.PaymentMethod;
import vn.io.naherb.order.dto.QrInstructionResponse;
import vn.io.naherb.setting.SiteSetting;
import vn.io.naherb.setting.SiteSettingRepository;

@Service
@RequiredArgsConstructor
public class QrInstructionService {

    private static final List<String> BANK_SETTING_KEYS = List.of(
            "bankName",
            "bank.name",
            "bank_name",
            "BANK_NAME",
            "bankAccountName",
            "bank.accountName",
            "bank_account_name",
            "BANK_ACCOUNT_NAME",
            "bankAccountNumber",
            "bank.accountNumber",
            "bank_account_number",
            "BANK_ACCOUNT_NUMBER",
            "bankQrImageUrl",
            "bank.qrImageUrl",
            "bank_qr_image_url",
            "BANK_QR_IMAGE_URL");

    private final SiteSettingRepository siteSettingRepository;

    @Transactional(readOnly = true)
    public QrInstructionResponse buildFor(Order order) {
        if (order.getPaymentMethod() != PaymentMethod.BANK_QR) {
            return null;
        }

        Map<String, SiteSetting> settings = siteSettingRepository.findBySettingKeyIn(BANK_SETTING_KEYS).stream()
                .collect(Collectors.toMap(
                        setting -> setting.getSettingKey().toLowerCase(Locale.ROOT),
                        Function.identity(),
                        (first, ignored) -> first));

        return new QrInstructionResponse(
                firstValue(settings, "bankName", "bank.name", "bank_name"),
                firstValue(settings, "bankAccountName", "bank.accountName", "bank_account_name"),
                firstValue(settings, "bankAccountNumber", "bank.accountNumber", "bank_account_number"),
                firstValue(settings, "bankQrImageUrl", "bank.qrImageUrl", "bank_qr_image_url"),
                order.getOrderCode());
    }

    private static String firstValue(Map<String, SiteSetting> settings, String... keys) {
        for (String key : keys) {
            SiteSetting setting = settings.get(key.toLowerCase(Locale.ROOT));
            if (setting != null && setting.getSettingValue() != null && !setting.getSettingValue().isBlank()) {
                return setting.getSettingValue();
            }
        }
        return null;
    }
}
