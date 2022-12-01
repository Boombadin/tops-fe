import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { find } from 'lodash';
import styled from 'styled-components';
import withLocales from '../../../hoc/withLocales';
import { withRouter } from 'react-router-dom';
import { isCustomerLoggedInSelector } from '../../../selectors';
import SearchBox from '../../../features/seach/SearchBox';
import MiniCartContainer from '../../../features/minicart/MiniCartContainer';
import { Image, Button, breakpoint } from '@central-tech/core-ui';
import withCustomer from '../../../hoc/withCustomer';
import DeliveryToolBar from './DeliveryToolBar';

const LOGO = '/assets/images/tops-logo.svg';
const HeaderWrap = styled.div`
  background: #ffffff;
  height: 50px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #999999;
  @media only screen and (max-width: 991px) {
    display: none;
  }
`;
const HeaderWrapInner = styled.div`
  display: flex;
  justify-content: space-between;
  width: calc(100% - 310px);
`;
const LogoSection = styled.div`
  padding-left: 25px;
  width: 260px;
`;
const SeachSection = styled.div`
  width: 100%;
  position: relative;
  ${breakpoint('md')`
    min-width: 300px
  `}
`;
const LoginSection = styled.div`
  display: flex;
  margin-left: 50px;
`;
const ShippingAddressSection = styled.div`
  display: flex;
  align-items: center;
  margin-left: 50px;
`;

@withCustomer
class HeaderLogin extends PureComponent {
  handleClickLogin = () => {
    const { lang } = this.props;
    window.location.href = encodeURI(
      `/${lang.url}/login?ref=${window.location.pathname}${window.location.search}`,
    );
  };
  handleClickRegis = () => {
    const { lang } = this.props;
    window.location.href = encodeURI(`/${lang.url}/registration`);
  };
  render() {
    const { isCustomerLogged, translate, currentShipping, lang } = this.props;

    return (
      <HeaderWrap>
        <LogoSection>
          <a href={`/${lang.url}`} title="Tops Online">
            <Image
              src={LOGO}
              width="68px"
              alt="Tops online ท็อปส์ออนไลน์"
              lazyload={false}
              style={{ marginTop: 5 }}
            />
          </a>
        </LogoSection>
        <HeaderWrapInner>
          <SeachSection>
            <SearchBox />
          </SeachSection>
          {!isCustomerLogged ? (
            <LoginSection>
              <Button
                onClick={() => this.handleClickLogin()}
                height={30}
                width={150}
                radius="4px"
                color="danger"
                outline
                style={{ marginRight: 10 }}
              >
                {translate('sp_sidebar.login')}
              </Button>
              <Button
                onClick={() => this.handleClickRegis()}
                height={30}
                width={170}
                radius="4px"
                color="danger"
              >
                {translate('sp_sidebar.register')}
              </Button>
            </LoginSection>
          ) : (
            <ShippingAddressSection>
              <DeliveryToolBar
                currentShipping={currentShipping}
                onClick={this.props.showDeliveryToolBar}
                lang={this.props.lang.code}
              />
              <MiniCartContainer />
            </ShippingAddressSection>
          )}
        </HeaderWrapInner>
      </HeaderWrap>
    );
  }
}

const mapStateToProps = state => ({
  isCustomerLogged: isCustomerLoggedInSelector(state),
  lang: find(state.locale.languages, lang => lang.active === true),
  currentShipping: state.customer.currentShipping,
});

export default withRouter(
  withLocales(connect(mapStateToProps, null)(HeaderLogin)),
);
