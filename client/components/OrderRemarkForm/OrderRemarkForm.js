import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './OrderRemarkForm.scss'
import { connect } from 'react-redux'
import { Field, reduxForm, change } from 'redux-form'
import { getTranslate } from 'react-localize-redux'
import { filter } from 'lodash'
import { Checkbox, Radio, Input, TextArea } from 'semantic-ui-redux-form-fields'
import { Form, Accordion, Icon  } from '../../magenta-ui'

const initialValues = {
  order_remark : '',
  remember_order_remark: false
}

const renderField = ({ 
  label,
  input,
}) => (
    <textarea 
      {...input}
      type="text"
      className="input-textarea" 
      rows="5" 
      maxLength={255}
    /> 
);

class OrderRemarkForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0, 
      chars_left: 255,
      isRemark: false
    };
  }
  componentDidMount() {
    const { customer } = this.props;
    let remark = {}
    let remarkValue = ''
    remark = filter(customer.custom_attributes, data => {
      return data.name === "order_remark"
    })

    if(remark.length > 0){
      remark.map(item => {
        remarkValue = item.value
      })
      this.props.changeFieldValue('order_remark', remarkValue)
      this.props.changeFieldValue('remember_order_remark', true)
      this.setState({ chars_left: 255 - remarkValue.length, isRemark: true});
    }
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  handleWordCount = e => {
    const charCount = e.target.value.length;
    const charLeft = 255 - charCount;
    this.setState({ chars_left: charLeft});
  }

  handleClickRememberRemark = () => {
    this.setState({
      isRemark: !this.state.isRemark
    })
  }

  render() {
    const { translate } = this.props;
 
    return (
      <Accordion className='checkout-page-accordion'>
        <Accordion.Title className='checkout-page-accordion-title'
          active={this.state.activeIndex === 1} index={1}
          onClick={this.handleClick}
          className='checkout-page-title'
        >
          <Icon className='checkout-page-title__icon chevron down' />
          <Accordion.Title className='checkout-page-title'>{translate('remark_form.title')}</Accordion.Title>
        </Accordion.Title>
        <Accordion.Content className="checkout-page-content" active={this.state.activeIndex === 1}>
          <div className="remark-from-wrap">
            <Form className="remark-from"> 
              <Field
                className="field"
                name="order_remark"
                component={renderField}
                onChange={this.handleWordCount}
              />
              <div className="count-char-wrap">
                <div className="line"></div>
                <span className="count-char">{this.state.chars_left}</span>
              </div>
              <Field
                name="remember_order_remark"
                component={Checkbox}
                label={translate('remark_form.remember')}
                onChange={()=> this.setState({isRemark:!this.state.isRemark})}
                checked={this.state.isRemark}
                onClick={this.handleClickRememberRemark}
              />
            </Form>
          </div>
        </Accordion.Content>
      </Accordion>
    );  
  };
};

const mapStateToProps = (state, ownProps) => ({
  translate: getTranslate(state.locale),
  customer: state.customer.items
})
const mapDispatchToProps = (dispatch, ownProps) => ({
  changeFieldValue: (field, value) => {
    dispatch(change('orderremarkform', field, value))
  }
})

export default connect(mapStateToProps, mapDispatchToProps) (reduxForm({
  form: "orderremarkform",
  enableReinitialize: true,
  initialValues,
  onSubmit: () => {}
})(OrderRemarkForm))