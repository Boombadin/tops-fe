import React, { PureComponent } from 'react';
import { isEmpty } from 'lodash';
import ProfileMenu from '../../components/ProfileMenu';
import { isLoggedIn } from '../../utils/cookie';
class Profile extends PureComponent {
  render() {
    if (!isLoggedIn() && isEmpty(this.props.customer)) {
      this.props.history.push('/');
      return '';
    }

    return <ProfileMenu noGradient />;
  }
}
export default Profile;
