import React, { Component } from 'react';
import { Header, Input, Label, Segment, Divider, Button, Grid } from '../../magenta-ui'
import {IntlProvider, FormattedNumber} from 'react-intl';

import CartApi from '../../../apis/cart';

class Summary extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };

    this._setCartSummary = this._setCartSummary.bind(this);
  }
  // Lifecycle methods
  componentDidMount() {
    if (!this.props.summary) {
      let cartId = 30; //รอ cartID จาก accout login
      let summary = CartApi.getAll(cartId).then((res) => {
        this._setCartSummary(res.data)
      })
    }
  }


  // Event handlers
  _setCartSummary(data) {
    this.setState({
      data: data.cart
    })
  }

  render() {
    return (
      <Segment.Group>
          <Segment>
            <label style={{fontSize:'1.8rem'}}>Summary</label>
            <Divider />
            <Grid>
              <Grid.Column floated='left' width={5}>
                <label floated='left'>Subtotal</label>
              </Grid.Column>
              <Grid.Column floated='right' width={5}>
                <label floated='right'>
                  {this.state.data.subtotal}
                </label>
              </Grid.Column>
            </Grid>
            <Grid>
              <Grid.Column floated='left' width={5}>
                <label floated='left'>Discount</label>
              </Grid.Column>
              <Grid.Column floated='right' width={5}>
                <label floated='right'>
                  {this.state.data.discount_amount}
                </label>
              </Grid.Column>
            </Grid>
            <Grid>
              <Grid.Column floated='left' width={5}>
                <label floated='left'>Tax</label>
              </Grid.Column>
              <Grid.Column floated='right' width={5}>
                <label floated='right'>
                  {this.state.data.tax_amount}
                </label>
              </Grid.Column>
            </Grid>
            <Divider />
            <Grid>
              <Grid.Column floated='left' width={5}>
                <label floated='left'>Order Total</label>
              </Grid.Column>
              <Grid.Column floated='right' width={5}>
                <label floated='right'>
                  {this.state.data.grand_total}
                </label>
              </Grid.Column>
            </Grid>
            <Divider />
            <Button
              content='Proceed to Checkout'
              primary
              ref={this.handleRef}
              style={{width: '100%', height: '52px', fontSize: '18px'}}
              onClick={this.props.onActionClick}
            />
          </Segment>
      </Segment.Group>
    )
  }
}

export default Summary;
