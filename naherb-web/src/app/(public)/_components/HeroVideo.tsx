"use client";

import { useEffect, useRef } from "react";

type HeroVideoProps = {
  className?: string;
};

export default function HeroVideo({ className }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playSafe = () => {
      video.play().catch(() => {
        /* autoplay may be blocked; poster still shows */
      });
    };

    if (!("IntersectionObserver" in window)) {
      playSafe();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          if (video.preload !== "metadata") {
            video.preload = "metadata";
          }
          if (video.readyState === 0) {
            video.load();
          }
          playSafe();
        } else {
          video.pause();
        }
      },
      { rootMargin: "100px", threshold: 0.15 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      className={className}
      poster="/videos/hero-poster.webp"
      muted
      loop
      playsInline
      preload="none"
      aria-label="Video mở đầu giới thiệu không gian thảo dược NaHerbs"
    >
      <source src="/videos/hero-intro.mp4" type="video/mp4" />
    </video>
  );
}
