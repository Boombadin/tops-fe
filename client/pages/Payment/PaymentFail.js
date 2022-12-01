import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { getTranslate } from 'react-localize-redux';
import Cookie from 'js-cookie';
import { get, first, isEmpty } from 'lodash';
import {
  breakpoint,
  HideMobile,
  HideDesktop,
  Icon,
  Space,
} from '@central-tech/core-ui';
import {
  getCustomerSelector,
  isCustomerLoggedInSelector,
  langSelector,
} from '../../selectors';
import MetaTags from '../../components/MetaTags';
import CheckoutHeader from '../../features/checkout/components/CheckoutHeader';
import { fullpathUrl } from '../../utils/url';
import styled from 'styled-components';
import { ReorderButton } from '../OrderHistory/ReorderButton';
import { fetchOrder, fetchOrderByIncrementId } from '../../reducers/order';
import { TextGuide } from '../../components/Typography';

const Container = styled.div`
  padding: 0 40px 118px 40px;
  width: calc(100% - 100px);
  background-color: white;
  margin: 30px 50px 30px 50px;

  ${prop =>
    prop.padding &&
    `
    padding: ${prop.padding}
  `}

  ${breakpoint('xs', 'md')`
    padding: 25px 0 0 0;
    margin: 25px 0 0 0;
    width: 100%;
    display: block;
  `}
`;

const Content = styled.div`
  display: flex;
  justify-content: center;

  ${prop =>
    prop.padding &&
    `
    padding: ${prop.padding}
  `}

  ${prop =>
    prop.borderTop &&
    `
    border-top: ${prop.borderTop}
  `}

  ${prop =>
    prop.justifyContent &&
    `
    justify-content: ${prop.justifyContent}
  `}

  ${breakpoint('xs', 'md')`
    display: flex;
    flex-direction: column;
    justify-content: center;
  `}
`;

const Footer = styled.div`
  padding-top: 20px;
  border-top: solid 1px #ccccccc;
  width: 600px;
  margin: 0 auto;

  ${breakpoint('xs', 'md')`
    width: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 20px;
  `}
`;

const IconImg = styled.div`
  display: flex;
  justify-content: center;
  width: 200px;
  height: 200px;

  ${breakpoint('xs', 'md')`
    margin: 0 auto;
    width: 150px;
    height: 150px;
  `}
`;

const Message = styled.div`
  width: 400px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 30px;

  ${breakpoint('xs', 'md')`
    text-align: center;
    width: auto;
    height: auto;
    padding: 0px 4px 0px 4px;
    align-items: center;
  `};
`;

const ButtonReOrder = styled.div`
  width: 190px;
  height: 40px;
  border-radius: 4px;
  border: solid 1px #e10f16;
  background-color: #ec1d24;
  margin: 0 5px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  ${breakpoint('xs', 'md')`
    width: 100%;
    margin: 5px 0 5px 0;
  `};
`;

const ButtonContactUs = styled.div`
  width: 190px;
  height: 40px;
  border-radius: 4px;
  border: solid 1px #808080;
  background-color: #ffffff;
  margin: 0 5px;
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 13px;
  ${breakpoint('xs', 'md')`
    width: 100%;
    margin: 5px 0 5px 0;
  `}
`;

class CheckoutDetail extends Component {
  static defaultProps = {
    title: '',
    customer: [],
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    customer: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.string,
  };

  componentDidMount() {
    const { isCustomerLogged } = this.props;
    if (isCustomerLogged) {
      this.fetchOrder();
    }
  }

  fetchOrder = async () => {
    const incrementId = this.props.match.params.slug;
    if (incrementId) {
      await this.props.fetchOrderByIncrementId(incrementId);
    }
  };

  renderErrorMessage() {
    return (
      <div className="header-error">
        <h2 className="err_msg">
          {this.props.translate('payment_fail.sorry')} <br />
          {this.props.translate('payment_fail.system_error')}
        </h2>
        <p>{this.props.translate('payment_fail.pay-again')}!</p>
      </div>
    );
  }

  render() {
    const client = Cookie.get('client');
    const { translate, lang, order } = this.props;
    const languages = lang === 'th_TH' ? 'th' : 'en';
    const hasOrderId = get(first(order), 'entity_id', 0) > 0;
    return (
      <div className="checkout-content">
        <MetaTags
          canonicalUrl={fullpathUrl(this.props.location)}
          title={translate('meta_tags.checkout_completed.title')}
          keywords={translate('meta_tags.checkout_completed.keywords')}
          description={translate('meta_tags.checkout_completed.description')}
        />
        {/* <Header title={title} disableSearch handleToHome={() => this.props.history.push('/')} /> */}
        <CheckoutHeader
          step={3}
          isMobile
          isBackButton={false}
          backText={translate('payment_fail.sorry_title')}
          textPaymentStatus={translate(
            'multi_checkout.progress_bar.step_3_fail',
          )}
        />

        <HideMobile>
          <Container>
            <Content padding="50px 0 0 0">
              <IconImg>
                <img
                  width="180"
                  height="180"
                  src="/assets/images/payment-failed@3x.png"
                />
              </IconImg>
              <Message>
                <TextGuide type="topic" color="#2a2a2a" bold>
                  {translate('payment_fail.sorry_title')}
                </TextGuide>
                <Space lg="5px" />
                <TextGuide type="body" color="#2a2a2a">
                  {hasOrderId ? (
                    <React.Fragment>
                      <Space xs="4px" />
                      {translate('payment_fail.system_error')}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Space xs="4px" />
                      {translate('payment_fail.empty_id_system_error')}
                    </React.Fragment>
                  )}
                </TextGuide>
              </Message>
            </Content>
            <Footer>
              <Content
                padding="20px 0 0 0"
                justifyContent="center"
                borderTop="1px dashed #e9e9e9"
              >
                <a className="link" href={`/${languages}/contact`}>
                  <ButtonContactUs>
                    {translate('payment_fail.contact_us')}
                  </ButtonContactUs>
                </a>
                {hasOrderId ? (
                  <a
                    className="link"
                    href={`/${languages}/order-detail/${get(
                      first(order),
                      'entity_id',
                    )}`}
                  >
                    <ButtonReOrder>
                      {translate('payment_fail.re_order')}
                      <Icon
                        src="/assets/images/round-arrow-forward-24-px.svg"
                        style={{ marginLeft: 5 }}
                      />
                    </ButtonReOrder>
                  </a>
                ) : (
                  <a className="link" href={`/${languages}/order-history`}>
                    <ButtonReOrder>
                      {translate('payment_fail.re_order')}
                      <Icon
                        src="/assets/images/round-arrow-forward-24-px.svg"
                        style={{ marginLeft: 5 }}
                      />
                    </ButtonReOrder>
                  </a>
                )}
              </Content>
            </Footer>
          </Container>
        </HideMobile>

        <HideDesktop>
          <Container>
            <IconImg>
              <img
                width="120"
                height="120"
                src="/assets/images/payment-failed@3x.png"
              />
            </IconImg>
            <Message>
              <TextGuide type="topic" color="#2a2a2a" bold>
                {translate('payment_fail.sorry_title')}
              </TextGuide>
              <Space xs="4px" />
              <TextGuide type="body" color="#2a2a2a" align="center">
                {hasOrderId ? (
                  <React.Fragment>
                    <Space xs="4px" />
                    {translate('payment_fail.system_error')}
                  </React.Fragment>
                ) : (
                  <TextGuide type="body" color="#2a2a2a" align="center">
                    {translate('payment_fail.empty_id_system_error')}
                  </TextGuide>
                )}
              </TextGuide>
            </Message>
            <Footer>
              <Content
                padding="20px 0 0 0"
                justifyContent="center"
                borderTop="1px dashed #e9e9e9"
              >
                {hasOrderId ? (
                  <a
                    className="link"
                    href={`/${languages}/order-detail/${get(
                      first(order),
                      'entity_id',
                    )}`}
                  >
                    <ButtonReOrder>
                      {translate('payment_fail.re_order')}
                      <Icon
                        src="/assets/images/round-arrow-forward-24-px.svg"
                        style={{ marginLeft: 5 }}
                      />
                    </ButtonReOrder>
                  </a>
                ) : (
                  <a className="link" href={`/${languages}/order-history`}>
                    <ButtonReOrder>
                      {translate('payment_fail.re_order')}
                      <Icon
                        src="/assets/images/round-arrow-forward-24-px.svg"
                        style={{ marginLeft: 5 }}
                      />
                    </ButtonReOrder>
                  </a>
                )}
                <a className="link" href={`/${languages}/contact`}>
                  <ButtonContactUs>
                    {translate('payment_fail.contact_us')}
                  </ButtonContactUs>
                </a>
              </Content>
            </Footer>
          </Container>
        </HideDesktop>

        {/* <Header title={title} disableSearch handleToHome={() => this.props.history.push('/')} />
        <div className="checkout-wrap">
          <Grid>
            <Grid.Column computer={12} mobile={16} className="steps-checkout-wrap">
              <CheckoutProgressBar
                steps={mockCheckoutSteps}
                url="/help"
              />
            </Grid.Column>
            <Grid.Column computer={12} mobile={16} className="shipping-wrap">
              <div className="payment-complete-wrap">
                <div className="payment-complete__image">
                  <Image className="payment-fail" src="/assets/images/payment-fail.jpg" size="medium"/>
                </div>
                <div className="payment-complete__message">
                  {this.renderErrorMessage()}
                </div>
                <div className="payment-fail__button">
                  <Button as="a" href="/" icon labelPosition='left'>
                    <Icon name='chevron left' />
                    {translate('payment_fail.back_home')}
                  </Button>
                </div>
              </div>
            </Grid.Column>
          </Grid>
        </div> */}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  lang: langSelector(state),
  customer: getCustomerSelector(state),
  translate: getTranslate(state.locale),
  order: state.order.item,
  isCustomerLogged: isCustomerLoggedInSelector(state),
});

const mapDispatchToProps = dispatch => ({
  fetchOrder: id => dispatch(fetchOrder(id)),
  fetchOrderByIncrementId: id => dispatch(fetchOrderByIncrementId(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutDetail);
