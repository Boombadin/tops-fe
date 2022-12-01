import React, { PureComponent } from 'react';
import { func, shape, bool, arrayOf, object, string } from 'prop-types';
import { connect } from 'react-redux';
import { makeGetBanner } from '../redux/bannerSelector';
import { fetchBanner } from '../redux/bannerActions';

export const withBannerByName = (WrapperComponent, name) => {
  class BannerHOC extends PureComponent {
    static propTypes = {
      fetchBanner: func.isRequired,
      banner: shape({
        isReload: bool.isRequired,
        isFetching: bool.isRequired,
        error: string.isRequired,
        data: arrayOf(object),
      }).isRequired,
    };

    componentDidMount() {
      const { banner, bannerName } = this.props;
      if (banner.isReload) {
        const definedName = name || bannerName;
        this.props.fetchBanner('name', definedName);
      }
    }

    render() {
      return <WrapperComponent {...this.props} />;
    }
  }

  const makeMapStateToProps = () => {
    const getBanner = makeGetBanner();
    return (state, props) => ({
      banner: getBanner(state, name || props.bannerName),
    });
  };

  const mapDispatchToProps = {
    fetchBanner,
  };

  return connect(
    makeMapStateToProps,
    mapDispatchToProps,
  )(BannerHOC);
};
