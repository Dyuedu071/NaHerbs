package vn.io.naherb.chatbot.guardrail;

import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;

@Service
public class GuardrailService {

    private static final List<Pattern> BLOCKED_PATTERNS = List.of(
            Pattern.compile("chữa khỏi", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE),
            Pattern.compile("chẩn đoán", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE),
            Pattern.compile("kê đơn", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE),
            Pattern.compile("thay thế thuốc", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE),
            Pattern.compile("điều trị bệnh", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE));

    private static final String DISCLAIMER_SUFFIX =
            "\n\nLưu ý: Thông tin chỉ mang tính tham khảo, không thay thế tư vấn y khoa.";

    public String sanitize(String answer) {
        if (answer == null || answer.isBlank()) {
            return "Xin lỗi, tôi chưa có đủ thông tin để trả lời câu hỏi này.";
        }
        String sanitized = answer.trim();
        for (Pattern pattern : BLOCKED_PATTERNS) {
            if (pattern.matcher(sanitized).find()) {
                return "NaHerbs chỉ hỗ trợ tư vấn sản phẩm chăm sóc và thư giãn. "
                        + "Chúng tôi không chẩn đoán, kê đơn hay cam kết điều trị bệnh. "
                        + "Bạn nên tham khảo ý kiến bác sĩ nếu có vấn đề sức khỏe cần điều trị.";
            }
        }
        String lower = sanitized.toLowerCase(Locale.ROOT);
        if (!lower.contains("tham khảo") && !lower.contains("không thay thế")) {
            sanitized = sanitized + DISCLAIMER_SUFFIX;
        }
        return sanitized;
    }
}
