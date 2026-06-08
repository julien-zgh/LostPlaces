import React, { useState } from "react";

type Props = {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  loading?: "lazy" | "eager";
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  placeholder?: string; // blurred base64 or fallback image
};

const DynamicImage = ({
  src,
  alt = "",
  width,
  height,
  className = "",
  style = {},
  loading = "lazy",
  objectFit = "cover",
  placeholder,
}: Props) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
      className={`relative ${className}`}
    >
      {/* Placeholder / Blur */}
      {placeholder && !isLoaded && (
        <img
          src={placeholder}
          alt="placeholder"
          className="absolute top-0 left-0 w-full h-full object-cover blur-md scale-105"
        />
      )}

      {/* Main Image */}
      <img
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-${objectFit} transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default DynamicImage;
