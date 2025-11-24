import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

interface SEOProps {
    title: string;
    description: string;
    path?: string; // Optional specific path, otherwise uses current location
}

const SEO: React.FC<SEOProps> = ({ title, description, path }) => {
    const { i18n } = useTranslation();
    const location = useLocation();

    const currentLang = i18n.language.split('-')[0];
    const baseUrl = 'https://lightimg.app';
    const currentPath = path || location.pathname.replace(/^\/[a-z]{2}/, '') || '/'; // Strip lang prefix

    // Ensure path starts with /
    const normalizedPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <html lang={currentLang} />
            <title>{title} | LightIMG</title>
            <meta name="description" content={description} />

            {/* Canonical URL */}
            <link rel="canonical" href={`${baseUrl}/${currentLang}${normalizedPath === '/' ? '' : normalizedPath}`} />

            {/* Hreflang Tags for International SEO */}
            <link rel="alternate" hreflang="en" href={`${baseUrl}/en${normalizedPath === '/' ? '' : normalizedPath}`} />
            <link rel="alternate" hreflang="es" href={`${baseUrl}/es${normalizedPath === '/' ? '' : normalizedPath}`} />
            <link rel="alternate" hreflang="pt" href={`${baseUrl}/pt${normalizedPath === '/' ? '' : normalizedPath}`} />
            <link rel="alternate" hreflang="x-default" href={`${baseUrl}/en${normalizedPath === '/' ? '' : normalizedPath}`} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${baseUrl}/${currentLang}${normalizedPath === '/' ? '' : normalizedPath}`} />
            <meta property="og:title" content={`${title} | LightIMG`} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={`${baseUrl}/logo.png`} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={`${baseUrl}/${currentLang}${normalizedPath === '/' ? '' : normalizedPath}`} />
            <meta property="twitter:title" content={`${title} | LightIMG`} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={`${baseUrl}/logo.png`} />
        </Helmet>
    );
};

export default SEO;
