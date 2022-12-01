import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components'
import TabMobileItem from './TabMobileItem';

const TabList = styled.ol`
  padding-left: 0;
  display: flex;
  flex-direction: row;
  margin: 0;
`

const TabContent = styled.div`
  background-color: white;
  border: 1px solid #d5d5d5;
  margin: 10px 0px;
  padding: 15px;
`

const WhiteCard = styled.div`
  background-color: white;
  padding: 10px 20px;
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
      <WhiteCard>
        <TabList>
          {children.map((child) => {
            const { label, value } = child.props;

            return (
              <TabMobileItem
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
      </WhiteCard>
    );
  }
}

export default Tabs;
