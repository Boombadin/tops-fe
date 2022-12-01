import React from 'react';
import pt from 'prop-types';
import TopsLoginSideBar from '../TopsLoginSideBar';
import UserDetails from './UserDetails';
import './AccountTab.scss';

const AccountTab = props => {
  return props.isCustomerLogged ? <UserDetails /> : <TopsLoginSideBar />;
};

AccountTab.propTypes = {
  isCustomerLogged: pt.bool.isRequired,
};

export default AccountTab;
