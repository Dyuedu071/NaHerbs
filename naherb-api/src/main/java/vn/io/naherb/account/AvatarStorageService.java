package vn.io.naherb.account;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import vn.io.naherb.config.UploadProperties;
import vn.io.naherb.exception.BadRequestException;

@Service
@RequiredArgsConstructor
public class AvatarStorageService {

    private static final Set<String> ALLOWED_CONTENT_TYPES =
            Set.of("image/jpeg", "image/png", "image/webp", "image/jpg");

    private final UploadProperties uploadProperties;

    public String storeAvatar(UUID accountId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Vui lòng chọn ảnh đại diện");
        }
        if (file.getSize() > uploadProperties.getMaxAvatarBytes()) {
            throw new BadRequestException("Ảnh đại diện không được vượt quá 2MB");
        }

        String contentType = file.getContentType();
        if (!StringUtils.hasText(contentType) || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase(Locale.ROOT))) {
            throw new BadRequestException("Chỉ chấp nhận ảnh JPG, PNG hoặc WebP");
        }

        try {
            Path accountDir = resolveBasePath()
                    .resolve("avatars")
                    .resolve(accountId.toString());
            Files.createDirectories(accountDir);
            deleteExistingAvatars(accountDir);

            String extension = extensionFor(contentType);
            String filename = UUID.randomUUID() + extension;
            Path target = accountDir.resolve(filename);
            file.transferTo(target.toFile());

            String publicBase = uploadProperties.getPublicBaseUrl().replaceAll("/$", "");
            return publicBase + "/media/avatars/" + accountId + "/" + filename;
        } catch (IOException exception) {
            throw new BadRequestException("Không thể lưu ảnh đại diện: " + exception.getMessage());
        }
    }

    private Path resolveBasePath() {
        return Paths.get(uploadProperties.getBasePath()).toAbsolutePath().normalize();
    }

    private static void deleteExistingAvatars(Path accountDir) throws IOException {
        if (!Files.isDirectory(accountDir)) {
            return;
        }
        try (var files = Files.list(accountDir)) {
            files.forEach(path -> {
                try {
                    Files.deleteIfExists(path);
                } catch (IOException ignored) {
                    // best effort cleanup
                }
            });
        }
    }

    private static String extensionFor(String contentType) {
        return switch (contentType.toLowerCase(Locale.ROOT)) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> ".jpg";
        };
    }
}
