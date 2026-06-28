package vn.io.naherb.media;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.io.naherb.common.entity.BaseEntity;
import vn.io.naherb.common.enums.MediaType;

@Entity
@Table(name = "media_assets")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MediaAsset extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MediaType type = MediaType.OTHER;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String url;

    @Column(name = "storage_path", columnDefinition = "TEXT")
    private String storagePath;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "mime_type", length = 100)
    private String mimeType;

    @Column(name = "file_size_bytes")
    private Long fileSizeBytes;

    @Column(name = "alt_text")
    private String altText;
}
