import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components'
import Tab from './Tab';


const TabList = styled.ol`
  border-bottom: 1px solid #ccc;
  padding-left: 0;
  display: flex;
  flex-direction: row;
  margin: 0;
`

const TabContent = styled.div`
  border-top: 1px solid #d8d8d8;
  background-color: white;
  padding: 30px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  margin: 1px;
  margin-top: 0px;
`

class Tabs extends Component {
  static propTypes = {
    activeTab: PropTypes.string,
    children: PropTypes.instanceOf(Array).isRequired,
  }

  static defaultProps = {
    activeTab: '',
  }

  constructor(props) {
    super(props);

    this.state = {
      activeTab: props.activeTab || this.props.children[0].props.value,
    };
  }

  onClickTabItem = (tab) => {
    this.setState({ activeTab: tab });
  }

  render() {
    const { children } = this.props
    const { activeTab } = this.state
    return (
      <div>
        <TabList>
          {children.map((child) => {
            const { label, value } = child.props;

            return (
              <Tab
                activeTab={activeTab}
                currentTab={value}
                key={label}
                label={label}
                onClick={this.onClickTabItem}
              />
            );
          })}
        </TabList>
        <TabContent>
          {children.map((child) => {
            if (child.props.value !== activeTab) return undefined;
            return child.props.children;
          })}
        </TabContent>
      </div>
    );
  }
}

export default Tabs;
