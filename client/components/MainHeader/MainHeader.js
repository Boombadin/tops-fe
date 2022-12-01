import React from 'react';
import propTypes from 'prop-types';
import PanelHeader from './components/PanelHeader';
import HeaderLogin from './components/HeaderLogin';
import { BurgerMenu, Icon } from '../../magenta-ui';
import SpHeadBar from '../Header/SpHeadBar';
import styled from 'styled-components';
import { Sticky } from 'react-sticky';
const MainHeaderWrap = styled.div`
  position: relative;
  z-index: ${props => (props.onBoardingCart ? 1001 : 999)};
`;
const MainHeader = ({
  title,
  description,
  onBurgerClick,
  onClickBack,
  isBackLabel,
  cmsBlock,
  baseMediaUrl,
  actionOpenSearchSuggest,
  disableSearch,
  isGrabProvider,
  handleToHome,
  onBoardingCart,
  handleToCheckout
}) => {
  return (
    <Sticky>
      {({ style }) => (
        <MainHeaderWrap style={style} onBoardingCart={onBoardingCart}>
          <PanelHeader
            baseMediaUrl={baseMediaUrl}
            cmsBlock={cmsBlock}
            isGrabProvider={isGrabProvider}
          />
          <SpHeadBar
            title={title}
            description={description}
            imgLogo="/assets/images/tops-logo.svg"
            actionOpenSearchSuggest={actionOpenSearchSuggest}
            disableSearch={disableSearch}
            handleToHome={handleToHome}
            handleToCheckout={handleToCheckout}
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
          <HeaderLogin />
        </MainHeaderWrap>
      )}
    </Sticky>
  );
};

MainHeader.propTypes = {
  title: propTypes.string.isRequired,
  onBurgerClick: propTypes.func,
  cmsBlock: propTypes.array,
  isGrabProvider: propTypes.bool,
};

MainHeader.defaultProps = {
  onBurgerClick: () => {},
  cmsBlock: [],
  isGrabProvider: false,
};
export default MainHeader;
