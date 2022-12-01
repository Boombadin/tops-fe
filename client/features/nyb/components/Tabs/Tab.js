import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

const TabListItem = styled(NavLink)`
  cursor: pointer;
  display: inline-block;
  list-style: none;
  margin-bottom: -1px;
  padding: 15px;
  border: solid #d8d8d8;
  border-width: 1px 1px 0 1px;
  border-radius: 10px 10px 0 0;
  background: #f0f0f0;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  flex: 1;
  color: #333;

  &:hover {
    color: #333;
  }
  &:active {
    color: #333;
  }
`

const TabListItemActive = styled(TabListItem)`
  cursor: pointer;
  background-color: #a90006;
  border: solid #d8d8d8;
  border-width: 1px 1px 0 1px;
  border-radius: 10px 10px 0 0;
  color: white;

  &:hover {
    color: white;
  }
  &:active {
    color: white;
  }
`

class Tab extends Component {
  static propTypes = {
    activeTab: PropTypes.string.isRequired,
    currentTab: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  handleClick = () => {
    const { onClick, currentTab } = this.props;
    onClick(currentTab);
  }

  render() {
    const { activeTab, label, currentTab } = this.props
    const TabItem = activeTab === currentTab ? TabListItemActive : TabListItem;
    return (
      <TabItem to={currentTab} onClick={this.handleClick}>
        {label}
      </TabItem>
    );
  }
}

export default Tab;
