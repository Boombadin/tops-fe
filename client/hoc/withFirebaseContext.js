import React from 'react';

import { FirebaseContext } from '@client/contexts';

const withFirebaseContext = WrappedComponent => props => {
  return (
    <FirebaseContext.Consumer>
      {contextValue => <WrappedComponent {...contextValue} {...props} />}
    </FirebaseContext.Consumer>
  );
};

export default withFirebaseContext;
