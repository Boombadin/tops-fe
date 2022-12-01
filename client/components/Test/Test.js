import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

function Test() {
  return <div data-testid="link-id">eiei</div>;
}

const mapStateToProps = () => ({
  lang: {},
});

export default compose(connect(mapStateToProps))(Test);
