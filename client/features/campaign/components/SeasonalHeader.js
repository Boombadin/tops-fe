import { breakpoint } from '@central-tech/core-ui';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  border-top-left-radius: 9px;
  border-top-right-radius: 9px;
  height: 44px;
  padding-left: 12px;
  padding-right: 14px;

  ${({ bgImgUrl }) =>
    bgImgUrl &&
    `
      background-image: url(${bgImgUrl});
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 100%;
    `}

  ${breakpoint('xs', 'md')`
    height: 40px;
    padding-left: 7px;
    padding-right: 10px;
  `}
`;
const TitleContainer = styled.div`
  height: 44px;
  display: flex;
  align-items: center;

  ${breakpoint('xs', 'md')`
    height: 40px;
    max-width: calc(100% - 60px);
  `}
`;
const HeadTitleIcon = styled.img`
  height: 40px;
  width: auto;
  margin-right: 4.4px;
`;
const TailTitleIcon = styled.img`
  height: 40px;
  width: auto;
  margin-left: 4.4px;
`;
const Title = styled.span`
  padding-top: 3px;

  font-size: 15px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: ${({ fontColor }) => fontColor || 'black'};

  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  ${breakpoint('xs', 'md')`
    padding-top: 3px;
    font-size: 14px;
    max-width: calc(100% - 63px);
  `}
`;
const TextLinkContainer = styled.a`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  color: ${({ fontColor }) => fontColor || '#ffffff'};

  :hover,
  :focus {
    color: ${({ fontColor }) => fontColor || '#ffffff'};
  }

  ${breakpoint('xs', 'md')`
    max-width: 60px;
  `}
`;
const TextLink = styled.span`
  padding-top: 3px;

  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;

  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  ${breakpoint('xs', 'md')`
    font-size: 10px;
  `}
`;
const TextLinkSvgIcon = styled.svg`
  height: 12px;
  margin-left: 9px;

  ${breakpoint('xs', 'md')`
    height: 8px;
    margin-left: 5px;
  `}
`;

function SeasonalHeader({ lang, seasonalConfig }) {
  const bannerConfig = seasonalConfig.style?.web?.banner || {};

  return useMemo(
    () => (
      <Container
        data-testid="seasonal-header-container"
        bgImgUrl={bannerConfig[lang.url]?.banner_image_url}
      >
        <TitleContainer>
          {bannerConfig.head_title_header_icon_url && (
            <HeadTitleIcon
              data-testid="seasonal-header-head-title-icon"
              src={bannerConfig.head_title_header_icon_url}
            />
          )}
          <Title
            data-testid="seasonal-header-title"
            fontColor={bannerConfig.title_header_font_color}
          >
            {bannerConfig[lang.url]?.title_header}
          </Title>
          {bannerConfig.tail_title_header_icon_url && (
            <TailTitleIcon
              data-testid="seasonal-header-tail-title-icon"
              src={bannerConfig.tail_title_header_icon_url}
            />
          )}
        </TitleContainer>
        <TextLinkContainer
          data-testid="seasonal-header-text-link"
          fontColor={bannerConfig.text_link_font_color}
          href={bannerConfig.text_link_url}
        >
          <TextLink>{bannerConfig[lang.url]?.text_link}</TextLink>
          <TextLinkSvgIcon
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 9 13"
            preserveAspectRatio="none"
          >
            <path
              fill={bannerConfig.text_link_font_color}
              fill-rule="evenodd"
              d="M0.563 1.498L6.191 6.5 0.563 11.502 1.686 12.5 8.438 6.5 1.686 0.5z"
            />
          </TextLinkSvgIcon>
        </TextLinkContainer>
      </Container>
    ),
    [bannerConfig],
  );
}

SeasonalHeader.propTypes = {
  lang: PropTypes.object.isRequired,
  seasonalConfig: PropTypes.object.isRequired,
};

export default SeasonalHeader;
