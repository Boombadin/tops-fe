import React, { Component } from 'react';
import { find } from 'lodash';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate, getLanguages } from 'react-localize-redux';
import { Image } from '../../magenta-ui';

class LanguageSwitch extends Component {
  static propTypes = {
    languages: PropTypes.array.isRequired,
  };

  setActiveLanguage({ code, url }) {
    const { languages } = this.props;
    const activeUrl = find(languages, { active: true }).url;

    Cookies.set('lang', code);
    window.location.assign(window.location.href.replace(`/${activeUrl}`, `/${url}`));
  }

  render() {
    const { languages, theme, translate, ...rest } = this.props;

    return (
      <div className="language-switch" {...rest}>
        {theme ? (
          <div>
            {languages.map((language, key) =>
              !language.active ? (
                <div
                  key={key}
                  className="lang"
                  onClick={() => this.setActiveLanguage(language)}
                >
                  <Image
                    width="22"
                    src={
                      language.code === 'th_TH'
                        ? '/assets/icons/ico-flag-thai.svg'
                        : '/assets/icons/ico-flag-eng.png'
                    }
                    as="a"
                    spaced="right"
                  />
                  <span>{translate(`regis_form.lang.${language.code}`)}</span>
                </div>
              ) : null,
            )}
          </div>
        ) : (
          <ul>
            {languages.map(language => (
              <li key={language.code} className={language.active ? 'active' : ''}>
                <button onClick={() => this.setActiveLanguage(language)}>
                  {language.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  languages: getLanguages(state.locale),
  translate: getTranslate(state.locale),
});

export default connect(
  mapStateToProps,
  {},
)(LanguageSwitch);
