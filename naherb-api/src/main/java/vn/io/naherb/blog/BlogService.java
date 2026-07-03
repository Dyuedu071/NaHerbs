package vn.io.naherb.blog;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.io.naherb.blog.dto.BlogPostRequest;
import vn.io.naherb.blog.dto.BlogPostResponse;
import vn.io.naherb.product.repository.ProductRepository;
import vn.io.naherb.product.repository.ProductImageRepository;
import vn.io.naherb.product.entity.Product;
import vn.io.naherb.exception.NotFoundException;
import vn.io.naherb.common.enums.ContentStatus;
import vn.io.naherb.config.RedisCacheConfig;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.text.Normalizer;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Transactional
public class BlogService {
    
    private final BlogPostRepository blogPostRepository;
    private final BlogCategoryRepository categoryRepository;
    private final BlogPostProductRepository postProductRepository;
    private final ProductRepository productRepository;
    private final vn.io.naherb.media.MediaAssetRepository mediaAssetRepository;
    private final ProductImageRepository productImageRepository;

    public BlogService(BlogPostRepository blogPostRepository,
                       BlogCategoryRepository categoryRepository,
                       BlogPostProductRepository postProductRepository,
                       ProductRepository productRepository,
                       vn.io.naherb.media.MediaAssetRepository mediaAssetRepository,
                       ProductImageRepository productImageRepository) {
        this.blogPostRepository = blogPostRepository;
        this.categoryRepository = categoryRepository;
        this.postProductRepository = postProductRepository;
        this.productRepository = productRepository;
        this.mediaAssetRepository = mediaAssetRepository;
        this.productImageRepository = productImageRepository;
    }

    @CacheEvict(value = {RedisCacheConfig.CACHE_BLOGS_LIST, RedisCacheConfig.CACHE_BLOG_DETAIL}, allEntries = true)
    public BlogPostResponse createPost(BlogPostRequest request) {
        if (request.getProductIds() != null && request.getProductIds().size() > 6) {
            throw new IllegalArgumentException("A blog post can have a maximum of 6 associated products.");
        }

        BlogPost post = new BlogPost();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setSummary(request.getSummary());
        post.setStatus(request.getStatus());
        post.setSeoTitle(request.getSeoTitle());
        post.setSeoDescription(request.getSeoDescription());
        post.setPrimaryKeyword(request.getPrimaryKeyword());
        post.setFeatured(request.isFeatured());
        
        // Setup Slug
        String slug = request.getSlug();
        if (slug == null || slug.trim().isEmpty()) {
            slug = generateSlug(request.getTitle());
        }
        
        // Handle duplicate slug manually or automatically if it was generated
        if (blogPostRepository.existsBySlug(slug)) {
            if (request.getSlug() != null && !request.getSlug().trim().isEmpty()) {
                // If user provided slug manually and it exists -> 409/400 (throw exception)
                throw new IllegalArgumentException("Slug already exists");
            } else {
                // Auto generate with suffix
                int suffix = 2;
                String originalSlug = slug;
                while (blogPostRepository.existsBySlug(slug)) {
                    slug = originalSlug + "-" + suffix;
                    suffix++;
                }
            }
        }
        post.setSlug(slug);

        if (request.getCategoryId() != null) {
            BlogCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
            post.setCategory(category);
        }

        if (request.getThumbnailMediaId() != null) {
            vn.io.naherb.media.MediaAsset thumbnail = mediaAssetRepository.findById(request.getThumbnailMediaId())
                .orElseThrow(() -> new IllegalArgumentException("Ảnh đại diện không tồn tại hoặc đã bị xóa. Vui lòng chọn lại ảnh khác."));
            post.setThumbnailMedia(thumbnail);
        }

        BlogPost savedPost = blogPostRepository.save(post);

        // Associate products
        if (request.getProductIds() != null && !request.getProductIds().isEmpty()) {
            List<Product> products = productRepository.findAllById(request.getProductIds());
            List<BlogPostProduct> postProducts = products.stream().map(prod -> {
                BlogPostProduct bpp = new BlogPostProduct();
                bpp.setPost(savedPost);
                bpp.setProduct(prod);
                return bpp;
            }).collect(Collectors.toList());
            postProductRepository.saveAll(postProducts);
        }

        return mapToResponse(savedPost);
    }

    @CacheEvict(value = {RedisCacheConfig.CACHE_BLOGS_LIST, RedisCacheConfig.CACHE_BLOG_DETAIL}, allEntries = true)
    public BlogPostResponse updatePost(UUID id, BlogPostRequest request) {
        if (request.getProductIds() != null && request.getProductIds().size() > 6) {
            throw new IllegalArgumentException("A blog post can have a maximum of 6 associated products.");
        }

        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Blog post not found"));

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setSummary(request.getSummary());
        post.setStatus(request.getStatus());
        post.setSeoTitle(request.getSeoTitle());
        post.setSeoDescription(request.getSeoDescription());
        post.setPrimaryKeyword(request.getPrimaryKeyword());
        post.setFeatured(request.isFeatured());

        // Setup Slug
        String slug = request.getSlug();
        if (slug == null || slug.trim().isEmpty()) {
            slug = generateSlug(request.getTitle());
        }

        // Check duplicate slug (excluding current post)
        java.util.Optional<BlogPost> existingPost = blogPostRepository.findBySlug(slug);
        if (existingPost.isPresent() && !existingPost.get().getId().equals(id)) {
            if (request.getSlug() != null && !request.getSlug().trim().isEmpty()) {
                throw new IllegalArgumentException("Slug already exists");
            } else {
                int suffix = 2;
                String originalSlug = slug;
                while (true) {
                    slug = originalSlug + "-" + suffix;
                    java.util.Optional<BlogPost> pOpt = blogPostRepository.findBySlug(slug);
                    if (!pOpt.isPresent() || pOpt.get().getId().equals(id)) {
                        break;
                    }
                    suffix++;
                }
            }
        }
        post.setSlug(slug);

        if (request.getCategoryId() != null) {
            BlogCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
            post.setCategory(category);
        } else {
            post.setCategory(null);
        }

        if (request.getThumbnailMediaId() != null) {
            vn.io.naherb.media.MediaAsset thumbnail = mediaAssetRepository.findById(request.getThumbnailMediaId())
                .orElseThrow(() -> new IllegalArgumentException("Ảnh đại diện không tồn tại hoặc đã bị xóa. Vui lòng chọn lại ảnh khác."));
            post.setThumbnailMedia(thumbnail);
        } else {
            post.setThumbnailMedia(null);
        }

        BlogPost savedPost = blogPostRepository.save(post);

        // Update associated products
        postProductRepository.deleteByPostId(id);
        postProductRepository.flush();
        if (request.getProductIds() != null && !request.getProductIds().isEmpty()) {
            List<Product> products = productRepository.findAllById(request.getProductIds());
            List<BlogPostProduct> postProducts = products.stream().map(prod -> {
                BlogPostProduct bpp = new BlogPostProduct();
                bpp.setPost(savedPost);
                bpp.setProduct(prod);
                return bpp;
            }).collect(Collectors.toList());
            postProductRepository.saveAll(postProducts);
        }

        return mapToResponse(savedPost);
    }

    public BlogPostResponse getPostById(UUID id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Blog post not found"));
        return mapToResponse(post);
    }

    @Cacheable(value = RedisCacheConfig.CACHE_BLOG_DETAIL, key = "#slug")
    public BlogPostResponse getPostBySlug(String slug) {
        BlogPost post = blogPostRepository.findBySlugAndStatus(slug, ContentStatus.PUBLISHED)
                .orElseThrow(() -> new NotFoundException("Blog post not found"));
        return mapToResponse(post);
    }

    @Cacheable(value = RedisCacheConfig.CACHE_BLOGS_LIST)
    public Page<BlogPostResponse> listPosts(Pageable pageable, String categorySlug) {
        Page<BlogPost> posts;
        if (categorySlug != null && !categorySlug.trim().isEmpty()) {
            posts = blogPostRepository.findByCategorySlugAndStatus(categorySlug, ContentStatus.PUBLISHED, pageable);
        } else {
            posts = blogPostRepository.findByStatus(ContentStatus.PUBLISHED, pageable);
        }
        return posts.map(this::mapToResponse);
    }

    public Page<BlogPostResponse> listAllPosts(Pageable pageable, String search, UUID categoryId) {
        Page<BlogPost> posts = blogPostRepository.findBySearchAndCategory(search, categoryId, pageable);
        return posts.map(this::mapToResponse);
    }

    @CacheEvict(value = {RedisCacheConfig.CACHE_BLOGS_LIST, RedisCacheConfig.CACHE_BLOG_DETAIL}, allEntries = true)
    public void deletePost(UUID id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Blog post not found"));
        postProductRepository.deleteByPostId(id);
        blogPostRepository.delete(post);
    }

    public List<vn.io.naherb.blog.dto.BlogCategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream().map(category -> {
            vn.io.naherb.blog.dto.BlogCategoryDto dto = new vn.io.naherb.blog.dto.BlogCategoryDto();
            dto.setId(category.getId());
            dto.setName(category.getName());
            dto.setSlug(category.getSlug());
            return dto;
        }).collect(Collectors.toList());
    }

    private BlogPostResponse mapToResponse(BlogPost post) {
        BlogPostResponse response = new BlogPostResponse();
        response.setId(post.getId());
        response.setTitle(post.getTitle());
        response.setSlug(post.getSlug());
        response.setSummary(post.getSummary());
        response.setContent(post.getContent());
        response.setSeoTitle(post.getSeoTitle());
        response.setSeoDescription(post.getSeoDescription());
        response.setPrimaryKeyword(post.getPrimaryKeyword());
        response.setStatus(post.getStatus());
        response.setFeatured(post.isFeatured());
        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());

        if (post.getThumbnailMedia() != null) {
            response.setThumbnailUrl(post.getThumbnailMedia().getUrl());
            response.setThumbnailMediaId(post.getThumbnailMedia().getId());
        }

        if (post.getCategory() != null) {
            vn.io.naherb.blog.dto.BlogCategoryDto catDto = new vn.io.naherb.blog.dto.BlogCategoryDto();
            catDto.setId(post.getCategory().getId());
            catDto.setName(post.getCategory().getName());
            catDto.setSlug(post.getCategory().getSlug());
            response.setCategory(catDto);
        }

        List<BlogPostProduct> postProducts = postProductRepository.findByPostId(post.getId());
        if (postProducts != null && !postProducts.isEmpty()) {
            // Collect all published product IDs
            List<UUID> productIds = postProducts.stream()
                    .map(BlogPostProduct::getProduct)
                    .filter(p -> p.getStatus() == ContentStatus.PUBLISHED)
                    .map(Product::getId)
                    .collect(Collectors.toList());

            // Batch-fetch thumbnails using JPQL to avoid lazy loading issues
            // Returns Object[] { UUID productId, String url }
            java.util.Map<UUID, String> thumbnailByProductId = new java.util.HashMap<>();
            if (!productIds.isEmpty()) {
                productImageRepository.findThumbnailUrlsByProductIdIn(productIds)
                        .forEach(row -> {
                            UUID pid = (UUID) row[0];
                            String url = (String) row[1];
                            thumbnailByProductId.putIfAbsent(pid, url);
                        });
            }

            List<BlogPostResponse.ProductSummary> productSummaries = postProducts.stream()
                    .map(BlogPostProduct::getProduct)
                    .filter(p -> p.getStatus() == ContentStatus.PUBLISHED)
                    .map(p -> {
                        BlogPostResponse.ProductSummary ps = new BlogPostResponse.ProductSummary();
                        ps.setId(p.getId());
                        ps.setName(p.getName());
                        ps.setSlug(p.getSlug());
                        ps.setSeoTitle(p.getSeoTitle());
                        ps.setStatus(p.getStatus());
                        ps.setThumbnailUrl(thumbnailByProductId.get(p.getId()));
                        return ps;
                    })
                    .collect(Collectors.toList());
            response.setProducts(productSummaries);
        }

        return response;
    }
    
    private String generateSlug(String input) {
        String nonAscii = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String slug = pattern.matcher(nonAscii).replaceAll("").toLowerCase();
        return slug.replaceAll("[^a-z0-9\\-]+", "-").replaceAll("^-|-$", "");
    }
}

