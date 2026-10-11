import React, { useState } from 'react';
import { Utensils } from 'lucide-react';

interface ResilientImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackTitle?: string;
  className?: string;
  containerClassName?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  fallbackTitle,
  className = 'w-full h-full object-cover',
  containerClassName = 'relative overflow-hidden bg-[#1E1B17]',
  loading = 'lazy',
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`${containerClassName} flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#26221D] via-[#1E1B17] to-[#141210] border border-[#332E26]`}
        role="img"
        aria-label={alt}
      >
        <Utensils className="w-8 h-8 text-[#C9A24B] mb-2 opacity-80" aria-hidden="true" />
        <span className="font-display text-sm text-[#F4ECDA] font-medium">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={className}
        {...rest}
      />
    </div>
  );
};
