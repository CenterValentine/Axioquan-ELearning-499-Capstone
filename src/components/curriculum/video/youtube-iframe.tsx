"use client";

interface YouTubeIframeProps {
  embedUrl: string;
  title: string;
  className?: string;
}

export function YouTubeIframe({
  embedUrl,
  title,
  className = "w-full h-full",
}: YouTubeIframeProps) {
  return (
    <iframe
      key={embedUrl}
      className={className}
      src={embedUrl}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}

