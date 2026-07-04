package vn.io.naherb.order;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
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
            "bankBin",
            "bank.bin",
            "bank_bin",
            "BANK_BIN",
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

        String bankName = firstValue(settings, "bankName", "bank.name", "bank_name");
        String accountName = firstValue(settings, "bankAccountName", "bank.accountName", "bank_account_name");
        String accountNumber = firstValue(settings, "bankAccountNumber", "bank.accountNumber", "bank_account_number");
        String bankBin = firstValue(settings, "bankBin", "bank.bin", "bank_bin");
        String transferContent = order.getOrderCode();
        String qrImageUrl = buildVietQrImageUrl(bankBin, accountNumber, accountName, order.getFinalAmount(), transferContent);

        if (qrImageUrl == null) {
            qrImageUrl = firstValue(settings, "bankQrImageUrl", "bank.qrImageUrl", "bank_qr_image_url");
        }

        return new QrInstructionResponse(
                bankName,
                accountName,
                accountNumber,
                qrImageUrl,
                transferContent);
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

    private static String buildVietQrImageUrl(
            String bankBin,
            String accountNumber,
            String accountName,
            BigDecimal amount,
            String transferContent) {
        if (isBlank(bankBin) || isBlank(accountNumber)) {
            return null;
        }

        StringBuilder url = new StringBuilder("https://img.vietqr.io/image/")
                .append(encode(bankBin.trim()))
                .append("-")
                .append(encode(accountNumber.trim()))
                .append("-compact2.png");

        boolean hasQuery = false;
        if (amount != null && amount.signum() > 0) {
            url.append("?amount=").append(amount.toBigInteger());
            hasQuery = true;
        }
        if (!isBlank(transferContent)) {
            url.append(hasQuery ? "&" : "?")
                    .append("addInfo=")
                    .append(encode(transferContent.trim()));
            hasQuery = true;
        }
        if (!isBlank(accountName)) {
            url.append(hasQuery ? "&" : "?")
                    .append("accountName=")
                    .append(encode(accountName.trim()));
        }
        return url.toString();
    }

    private static String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8).replace("+", "%20");
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
