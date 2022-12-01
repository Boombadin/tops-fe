import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Field, reduxForm, change } from 'redux-form'
import { getTranslate } from 'react-localize-redux'
import { Checkbox, Radio, Input } from 'semantic-ui-redux-form-fields'
import { Form, Accordion, Icon  } from '../../magenta-ui'
import './ProductReplacement.scss'

const initialValues = {
  substutitions: ''
}

class ProductReplacement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      substutition: '',
    };
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  handleClickSubstutition = (value) => {
    this.setState({
      substutition: value,
    })
    
    this.props.changeFieldValue('substutition_label', value)
  }
  
  render() {
    const { translate } = this.props;
    return (
      <div className="product-replacement-wrap">
      <Accordion className='checkout-page-accordion'>
        <Accordion.Title className='checkout-page-accordion-title'
          active={this.state.activeIndex === 1} index={1}
          onClick={this.handleClick}
          className='checkout-page-title'
        >
          <Icon className='checkout-page-title__icon chevron down' />
          <Accordion.Title className='checkout-page-title'>{translate('substitution.title')}</Accordion.Title>
        </Accordion.Title>
        <Accordion.Content className="checkout-page-content" active={this.state.activeIndex === 1}>
          <div className="substutitions-form">
            <Form> 
              <label className="label-radio">
                <Field
                  className="field"
                  name="substutitions"
                  component={Radio}
                  checked={this.state.substutition === translate('substitution.get_substitution_by_owner')}
                  onClick={() => this.handleClickSubstutition(translate('substitution.get_substitution_by_owner'))}
                />
                <span className="product-replacement-title">
                  <span className={this.state.substutition === translate('substitution.get_substitution_by_owner') ? 'active' : ''}>{translate('substitution.by_owner')}</span></span>
              </label>
              <label className="label-radio">
                <Field
                  className="field"
                  name="substutitions"
                  component={Radio}
                  checked={this.state.substutition === translate('substitution.get_substitution_by_staff')}
                  onClick={() => this.handleClickSubstutition(translate('substitution.get_substitution_by_staff'))}
                />
                <span className="product-replacement-title"><span className={this.state.substutition === translate('substitution.get_substitution_by_staff') ? 'active' : ''}>{translate('substitution.by_staff')}</span></span>
              </label>
              {/* <label className="label-radio">
                <Field
                  className="field"
                  name="substutitions"
                  component={Radio}
                  checked={this.state.substutition === translate('substitution.no_need_substitution')}
                  onClick={() => this.handleClickSubstutition(translate('substitution.no_need_substitution'))}
                />
                <span className={`product-replacement-title ${this.state.substutition === translate('substitution.no_need_substitution') ? 'active' : ''}`}>{translate('substitution.no_need_substitution')}</span>                
              </label> */}
            </Form>
          </div>
        </Accordion.Content>
      </Accordion>
      </div>
    );  
  };
};


const mapStateToProps = (state, ownProps) => ({
  translate: getTranslate(state.locale)
})
const mapDispatchToProps = (dispatch, ownProps) => ({
  changeFieldValue: (field, value) => {
    dispatch(change('productReplacement', field, value))
  }
})

export default connect(mapStateToProps, mapDispatchToProps) (reduxForm({
  form: "productReplacement",
  initialValues,
  onSubmit: () => {}
})(ProductReplacement))
