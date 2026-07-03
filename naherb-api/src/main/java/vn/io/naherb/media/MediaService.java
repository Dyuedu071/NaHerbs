package vn.io.naherb.media;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import vn.io.naherb.common.enums.MediaType;

@Service
public class MediaService {

    private final Cloudinary cloudinary;
    private final MediaAssetRepository mediaAssetRepository;

    public MediaService(Cloudinary cloudinary, MediaAssetRepository mediaAssetRepository) {
        this.cloudinary = cloudinary;
        this.mediaAssetRepository = mediaAssetRepository;
    }

    public MediaAsset uploadImage(MultipartFile file, MediaType type) throws IOException {
        // Validate file size (< 10MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds 10MB limit");
        }

        // Resolve content type: prefer the multipart header, fall back to filename extension.
        // Browsers can send null content-type for subsequent multipart parts in some environments.
        String contentType = file.getContentType();
        if (contentType == null || contentType.isBlank()) {
            contentType = resolveContentTypeFromFilename(file.getOriginalFilename());
        }

        // Validate content type
        if (contentType == null
                || (!contentType.equals("image/jpeg")
                        && !contentType.equals("image/jpg")
                        && !contentType.equals("image/png")
                        && !contentType.equals("image/webp")
                        && !contentType.equals("image/gif"))) {
            throw new IllegalArgumentException(
                    "Invalid file format: " + contentType + ". Only JPG, PNG, WEBP, GIF are allowed.");
        }

        MediaType actualType = type != null ? type : MediaType.OTHER;
        String prefix = actualType.name().toLowerCase();
        String folder = "naherb/" + prefix + "_images";

        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "public_id", prefix + "_" + UUID.randomUUID().toString(),
                "folder", folder
        ));

        String url = uploadResult.get("secure_url").toString();
        String publicId = uploadResult.get("public_id").toString();
        
        MediaAsset asset = new MediaAsset();
        asset.setUrl(url);
        asset.setStoragePath(publicId);
        asset.setType(actualType);
        asset.setFileName(file.getOriginalFilename());
        asset.setMimeType(contentType);
        asset.setFileSizeBytes(file.getSize());
        
        return mediaAssetRepository.save(asset);
    }

    public void deleteImage(UUID id) throws IOException {
        MediaAsset asset = mediaAssetRepository.findById(id).orElse(null);
        if (asset == null) {
            // Image already deleted or not found, nothing to do
            return;
        }
        
        if (asset.getStoragePath() != null) {
            cloudinary.uploader().destroy(asset.getStoragePath(), ObjectUtils.asMap("invalidate", true));
        }
        
        mediaAssetRepository.delete(asset);
    }

    /**
     * Resolves MIME type from the file's extension as a fallback when the browser
     * does not include a Content-Type header for multipart file parts.
     */
    private String resolveContentTypeFromFilename(String filename) {
        if (filename == null) return null;
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex < 0) return null;
        return switch (filename.substring(dotIndex + 1).toLowerCase()) {
            case "jpg", "jpeg" -> "image/jpeg";
            case "png" -> "image/png";
            case "webp" -> "image/webp";
            case "gif" -> "image/gif";
            default -> null;
        };
    }
}
