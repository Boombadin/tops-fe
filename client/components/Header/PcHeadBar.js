import React from 'react';
import PropTypes from 'prop-types';
import { Image } from '../../magenta-ui';
import PcSearch from './PcSearch';
import PcHeadLogin from './PcHeadLogin';
import { withTranslate } from '../../utils/translate';
import MiniCartContainer from '../../features/minicart/MiniCartContainer';

const options = [
  { key: 'all', text: 'All', value: 'all' },
  { key: 'articles', text: 'Articles', value: 'articles' },
  { key: 'products', text: 'Products', value: 'products' },
];

const PcHeadBar = ({ imgLogo, handleToHome }) => (
  <div id="pc-head-bar" className="header-container header-bg">
    <div className="container pc-header-container">
      <div className="header-logo">
        <Image
          className="pc-logo"
          src={imgLogo}
          size="small"
          as="a"
          onClick={handleToHome}
          alt="Tops online ท็อปส์ออนไลน์"
        />
      </div>
      <div className="header-content">
        <div className="pc-search clearfix">
          <PcSearch options={options} />
        </div>
      </div>
      <div className="header-login">
        <PcHeadLogin />
      </div>
      <div className="header-mini-cart">
        <MiniCartContainer />
      </div>
    </div>
  </div>
);

PcHeadBar.propTypes = {
  imgLogo: PropTypes.string.isRequired,
};

export default withTranslate(PcHeadBar);
