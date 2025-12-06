"use client";

interface VimeoIframeProps {
  embedUrl: string;
  title: string;
  className?: string;
}

export function VimeoIframe({
  embedUrl,
  title,
  className = "w-full h-full",
}: VimeoIframeProps) {
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

