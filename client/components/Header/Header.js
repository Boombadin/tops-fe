import React from 'react';
import propTypes from 'prop-types';
import { BurgerMenu, Icon } from '../../magenta-ui';
import SpHeadBar from './SpHeadBar';
import PcHeadBar from './PcHeadBar';
import './Header.scss';
import { withTranslate } from '../../utils/translate';
import UpperHeader from '../../components/UpperHeader';
import RoyalHeader from '../../components/RoyalHeader';

const Header = props => {
  const {
    title,
    description,
    onBurgerClick,
    onClickBack,
    isBackLabel,
    className,
    lang,
    cmsBlock,
    baseMediaUrl,
    isCustomer,
    translate,
    actionOpenSearchSuggest,
    disableSearch,
    isGrabProvider,
    handleToHome,
    handleToCheckout
  } = props;

  return (
    <header className={className}>
      <RoyalHeader
        className="promo-top-banner"
        baseMediaUrl={baseMediaUrl}
        cmsBlock={cmsBlock}
        isGrabProvider={isGrabProvider}
      />

      <UpperHeader
        className="promo-top-banner"
        baseMediaUrl={baseMediaUrl}
        cmsBlock={cmsBlock}
        isCustomer={isCustomer}
        isGrabProvider={isGrabProvider}
      />

      <SpHeadBar
        title={title}
        description={description}
        imgLogo="/assets/images/tops-logo.svg"
        logoLink={`/${lang.url}/`}
        translate={translate}
        actionOpenSearchSuggest={actionOpenSearchSuggest}
        disableSearch={disableSearch}
        handleToHome={handleToHome}
      >
        {isBackLabel ? (
          <div className="back-icon" onClick={onClickBack}>
            <Icon className="chevron left" />
            {isBackLabel}
          </div>
        ) : (
          <BurgerMenu className="burger-icon" onClick={onBurgerClick} />
        )}
      </SpHeadBar>
      <PcHeadBar
        imgLogo="/assets/images/tops-logo.svg"
        handleToHome={handleToHome}
      />
    </header>
  );
};

Header.propTypes = {
  className: propTypes.string,
  title: propTypes.string.isRequired,
  onBurgerClick: propTypes.func,
  lang: propTypes.object.isRequired,
  cmsBlock: propTypes.array,
  isCustomer: propTypes.bool,
  isGrabProvider: propTypes.bool,
};

Header.defaultProps = {
  className: '',
  onBurgerClick: () => {},
  cmsBlock: [],
  isCustomer: false,
  isGrabProvider: false,
};

export default withTranslate(Header);
