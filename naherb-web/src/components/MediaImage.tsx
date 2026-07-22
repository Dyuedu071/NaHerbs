import Image, { type ImageProps } from "next/image";
import { isCloudinaryUrl, resolveImageUrl } from "@/lib/image-url";

type MediaImageProps = Omit<ImageProps, "src"> & {
  src: string;
  /** Target width for Cloudinary CDN transform (default 800). */
  cloudinaryWidth?: number;
};

/**
 * next/image wrapper: Cloudinary URLs are loaded directly from CDN
 * (unoptimized) because transformed URLs contain commas that make
 * `/_next/image` return 400. Local / other remotes still use the optimizer.
 */
export default function MediaImage({
  src,
  cloudinaryWidth = 800,
  unoptimized,
  alt,
  ...props
}: MediaImageProps) {
  const resolved = resolveImageUrl(src, { width: cloudinaryWidth }) || src;
  const fromCloudinary = isCloudinaryUrl(resolved);

  return (
    <Image
      {...props}
      alt={alt}
      src={resolved}
      unoptimized={unoptimized ?? fromCloudinary}
    />
  );
}
