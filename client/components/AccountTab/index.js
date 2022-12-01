import { connect } from 'react-redux';
import AccountTab from './AccountTab';
import { isCustomerLoggedSelector } from '../../selectors';

const mapStateToProps = state => ({
  isCustomerLogged: isCustomerLoggedSelector(state),
});

export default connect(mapStateToProps)(AccountTab);
