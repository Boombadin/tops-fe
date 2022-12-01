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
  border: 1px solid #d5d5d5;
  border-radius: 6px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.16);
  background: white;
  text-align: center;
  font-size: 12px;
  font-weight: normal;
  color: #808080;
  flex: 1;
  margin: 0 5px;

  &:first-child {
    margin-left: 0px;
  }

  &:last-child {
    margin-right: 0px;
  }
`

const TabListItemActive = styled(TabListItem)`
  border: 1px solid #007a33;
  color: #333;
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
