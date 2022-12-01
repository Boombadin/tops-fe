import React from 'react';
import PropTypes from 'prop-types';

const FooterItem = ({ url, column, type, text = '', children, target }) => {
  if (type === 'link') {
    return (
      <p className={`footer-item link ${column === 'two' ? 'column' : ''}`}>
        <a href={url} target={target}>
          {text}
        </a>
      </p>
    );
  } else if (type === 'text') {
    return <p className="footer-item">{text}</p>;
  }
  return <div className="footer-item">{children}</div>;
};

FooterItem.propTypes = {
  column: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.string,
  target: PropTypes.string,
};
FooterItem.defaultProps = {
  column: '',
  url: '',
  type: '',
  target: '',
};
export default FooterItem;
