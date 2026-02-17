import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO component for managing meta tags on each page
 * Handles: title, description, OG tags, Twitter cards, canonical URLs
 */
export default function SEO({
  title = 'Fiber Agent - AI Shopping Agent for Commerce',
  description = 'Fiber Agent enables AI agents to shop across 50,000+ merchants, earning tokens and Fiber Points on the Monad network.',
  ogImage = 'https://fiberagent.shop/og-image.png',
  ogUrl = 'https://fiberagent.shop',
  ogType = 'website',
  twitterHandle = '@fiber_shop'
}) {
  const fullTitle = title.includes('Fiber Agent') ? title : `${title} | Fiber Agent`;
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={ogUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Fiber Agent" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={ogUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      {twitterHandle && <meta property="twitter:creator" content={twitterHandle} />}
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#000000" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    </Helmet>
  );
}
