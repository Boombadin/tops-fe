import '@testing-library/jest-dom';

// fix react-slick >> https://github.com/akiran/react-slick/issues/742
window.matchMedia =
  window.matchMedia ||
  function() {
    return {
      matches: false,
      addListener: function() {},
      removeListener: function() {},
    };
  };

// mock react-lazyload
// jest.mock('react-lazyload', () => props => props.children);
// jest.mock('@central-tech/react-hooks');
