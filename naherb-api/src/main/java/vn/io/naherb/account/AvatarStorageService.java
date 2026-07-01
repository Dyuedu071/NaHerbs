package vn.io.naherb.account;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import java.io.IOException;
import java.util.Locale;
import java.util.Map;
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
    private final Cloudinary cloudinary;

    public String storeAvatar(UUID accountId, MultipartFile file) {
        return storeAvatar(accountId, file, null);
    }

    public String storeAvatar(UUID accountId, MultipartFile file, String oldAvatarUrl) {
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

        deleteOldAvatarFromCloudinary(oldAvatarUrl);

        try {
            String publicId = "avatar_" + accountId.toString() + "_" + UUID.randomUUID().toString().substring(0, 8);
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "public_id", publicId,
                    "folder", "naherb/avatars",
                    "resource_type", "image"
            ));
            return uploadResult.get("secure_url").toString();
        } catch (IOException exception) {
            throw new BadRequestException("Không thể lưu ảnh đại diện: " + exception.getMessage());
        }
    }

    private void deleteOldAvatarFromCloudinary(String oldAvatarUrl) {
        if (!StringUtils.hasText(oldAvatarUrl) || !oldAvatarUrl.contains("cloudinary.com")) {
            return;
        }
        try {
            int uploadIdx = oldAvatarUrl.indexOf("/upload/");
            if (uploadIdx != -1) {
                String path = oldAvatarUrl.substring(uploadIdx + 8);
                if (path.matches("^v\\d+/.*")) {
                    path = path.replaceFirst("^v\\d+/", "");
                }
                int dotIdx = path.lastIndexOf('.');
                if (dotIdx != -1) {
                    String publicId = path.substring(0, dotIdx);
                    cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("invalidate", true));
                }
            }
        } catch (Exception ignored) {
            // Best effort cleanup
        }
    }
}
