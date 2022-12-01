import React from 'react';
import PropTypes from 'prop-types';
import { Image, Input, Button } from '../../magenta-ui';
import CartIcon from '../CartIcon';
import PromoBundleNotification, {
  PromoBundleNotificationOld,
} from '../PromoBundleNotification';
import './SpHeadBar.scss';
import withLocales from '../../hoc/withLocales';

const SpHeadBar = ({
  className,
  children,
  imgLogo,
  title,
  description,
  // logoLink,
  translate,
  actionOpenSearchSuggest,
  disableSearch,
  handleToHome,
  handleToCheckout
}) => {
  let headTxt = '';

  if (title !== '' && description !== '') {
    headTxt = (
      <div className="sp-main">
        <div className="name">{title}</div>
        <div className="info">{description}</div>
      </div>
    );
  } else if (title !== '') {
    headTxt = <p>{title}</p>;
  } else {
    headTxt = (
      <Image
        className="sp-logo"
        src={imgLogo}
        size="small"
        as="a"
        onClick={handleToHome}
      />
    );
  }
  return (
    <div id="sp-head-bar">
      <div className={className}>
        <div className="sp-head-bar--left">{children}</div>
        <div
          className={`sp-head-bar--center ${
            description !== '' ? 'description' : ''
          }`}
        >
          {headTxt}
        </div>
        <div className="sp-head-bar--right">
          <CartIcon onClick={handleToCheckout}/>
          <PromoBundleNotification />
          <PromoBundleNotificationOld />
        </div>
      </div>
      {!disableSearch && (
        <div className="sp-search">
          <Input type="text" className="sp-ui-input">
            <div className="sp-input-content">
              <div
                className="sp-search-product-bar"
                onClick={actionOpenSearchSuggest}
              >
                <input
                  placeholder={translate('search_suggestion.placeholder')}
                  readOnly
                />
              </div>
            </div>
            <Button className="sp-search-btn" type="submit">
              <Image
                className="sp-search-icon"
                src="/assets/icons/search-icon.svg"
                centered
              />
            </Button>
          </Input>
        </div>
      )}
    </div>
  );
};

SpHeadBar.propTypes = {
  children: PropTypes.node.isRequired,
  imgLogo: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default withLocales(SpHeadBar);
