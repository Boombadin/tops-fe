import React, { Component } from 'react';
import { connect } from 'react-redux'
import { getTranslate } from 'react-localize-redux'
import './RegisProgressBar.scss';

class RegisProgressBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { translate } = this.props
    let step = this.props.step
    let bar = {}
    if (step == 1) {
      bar = {
        circle1: 'active',
        line1: 'active',
        circle2: '',
        line2: '',
        circle3: '',
        text1: 'active',
        text2: '',
        text3: ''
      }
    }
    else if (step == 2) {
      bar = {
        circle1: 'complete',
        line1: 'complete',
        circle2: 'active',
        line2: 'active',
        circle3: '',
        text1: 'complete',
        text2: 'active',
        text3: ''
      }
    }
    else if (step == 3) {
      bar = {
        circle1: 'complete',
        line1: 'completed',
        circle2: 'complete',
        line2: 'complete',
        circle3: 'active',
        text1: 'complete',
        text2: 'complete',
        text3: 'active'
      }
    }

    return (
      <div className="regis-progress-bar">
        <div className="container">
          <ul className="progressbar">
            <li className={`circle ${bar.circle1}`}>
              <div className="number"><span>1</span></div>
              <div className={`text ${bar.text1}`}>{translate('regis_form.progress_bar_step1')}</div>
            </li>
            <li className={`line ${bar.line1}`} />
            <li className={`circle ${bar.circle2}`}>
              <div className="number"><span>2</span></div>
              <div className={`text ${bar.text2}`}>{translate('regis_form.progress_bar_step2')}</div>
            </li>
            <li className={`line ${bar.line2}`} />
            <li className={`circle ${bar.circle3}`}>
              <div className="number"><span>3</span></div>
              <div className={`text ${bar.text3}`}>{translate('regis_form.progress_bar_step3')}</div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale)
})

export default connect(mapStateToProps)(RegisProgressBar);
