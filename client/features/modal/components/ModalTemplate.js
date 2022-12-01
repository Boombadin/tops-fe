import {
  breakpoint,
  HideDesktop,
  HideMobile,
  Icon,
  Modal,
  Padding,
} from '@central-tech/core-ui';
import { bool, func, node, oneOfType, string } from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import { TextGuide } from '../../../components/Typography';

const ModalWrapper = styled.div`
  .core-ui-modal-content {
    height: 100%;
  }
`;

const ModalContent = styled.div`
  background: #ffffff;
  border: 1px solid #e5e5e5;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);
  max-width: ${props => props.maxWidth || '680px'};
  width: 100%;
  min-height: ${props => props.minHeight || '300px'};
  border-radius: 5px;
  padding: 19px 30px 20px 30px;
  ${breakpoint('xs', 'md')`
    height: ${props => props.mobileHeight || '100%'};
    border-radius: ${props => props.mobileRadius || '0px'};
    padding: 0;
    max-width: ${props => props.mobileMaxWidth || 'none'};
  `}
`;

const ModalHeader = styled(Padding)`
  ${breakpoint('xs', 'md')`
    height: 60px;
    border-bottom: 1px solid #e9e9e9;
  `}
`;
const ModalHeaderInner = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: ${({ justifyContent }) =>
    justifyContent ? justifyContent : 'flex-start'};
`;
const ModalHeaderSection = styled.div``;
const ModalHeaderTextTitle = styled(TextGuide)`
  display: inline-block;
`;
const ModalHeaderSectionInner = styled.div`
  display: flex;
  align-items: center;
`;
const ModalHeaderTextDescription = styled(TextGuide)`
  ${breakpoint('xs', 'md')`
    line-height: 15px;
  `}
`;
const ModalFooter = styled.div`
  ${breakpoint('xs', 'md')`
    position: absolute;
    bottom: ${props => props.footerPositionBottom || '0'} ;
    height: 40px;
    left: 0;
    width: 100%;
  `}
`;

const ModalBody = styled.div`
  ${breakpoint('xs', 'md')`
    overflow: hidden;
    height: calc(100% - 40px - 60px - ${({ remark }) =>
      remark ? '60px' : '0px'});
    padding-top: ${({ topSpace }) => (topSpace ? '19px' : '0')};
  `}
  background: ${({ bodyColor }) => bodyColor || '#f7f7f7'};
`;

const FormBackground = styled.div`
  background: ${props => props.backgroundContent || '#fbfbfb'};
  border: ${({ borderContent }) => borderContent || 'solid 1px #f3f3f3'};
  border-radius: 5px;
  height: 100%;

  ${breakpoint('xs', 'md')`
    border-radius: 0;
    background: #ffffff;
  `}
`;

const LineSpace = styled.div`
  height: 1px;
  background: #ededed;
  margin: 0 0 19px 0;
`;

const CloseModal = styled.div`
  position: absolute;
  right: 30px;
  top: 20px;
  width: 35px;
  height: 35px;
  text-align: center;
  line-height: 35px;
  cursor: pointer;

  ${breakpoint('xs', 'md')`
    line-height: 24px;
    right: 20px;
    top: 18px;
    width: 24px;
    height: 24px;
    display: ${({ ShowMobileCloseIcon }) =>
      ShowMobileCloseIcon ? 'block' : 'none'}
  `}
`;

const WarningMessage = styled(Padding)`
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e5e5;
  ${breakpoint('xs', 'md')`
    height: 60px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 0;
    margin: 0;
  `}
`;

const HeaderIcon = styled(Icon)`
  /* float: left; */
  margin-right: 5px;
  display: inline-block;
`;

const ModalTemplate = ({
  open,
  title,
  headerIcon,
  description,
  remark,
  renderFooter,
  children,
  onModalClose,
  close,
  closeOnClick = true,
  maxWidth,
  borderContent,
  backgroundContent,
  isLine,
  backButtonIcon,
  topSpace,
  isCloseIcon,
  ShowMobileCloseIcon,
  justifyContent,
  bodyColor,
  minHeight,
  mobileHeight,
  mobileMaxWidth,
  mobileRadius,
  footerPositionBottom,
  ...rest
}) => {
  return (
    <ModalWrapper {...rest}>
      <Modal
        visible={open}
        onModalClose={onModalClose}
        closeOnClick={closeOnClick}
        scrollLock
      >
        <ModalContent
          maxWidth={maxWidth}
          mobileHeight={mobileHeight}
          minHeight={minHeight}
          mobileMaxWidth={mobileMaxWidth}
          mobileRadius={mobileRadius}
        >
          {isCloseIcon && (
            <CloseModal
              onClick={close}
              ShowMobileCloseIcon={ShowMobileCloseIcon}
            >
              <Icon src="/assets/icons/round-close-24-px.svg" width={19} />
            </CloseModal>
          )}
          <ModalHeader xs="8px 20px" md="0 0 19px 0">
            <ModalHeaderInner justifyContent={justifyContent}>
              {backButtonIcon && (
                <HideDesktop>
                  <Icon
                    src="/assets/icons/round-arrow-back.svg"
                    style={{ marginRight: 16 }}
                    height={16}
                    onClick={close}
                  />
                </HideDesktop>
              )}
              <ModalHeaderSection>
                <ModalHeaderSectionInner>
                  {headerIcon && backButtonIcon ? (
                    <HideMobile>
                      <HeaderIcon src={headerIcon} width={19} />
                    </HideMobile>
                  ) : (
                    headerIcon && <HeaderIcon src={headerIcon} width={19} />
                  )}
                  <ModalHeaderTextTitle type="topic" bold size={16}>
                    {title}
                  </ModalHeaderTextTitle>
                </ModalHeaderSectionInner>

                <ModalHeaderTextDescription color="#2a2a2a">
                  {description}
                </ModalHeaderTextDescription>
              </ModalHeaderSection>
            </ModalHeaderInner>
          </ModalHeader>
          <ModalBody remark={remark} topSpace={topSpace} bodyColor={bodyColor}>
            <FormBackground
              borderContent={borderContent}
              backgroundContent={backgroundContent}
            >
              {children}
            </FormBackground>
          </ModalBody>
          <HideMobile>{isLine && <LineSpace />}</HideMobile>
          {remark && (
            <WarningMessage xs="0" md="0 0 20px 0">
              <TextGuide type="caption-2" align="center" color="#666666">
                {remark}
              </TextGuide>
            </WarningMessage>
          )}
          <ModalFooter footerPositionBottom={footerPositionBottom}>
            {renderFooter}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ModalWrapper>
  );
};

ModalTemplate.propTypes = {
  open: bool,
  title: oneOfType([string, func, node]),
  description: oneOfType([string, func, node]),
  renderFooter: oneOfType([string, func, node]),
  isLine: bool,
  isCloseIcon: bool,
  ShowMobileCloseIcon: bool,
};

ModalTemplate.defaultProps = {
  open: false,
  title: '',
  description: '',
  renderFooter: '',
  isLine: true,
  isCloseIcon: true,
  ShowMobileCloseIcon: false,
};

export default ModalTemplate;
