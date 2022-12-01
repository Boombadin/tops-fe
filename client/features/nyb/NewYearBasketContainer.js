import React, { PureComponent } from 'react';
import { func, object, shape, bool, string } from 'prop-types';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import styled from 'styled-components';
import { Tabs } from './components';
import { Form } from '../../magenta-ui';
import { Separator } from '../../components/Separator';
import { FormControl } from '../../components/Form';
import { makeGetTranslate, makeGetLanguage } from '../../utils/translate';
import { calculateNyb, makeGetNyb } from './redux';
import NybCalculateForm from './form/NybCalculateForm';
import { NYB as Model } from './models/NYB';
import {
  ROUTE_NEW_YEAR_BUSKET,
  ROUTE_NEW_YEAR_BUSKET_TAB_2,
  ROUTE_NEW_YEAR_BUSKET_TAB_3,
} from '../../config/promotions';
import { CMSContainer } from '../cms';
import { formatNumber, generateCalculateNyb } from './redux/nybUtils';

const WhitePage = styled.div`
  @media (min-width: 991px) {
    background-color: white;
    padding: 30px;
  }
`;
const TextHelper = styled.div`
  color: #808080;
  font-size: 13px;
`;
const MAX_WIDTH = '250px';
const styles = {
  inputReadOnly: {
    background: '#f0f0f0',
  },
};

class NewYearBasketContainer extends PureComponent {
  static propTypes = {
    translate: func.isRequired,
    lang: object.isRequired,
    values: object,
    nyb: shape({
      isFetching: bool,
      isReload: bool,
      error: string,
      data: object,
    }).isRequired,
    tabActive: string,
    location: object.isRequired,
  };

  static defaultProps = {
    values: {},
    tabActive: ROUTE_NEW_YEAR_BUSKET.slice(1),
  };

  state = {};

  handleSetFields = newState => this.setState(newState);
  handleSubmit = (values, dispatch) => {
    const newValues = generateCalculateNyb(values, this.state);
    dispatch(calculateNyb(newValues));
  };

  render() {
    const { translate, values, nyb, tabActive, lang, location } = this.props;
    const data = Model.get(nyb.data);
    const currentValues = {
      ...values,
      ...this.state,
      bank_issued:
        this.state.payment_methods === 'credit_card' ? get(values, 'bank_issued', '') : '',
    };
    return (
      <WhitePage>
        <Tabs activeTab={tabActive}>
          <div label={translate('nyb.tabs.tab_1')} value={ROUTE_NEW_YEAR_BUSKET.slice(1)}>
            <center>
              <h4>{translate('nyb.header')}</h4>
            </center>
            <br />
            <NybCalculateForm
              onSubmit={this.handleSubmit}
              onSetFields={this.handleSetFields}
              currentValues={currentValues}
              loading={nyb.isFetching}
              errorMessage={nyb.error}
            />
            <Separator />
            <center>
              <h4>{translate('nyb.header2')}</h4>
            </center>
            <br />
            <Form>
              <Form.Field inline>
                <FormControl
                  success={Boolean(data.giftVoucher)}
                  label={translate('nyb.result.label_1')}
                  width={MAX_WIDTH}
                >
                  <input
                    type="text"
                    value={formatNumber(data.giftVoucher)}
                    readOnly
                    style={styles.inputReadOnly}
                  />
                </FormControl>
              </Form.Field>
              <Form.Field inline>
                <FormControl
                  success={Boolean(data.discount)}
                  label={translate('nyb.result.label_2')}
                  width={MAX_WIDTH}
                >
                  <input
                    type="text"
                    value={formatNumber(data.discount)}
                    readOnly
                    style={styles.inputReadOnly}
                  />
                </FormControl>
              </Form.Field>
              <Form.Field inline>
                <FormControl
                  success={Boolean(data.total)}
                  label={translate('nyb.result.label_3')}
                  width={MAX_WIDTH}
                >
                  <input
                    type="text"
                    value={formatNumber(data.total)}
                    readOnly
                    style={styles.inputReadOnly}
                  />
                </FormControl>
              </Form.Field>
              <Form.Field>
                <FormControl>
                  <TextHelper>{translate('nyb.helper_1')}</TextHelper>
                  <TextHelper>{translate('nyb.helper_2')}</TextHelper>
                </FormControl>
              </Form.Field>
            </Form>
          </div>
          <div
            label={translate('nyb.tabs.tab_2')}
            value={ROUTE_NEW_YEAR_BUSKET_TAB_2.slice(1)}
          >
            <div className="hide-mobile">
              <CMSContainer identifier={`promotion_hamper_2019_tab2_${lang.url}`} />
            </div>
            <div className="hide-desktop">
              <CMSContainer identifier={`promotion_hamper_2019_tab2_responsive_${lang.url}`} />
            </div>
          </div>
          <div
            label={translate('nyb.tabs.tab_3')}
            value={ROUTE_NEW_YEAR_BUSKET_TAB_3.slice(1)}
          >
            <CMSContainer identifier={`promotion_hamper_2019_tab3_${lang.url}`} />
          </div>
        </Tabs>
        {location.pathname === ROUTE_NEW_YEAR_BUSKET && (
          <div style={{ marginTop: 30 }}>
            <div className="hide-mobile">
              <CMSContainer identifier={`promotion_hamper_2019_tab1_${lang.url}`} />
            </div>
            <div className="hide-desktop">
              <CMSContainer identifier={`promotion_hamper_2019_tab1_responsive_${lang.url}`} />
            </div>
          </div>
        )}
      </WhitePage>
    );
  }
}

const makeMapStateToProps = () => {
  const getTranslate = makeGetTranslate();
  const getLang = makeGetLanguage();
  const getNyb = makeGetNyb();
  return state => ({
    translate: getTranslate(state),
    lang: getLang(state),
    values: getFormValues('nyb')(state),
    nyb: getNyb(state),
  });
};

const mapDispatchToProps = {};

export default connect(
  makeMapStateToProps,
  mapDispatchToProps,
)(NewYearBasketContainer);
