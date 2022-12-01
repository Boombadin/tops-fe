import React from 'react';
import PropTypes from 'prop-types';
import './WhyUsBanner.scss';
import { Grid, Image, Segment } from 'semantic-ui-react';

import { BANNERTYPES as WhyUsBannerBannerType } from '../../types';

const WhyUsBanner = ({ className, bannerType, href, src, metaTitle, metaDesc }) => {
  const markupClassName = `mt-why-us-banner ${className}`;

  const icon = <Image src={src} className="mt-why-us-banner__image" />;
  const caption = (
    <Segment basic className="mt-why-us-banner__caption">
      <h4>{metaTitle}</h4>
      <p>{metaDesc}</p>
    </Segment>
  );

  if (bannerType === WhyUsBannerBannerType.PLAIN) {
    return (
      <div className="mt-why-us-banner-wrap">
        <div className={markupClassName}>
          {icon}
          {caption}
        </div>
      </div>
    );
  } else if (bannerType === WhyUsBannerBannerType.LINK && href) {
    return (
      <div className="mt-why-us-banner-wrap">
        <a href={href} className="mt-why-us-banner-wrap__link">
          <div className={markupClassName}>
            {icon}
            {caption}
          </div>
        </a>
      </div>
    );
  }
};

WhyUsBanner.propTypes = {
  className: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  metaTitle: PropTypes.string,
  metaDesc: PropTypes.string,
  bannerType: PropTypes.string.isRequired,
};

WhyUsBanner.defaultProps = {
  className: '',
  href: '#',
  metaTitle: 'Title',
  metaDesc: 'Description',
  bannerType: 'plain',
};

export default WhyUsBanner;
