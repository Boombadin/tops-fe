import React from 'react';
import styled from 'styled-components';
import ModalTemplate from './components/ModalTemplate';
import { breakpoint } from '@central-tech/core-ui';
import TermsAndCon from '../../components/PDPA/TermsAndCon';
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
  h1, h2 {
    font-size: 13px;
  }
`;
class TermsAndConsModal extends React.PureComponent {
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
        title={translate('pdpa.term_condition')}
        justifyContent="center"
      >
        <OverflowSection>
          <ContentWrap>
            <TermsAndCon noBackGround />
          </ContentWrap>
        </OverflowSection>
      </ModalTemplate>
    );
  }
}
export default withLocales(TermsAndConsModal);
