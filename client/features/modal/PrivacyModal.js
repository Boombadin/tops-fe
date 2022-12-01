import React from 'react';
import styled from 'styled-components';
import ModalTemplate from './components/ModalTemplate';
import { breakpoint } from '@central-tech/core-ui';
import Privacy from '../../components/PDPA/Privacy';
import withLocales from '../../hoc/withLocales';

const OverflowSection = styled.div`
  overflow: auto;
  overflow-x: hidden;
  max-height: 50vh;
  min-height: 40vh;
  ${breakpoint('xs', 'md')`
    max-height: none;
    height: 100%;
    min-height: 0px;
  `}
`;

const ContentWrap = styled.div`
  text-align: left;
  font-size: 14px;
  background: #fbfbfb;
  border: solid 1px #f3f3f3;
  padding: 20px;
  ${breakpoint('xs', 'md')`
    background: #fff;
    padding: 20px;
    font-size: 13px;
  `}
`;
class PrivacyModal extends React.PureComponent {
  render() {
    const { openModal, onModalClose, translate } = this.props;
    return (
      <ModalTemplate
        open={openModal}
        onModalClose={onModalClose}
        close={onModalClose}
        borderContent={'none'}
        backgroundContent={'#ffffff'}
        isLine={false}
        closeOnClick={false}
        ShowMobileCloseIcon
        title={translate('pdpa.privacy_title')}
        justifyContent="center"
      >
        <OverflowSection>
          <ContentWrap>
            <Privacy noBackGround />
          </ContentWrap>
        </OverflowSection>
      </ModalTemplate>
    );
  }
}
export default withLocales(PrivacyModal);
