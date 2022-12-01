import React from 'react';
import { connect } from 'react-redux';
import withLocales from './withLocales';
import { fullPageLoading } from '../reducers/layout';

const withFullPageLoading = WrappedComponent => {

    class HoC extends React.PureComponent {
        render() {
            const { ...props } = this.props;
            return (
                <WrappedComponent {...props}></WrappedComponent>
            );
        }
    }

    return withLocales(
        connect(
            null,
            mapDispatchToProps,
        )(HoC),
    );
};

const mapDispatchToProps = dispatch => ({
    fullPageLoading: (condition, message) => dispatch(fullPageLoading(condition, message)),
});

export default withFullPageLoading;
