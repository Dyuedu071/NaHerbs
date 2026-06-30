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

    public MediaAsset uploadImage(MultipartFile file) throws IOException {
        // Validate file size (< 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds 5MB limit");
        }

        // Validate content type
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png") && !contentType.equals("image/webp"))) {
            throw new IllegalArgumentException("Invalid file format. Only JPG, PNG, WEBP are allowed.");
        }

        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "public_id", "blog_" + UUID.randomUUID().toString(),
                "folder", "naherb/blog_images"
        ));

        String url = uploadResult.get("secure_url").toString();
        
        MediaAsset asset = new MediaAsset();
        asset.setUrl(url);
        asset.setType(MediaType.BLOG);
        asset.setFileName(file.getOriginalFilename());
        asset.setMimeType(contentType);
        asset.setFileSizeBytes(file.getSize());
        
        return mediaAssetRepository.save(asset);
    }
}
