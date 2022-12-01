import React from 'react';
import PropTypes from 'prop-types';
import './PromoBanner.scss';
import { Image, Segment } from 'semantic-ui-react';
import { gtmDataAttr } from '../../../utils/gtmDataAttr';

const PromoBanner = ({
  className,
  src,
  href,
  metaTitle,
  metaDesc,
  bannerLocation,
  position,
}) => {
  const markupClassName = `mt-promo-banner ${className}`;
  const renderedImage = (
    <a href={href} className="mt-promo-banner__image">
      <img
        src={src}
        alt={`Tops online ${metaTitle}`}
        {...gtmDataAttr(bannerLocation, position, src, href)}
      />
    </a>
  );
  const caption =
    metaTitle && metaDesc ? (
      <Segment basic className="mt-promo-banner__caption">
        <a href={href}>
          <h3>{metaTitle}</h3>
        </a>
        <a href={href}>
          <h4>{metaDesc}</h4>
        </a>
      </Segment>
    ) : null;
  return (
    <div className="mt-promo-banner-wrap">
      <div className={markupClassName} key={`image-${src}`}>
        {renderedImage}
        {caption}
      </div>
    </div>
  );
};

PromoBanner.propTypes = {
  className: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  metaTitle: PropTypes.string,
  metaDesc: PropTypes.string,
};

PromoBanner.defaultProps = {
  className: '',
  src: '#',
  href: '#',
};

export default PromoBanner;
