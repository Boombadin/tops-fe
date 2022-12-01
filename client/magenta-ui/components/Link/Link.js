import React from 'react';
import PropTypes from 'prop-types';
import './Link.scss';

const Link = ({
  url,
  target,
  className,
  title,
}) => {
  return (
    <a
      href={url}
      target={target}
      className={`mt-link ${className}`}>
      {title}
    </a>
  );
}

Link.propTypes = {
  url: PropTypes.string,
  target: PropTypes.oneOf(['_blank', '_self', '_parent', '_top']),
  className: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

Link.defaultProps = {
  url: '#',
  target: '_blank',
  className: '',
  title: 'Link',
};

export default Link;