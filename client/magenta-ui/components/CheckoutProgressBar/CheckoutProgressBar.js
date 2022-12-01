import React from "react"
import PropTypes from "prop-types"
import "./CheckoutProgressBar.scss"
import { Icon, Step } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom'

const translation = {
  en_US: {
    step: 'Step',
    out_of: 'out of',
    back_to_shopping: 'Back'
  },
  th_TH: {
    step: 'ขั้นตอนที่',
    out_of: 'จาก',
    back_to_shopping: 'ย้อนกลับ'
  }
};

const CheckoutProgressBar = ({
  className,
  steps,
  onBackClick,
  backButton,
  lang = 'en_US',
  upperHeader,
  url
}) => {
  const markupClassName = `mt-checkout-progressbar ${className}`;

  const labels = translation[lang];

  return (
    <Step.Group widths={3} className={markupClassName}>
      {steps.map((step, index) => { 
        const resolveStatus = (status) => {
          return step.status === status;
        }

        return (
          <Step 
            active={resolveStatus('active')}
            completed={resolveStatus('completed')}
            disabled={resolveStatus('disabled')}
            className={`mt-step ${upperHeader}`}
          >
            <Step.Content>
              <span className='mt-step-indicator'></span>
              <Step.Title className='mt-step-title'>{step.title}</Step.Title>
              <div className='mt-mobile-controls'>
                {/* <span className="back">
                  {step.backButton}
                </span> */}
                {
                  onBackClick ? (
                    <span className="back" onClick={onBackClick}>
                      <Icon name='angle left' color='grey' size='big' />
                      <span className="text">{labels.back_to_shopping}</span>
                    </span>
                  )
                  :
                  <span> </span>
                }
                
                <span className='mt-step-order'>
                  <Step.Title className='mt-step-title mt-step-title--mob'>{step.title}</Step.Title>                
                  {`${labels.step} ${index + 1} ${labels.out_of} ${steps.length}`}
                </span>
                <NavLink to={url} className="question"><img src="/assets/icons/help-icon.svg" width="19"/></NavLink>
              </div>
            </Step.Content>
          </Step>
        );
      })}
    </Step.Group>
  )
}

CheckoutProgressBar.propTypes = {
  className: PropTypes.string.isRequired,
  steps: PropTypes.array.isRequired,
  url: PropTypes.string
}

CheckoutProgressBar.defaultProps = {
  className: '',
  steps: [],
  url: ''
}

export default CheckoutProgressBar

