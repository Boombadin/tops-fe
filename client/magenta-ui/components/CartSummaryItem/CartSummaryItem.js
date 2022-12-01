import React from 'react';
import PropTypes from 'prop-types';
import { ITEMTYPE as CartSummaryItemItemType } from '../../types';
import './CartSummaryItem.scss';
import { Grid, Divider } from '../..';

const CartSummaryItem = ({
		className,
		title,
		price,
		unit,
		type,
}) => {
	if (type === CartSummaryItemItemType.DIVIDER) {
		return (
			<Divider/>
		);
	 }
	 else if (type === CartSummaryItemItemType.SUMMARY) {
		return (
			<Grid key={title} className={`mt-cart-summary-item ${className}`}>
				<Grid.Column className={`mt-cart-summary-label ${className}`} floated="left" width={10}>
					<label>{title}</label>
				</Grid.Column>
				<Grid.Column floated="right">
					<label className ={`mt-cart-summery-value ${className}`}>
						{price}
					</label>
					<span className={`mt-cart-summary-unit`}>
						{unit}
					</span>
				</Grid.Column>
			</Grid>
		);
	}
}

CartSummaryItem.PropTypes = {
	className: PropTypes.string,
	title: PropTypes.string,
	price: PropTypes.string,
	unit: PropTypes.string,
	type: PropTypes.string,
}
CartSummaryItem.defaultProps = {
	className: '',
	title: '',
	price: '0',
	unit: 'baht',
	type: 'summary',
}

export default CartSummaryItem;
