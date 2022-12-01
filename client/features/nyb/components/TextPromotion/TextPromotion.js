import React from 'react';
import { func } from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Text } from '../../../../components/Typography';
import { ROUTE_NEW_YEAR_BUSKET_TAB_3 } from '../../../../config/promotions';
import { withTranslate } from '../../../../utils/translate';

const TextPromotion = ({ translate }) => (
  <Text size={13} color="#333">
    {translate('common.additional_promotion')}{' '}
    <NavLink
      to={ROUTE_NEW_YEAR_BUSKET_TAB_3}
      style={{ color: '#007aff', textDecoration: 'underline' }}
    >
      {translate('common.click')}
    </NavLink>
  </Text>
);

TextPromotion.propTypes = {
  translate: func.isRequired,
};

export default withTranslate(TextPromotion);
