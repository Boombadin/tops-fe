import React from 'react';
import Helmet from 'react-helmet';

const MetaTags = ({
  title,
  description,
  keywords,
  canonicalUrl,
  imageUrl,
  ogType,
  ogTitle,
  ogDescription,
  twCard,
}) => {
  const metaArray = [];
  const linkArray = [];

  if (description && description.length > 0) {
    metaArray.push({
      name: 'description',
      content: description,
    });
  }

  if (keywords && keywords.length > 0) {
    metaArray.push({
      name: 'keywords',
      content: keywords,
    });
  }

  if (canonicalUrl && canonicalUrl.length > 0) {
    linkArray.push({
      rel: 'canonical',
      href: canonicalUrl,
    });

    metaArray.push({
      property: 'og:url',
      content: canonicalUrl,
    });
  }

  if (imageUrl && imageUrl.length > 0) {
    metaArray.push({
      property: 'og:image',
      content: imageUrl,
    });

    linkArray.push({
      rel: 'image_src',
      href: imageUrl,
    });
  }

  if (ogType && ogType.length > 0) {
    metaArray.push({
      property: 'og:type',
      content: ogType,
    });
  }

  if (ogTitle && ogTitle.length > 0) {
    metaArray.push({
      property: 'og:title',
      content: ogTitle,
    });
  }

  if (ogDescription && ogDescription.length > 0) {
    metaArray.push({
      property: 'og:description',
      content: ogDescription,
    });
  }

  if (twCard && twCard.length > 0) {
    metaArray.push({
      name: 'twitter:card',
      content: twCard,
    });
  }

  return <Helmet title={title} meta={metaArray} link={linkArray} />;
};

export default MetaTags;
