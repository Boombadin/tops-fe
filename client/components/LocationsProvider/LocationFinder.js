import React, { Component } from 'react';
import { Button, Icon, Text, Padding } from '@central-tech/core-ui';
import { func } from 'prop-types';

class LocationFinder extends Component {
  state = {
    loading: false,
    error: null,
    locations: [],
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.locations !== this.state.locations) {
      return true;
    }

    if (nextState.loading !== this.state.loading) {
      return true;
    }

    return false;
  }

  findLocationByGeolocation = e => {
    e.preventDefault();
    const { onCompleted } = this.props;
    this.setState({ loading: true, error: null });
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const googleApi = 'https://maps.googleapis.com/maps/api/geocode/json';
        const apiKey = 'AIzaSyDHKVKvo7YAB8FYF77pegenOsqkE8p8evg';

        fetch(
          `${googleApi}?latlng=${coords.latitude},${coords.longitude}&key=${apiKey}&language=en`,
        )
          .then(res => res.json())
          .then(data => {
            this.setState({ loading: false, locations: data.results });
            if (onCompleted) {
              onCompleted(data.results);
            }
          })
          .catch(err => {
            this.setState({ loading: false, error: err });
          });
      },
      err => this.setState({ loading: false, error: err }),
    );
  };

  render() {
    const { children, textBtn } = this.props;
    return (
      <div>
        <Button
          onClick={this.findLocationByGeolocation}
          height={30}
          color="#80bd00"
          radius="4px"
          size={13}
          block
        >
          {this.state.error ? (
            <div>Location not found.</div>
          ) : (
            <div>
              {this.state.loading ? (
                'Searching ...'
              ) : (
                <Text color="#ffffff" size={12}>
                  <Padding xs="0 6px 0 0" inline>
                    <Icon src="/assets/icons/location-map.svg" padding="0 10px 0 0" />
                  </Padding>
                  {textBtn}
                </Text>
              )}
            </div>
          )}
        </Button>
        {children({
          data: {
            locations: this.state.locations,
          },
          loading: this.state.loading,
          error: this.state.error,
        })}
      </div>
    );
  }
}

LocationFinder.propTypes = {
  children: func,
};

LocationFinder.defaultProps = {
  children: () => null,
};

export default LocationFinder;
