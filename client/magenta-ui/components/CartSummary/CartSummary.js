import React from "react"
import PropTypes from "prop-types"
import CartSummaryItem from "../CartSummaryItem"
import { Segment, Divider, Button, Icon, Grid, Image } from "../.."
import "./CartSummary.scss"
import { withTranslate } from "../../utils/translate";

const styles = {
  textRed: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 15,
  }
}

const CartSummary = ({
  listItems,
  className,
  wrapperClassName,
  titleClassName,
  title,
  confirmBtnText,
  confirmBtnIcon,
  link,
  children,
  loading,
  disabled,
  onCreateOrder,
  componentCoupon,
  componentHelper,
  componentNyb,
  isFetching,
  translate,
  btnConfirmDisable
}) => {
  const markupClassName = `mt-cartsummary ${className}`;
  const handleClick = () => {
    if(!btnConfirmDisable) {
      onCreateOrder()
    }
  }
  return (
    <div className={`mt-cartsummary-wrap ${wrapperClassName}`}>
      <Segment.Group className="mt-cart-summary-segments">
        <Segment className={markupClassName} loading={isFetching}>
          <Grid>
            <Grid.Row>
              <label className={`mt-cartsummary-title ${titleClassName}`}>
                {title}
              </label>
            </Grid.Row>
          </Grid>
          {listItems && listItems.map(item => (
            <CartSummaryItem
              key={item.title}
              className={item.className}
              title={item.title}
              price={item.price}
              unit={item.unit}
              type={item.type}
            />
          )) || children}
          <Grid className="mt-cartsummary-button-wrapper">
            <Grid.Column>
              <Button
                fluid
                className={`mt-cartsummary-button ${className}`}
                size="large"
                onClick={handleClick}
                primary
                labelPosition="right"
                loading={loading}
                disabled={disabled}
              >
                <span>{confirmBtnText}</span>
                <Image src={confirmBtnIcon} />
              </Button>
            </Grid.Column>
          </Grid>
          {/* { disabled && <div className="hide-mobile" style={styles.textRed}>{translate('nyb.form.error_btn')}</div> } */}
          {componentHelper}
          {componentCoupon}
          {componentNyb}
        </Segment>
      </Segment.Group>
    </div>
  );
}

CartSummary.propTypes = {
  listItems: PropTypes.array.isRequired,
  className: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  confirmBtnText: PropTypes.string.isRequired,
  confirmBtnIcon: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.func,
    PropTypes.element,
  ]),
  componentCoupon: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.func,
    PropTypes.element,
  ]),
  componentHelper: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.func,
    PropTypes.element,
  ]),
  componentNyb: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.func,
    PropTypes.element,
  ]),
  loading: PropTypes.bool,
  isFetching: PropTypes.bool,
  translate: PropTypes.func.isRequired,
}

CartSummary.defaultProps = {
  className: '',
  listItems: {},
  wrapperClassName: '',
  titleClassName: '',
  title: '',
  confirmBtnText: 'OK',
  confirmBtnIcon: '',
  link: '#',
  loading: false,
  children: null,
  componentCoupon: null,
  componentHelper: null,
  componentNyb: null,
  isFetching: false,
};

export default withTranslate(CartSummary);
