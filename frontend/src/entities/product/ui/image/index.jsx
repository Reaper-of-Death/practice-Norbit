import { useState, useMemo } from 'react';
import defaultImage from '@shared/image/defaultImage.png';

const isValidImageUrl = (url) => {
    if (!url) return false;
    if (typeof url !== 'string') return false;
    
    const trimmed = url.trim();
    
    if (trimmed === '' || 
        trimmed === 'null' || 
        trimmed === 'undefined' ||
        trimmed === 'defaultImage' ||
        trimmed === 'null.jpg' ||
        trimmed === 'undefined.jpg') {
        return false;
    }
    
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    const lowerCaseUrl = trimmed.toLowerCase();
    
    return validExtensions.some(ext => lowerCaseUrl.endsWith(ext));
};

export const Image = ({ url, className, alt = 'Изображение товара' }) => {
    const [hasError, setHasError] = useState(false);
    const safeUrl = useMemo(() => {
        if (hasError) return defaultImage;
        return isValidImageUrl(url) ? url : defaultImage;
    }, [url, hasError]);

    const handleImageError = () => {
        if (!hasError) {
            console.warn(`Не удалось загрузить изображение: ${url}`);
            setHasError(true);
        }
    };

    return (
        <img 
            src={safeUrl} 
            alt={alt}
            onError={handleImageError}
            className={className}
            loading="lazy"
            key={url}
        />
    );
};