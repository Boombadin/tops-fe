import React, { Fragment } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { find, get } from 'lodash';
import {
  isCustomerLoggedInSelector,
  getOneCardMembershipIdFromCustomer,
  getThe1MobileFromCustomer,
} from '../../../selectors';
import withLocales from '../../../hoc/withLocales';
import LangSwitch from '../../LangSwitch/LangSwitch';
import UpperHeader from '../../../components/UpperHeader';
import {
  Text,
  Icon,
  Tooltip,
  Padding,
  Row,
  Col,
  TextEllipsis,
} from '@central-tech/core-ui';
import { TextGuide } from '../../../components/Typography';
import withCustomer from '../../../hoc/withCustomer';
import { unsetCookie } from '../../../utils/cookie';

const MemberMenuSection = styled.div`
  > .tooltip-member-menu ${Tooltip.Section} {
    z-index: 1002;
  }
`;

const TopHeaderBlock = styled.div`
  background-image: linear-gradient(92deg, #ed213a, #93291e 100%, #93291e);
  height: 40px;
  width: 100%;
  display: flex;
`;
const PromotionText = styled.div`
  font-family: sans-serif;
  margin: 0 auto;
  @media only screen and (max-width: 991px) {
    width: 100%;
  }
`;
const TopHeaderBlockRight = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  position: absolute;
  right: 0;
  @media only screen and (max-width: 991px) {
    display: none;
  }
`;
const LangSection = styled.div`
  cursor: pointer;
  display: flex;
  line-height: normal;
  align-items: center;
`;

const LinkSection = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
`;
const LinkHelp = styled(Text)`
  display: flex;
  align-items: center;
`;

const WhiteSpace = styled.span`
  margin: 0 10px;
  width: 1px;
  height: 13px;
  background: #fff;
`;

const Head = styled.div`
  box-shadow: 0 1px 0 0 #ebebeb;
  background-color: #f7f7f7;
  height: 50px;
`;

const Cursor = styled.div`
  cursor: pointer;
`;

const Bagde = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 27px;
  height: 22px;
  border-radius: 20px;
  background-color: #ec1d24;
`;

@withCustomer
class PanelHeader extends React.PureComponent {
  handleClickLogin = () => {
    const { lang } = this.props;
    window.location.href = encodeURI(
      `/${lang.url}/login?ref=${window.location.pathname}${window.location.search}`,
    );
  };

  handleClickLogout = () => {
    const { lang } = this.props;
    unsetCookie('user_token');
    window.location.assign(`/${lang.url}`);
  };

  render() {
    const {
      cmsBlock,
      baseMediaUrl,
      isGrabProvider,
      translate,
      lang,
      isCustomerLogged,
      customer,
    } = this.props;

    const t1cNo =
      getOneCardMembershipIdFromCustomer(customer) ||
      getThe1MobileFromCustomer(customer);

    return (
      <TopHeaderBlock>
        <PromotionText>
          <UpperHeader
            className="promo-top-banner"
            baseMediaUrl={baseMediaUrl}
            cmsBlock={cmsBlock}
            isCustomer={isCustomerLogged}
            isGrabProvider={isGrabProvider}
          />
        </PromotionText>
        <TopHeaderBlockRight>
          <LinkSection>
            <LinkHelp as="a" href={`/${lang.url}/help`}>
              <TextGuide type="caption" color="#fff" size={14}>
                <Icon
                  src="/assets/icons/ic-helps.svg"
                  style={{ marginRight: 5 }}
                />
                {translate('right_menu.help')}
              </TextGuide>
            </LinkHelp>
          </LinkSection>
          {isCustomerLogged && (
            <Fragment>
              <WhiteSpace />
              <MemberMenuSection>
                <Tooltip
                  className="tooltip-member-menu"
                  arrowColor="#f7f7f7"
                  align="right"
                  arrowBorderWidth={12}
                  renderTooltip={
                    <Padding xs="0px" style={{ width: 260 }}>
                      <Row>
                        <Col>
                          <Head>
                            <Row>
                              <Col padding="3px 20px" xs={12}>
                                <TextGuide type="topic" bold>
                                  <TextEllipsis line={1} height={20}>
                                    {`${get(customer, 'firstname')} ${get(
                                      customer,
                                      'lastname',
                                    )}`}
                                  </TextEllipsis>
                                </TextGuide>
                              </Col>
                              <Col padding="3px 20px" xs={12}>
                                <TextGuide type="caption-2" color="#666666">
                                  {`${translate('profile.menu.t1c_member')} ${
                                    t1cNo ? t1cNo : '-'
                                  }`}
                                </TextGuide>
                              </Col>
                            </Row>
                          </Head>
                        </Col>
                      </Row>
                      <Row>
                        <Col padding="9px 20px">
                          <Text as="a" href={`/${lang.url}/personal-info`}>
                            <TextGuide type="body" bold>
                              {translate('profile.menu.personal_info')}
                            </TextGuide>
                          </Text>
                        </Col>
                      </Row>
                      <Row>
                        <Col padding="9px 20px" xs="auto">
                          <Text as="a" href={`/${lang.url}/order-history`}>
                            <TextGuide type="body" bold>
                              {translate('profile.menu.order_history')}
                            </TextGuide>
                          </Text>
                        </Col>
                        {/* <Col padding="5px 20px 5px 0px" xs="50px">
                        <Bagde>
                          <TextGuide type="caption-1" bold color="#ffffff">1</TextGuide>
                        </Bagde>
                      </Col> */}
                      </Row>
                      <Row>
                        <Col
                          padding="9px 20px"
                          onClick={this.handleClickLogout}
                        >
                          <Cursor>
                            <TextGuide type="body" bold>
                              {translate('profile.menu.sign_out')}
                            </TextGuide>
                          </Cursor>
                        </Col>
                      </Row>
                    </Padding>
                  }
                  style={{
                    display: 'inline-block',
                  }}
                >
                  <Cursor>
                    <TextGuide type="caption" color="#ffffff" size={14}>
                      <Icon
                        src="/assets/icons/people.svg"
                        width={14}
                        style={{ marginRight: 5 }}
                      />
                      {translate('delivery_tool_bar.my_account')}
                    </TextGuide>
                  </Cursor>
                </Tooltip>
              </MemberMenuSection>
            </Fragment>
          )}
          <WhiteSpace />
          <LangSection>
            <LangSwitch lang={lang} />
          </LangSection>
        </TopHeaderBlockRight>
      </TopHeaderBlock>
    );
  }
}
const mapStateToProps = state => ({
  isCustomerLogged: isCustomerLoggedInSelector(state),
  lang: find(state.locale.languages, lang => lang.active === true),
});

export default withRouter(withLocales(connect(mapStateToProps)(PanelHeader)));
