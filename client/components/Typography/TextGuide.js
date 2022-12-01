import React, { Component } from 'react';
import { Text } from '@central-tech/core-ui';
import styled from 'styled-components';

const Caption = styled(Text)`
  font-family: sans-serif;
`;

class TextGuide extends Component {
  render() {
    const { type, bold, ...rest } = this.props;

    switch (type) {
      case 'section':
        return (
          <Text
            as="p"
            color="default"
            lineHeight="30px"
            spacing="-0.6px"
            bold={bold}
            size={18}
            {...rest}
          />
        );
      case 'topic':
        return (
          <Text
            as="p"
            color="default"
            lineHeight="28px"
            spacing="-0.6px"
            bold={bold}
            size={15}
            {...rest}
          />
        );
      case 'callout':
        return (
          <Text
            as="p"
            color="default"
            lineHeight="25px"
            spacing="-0.6px"
            bold={bold}
            size={15}
            {...rest}
          />
        );
      case 'body':
        return (
          <Text
            as="p"
            lineHeight="22px"
            color="default"
            spacing={bold ? '-0.4px' : 'normal'}
            size={13}
            bold={bold}
            {...rest}
          />
        );
      case 'body-2':
        return (
          <Text
            as="p"
            lineHeight="20px"
            color="default"
            spacing={bold ? '-0.4px' : 'normal'}
            size={12}
            bold={bold}
            {...rest}
          />
        );
      case 'caption':
        return (
          <Caption
            className="default-font"
            as="p"
            lineHeight="19px"
            color="default"
            size={12}
            bold={bold}
            // style={{ fontFamily: 'sans-serif ' }}
            {...rest}
          />
        );
      case 'caption-2':
        return (
          <Caption
            className="default-font"
            as="p"
            lineHeight="18px"
            color="default"
            size={11}
            bold={bold}
            // style={{ fontFamily: 'sans-serif ' }}
            {...rest}
          />
        );
      case 'caption-3':
        return (
          <Text
            className="default"
            as="p"
            lineHeight="13px"
            color="default"
            size={9} //Size 12 from Zeplin
            bold={bold}
            {...rest}
          />
        );

      default:
        return (
          <Text
            as="p"
            lineHeight="22px"
            spacing={bold ? '-0.4px' : 'normal'}
            size={13}
            bold={bold}
            {...rest}
          />
        );
    }
  }
}

export default TextGuide;
