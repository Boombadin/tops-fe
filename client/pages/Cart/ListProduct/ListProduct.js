import React, {Component} from 'react';
import { Table, Header, Input, Label, Item } from '../../magenta-ui'
import {IntlProvider, FormattedNumber} from 'react-intl';

import CartApi from '../../../apis/cart';

class ListProduct extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };

    this._setCart = this._setCart.bind(this)
    this.handleChangeValue = this.handleChangeValue.bind(this)
  }
  // Lifecycle methods
  componentDidMount() {
    if (!this.props.product) {
      let cartId = 30; //รอ cartID จาก accout login
      let product = CartApi.getAll(cartId).then((res) => {
        this._setCart(res.data)
      })
    }
  }

  _setCart(data) {
    this.setState({
      data: data.cart.items
    })
  }

  handleChangeValue(event) {
    const value = event.target.value
    const index = event.target.name
    let curData = this.state.data
    curData[index].qty = Number(value)

    this.setState({
      data: curData
    });
  }

  render() {
    return (
      <IntlProvider locale="en">
        <Table.Body>
          {this.state.data.map((val,key) => (
            <Table.Row>
              <Table.Cell colSpan='2'>
                <Item.Group>
                  <Item>
                    <Item.Image 
                      src='' 
                      style={{width: '165px', height: '165px', padding: '10px'}} />
                    <Item.Content verticalAlign='top' style={{padding: '10px'}}>
                      <Item.Header style={{fontWeight: 'normal'}}>{val.name}</Item.Header>
                    </Item.Content>
                  </Item>
                </Item.Group>
              </Table.Cell>
              <Table.Cell 
                textAlign='right' 
                verticalAlign='text-top'>
                <label 
                  style={{color: '#666', lineHeight: '1.8em', fontSize: '20px', fontWeight: '700'}}>
                  $<FormattedNumber
                    value={val.price} />
                </label>
              </Table.Cell>
              <Table.Cell 
                textAlign='right' 
                verticalAlign='top'>
                <Input name={key} type="text" onChange={this.handleChangeValue} value={val.qty} style={{height: '36px', textAlign: 'center', width: '45px'}} />
              </Table.Cell>
              <Table.Cell textAlign='right' verticalAlign='text-top'>
                <label style={{color: '#666', lineHeight: '1.8em', fontSize: '20px', fontWeight: '700'}}>
                  $<FormattedNumber
                    value={val.row_total} />
                </label>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </IntlProvider>
    )
  }
}

export default ListProduct;
