import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { fetchPage } from '../../reducers/cms';
import { getCurrentStoreConfigSelector } from '../../selectors';
import { getTranslate } from 'react-localize-redux';
import styled from 'styled-components';
const Wrapper = styled.div`
  background: ${({ noBackGround }) => (noBackGround ? 'none' : '#fff')};
  h1,
  h2,
  h2 > span,
  p > span {
    font-size: 14px !important;
  }
`;
class TermsAndCon extends PureComponent {
  componentDidMount() {
    const pageSlug = 'terms-and-conditions';
    const storeId = this.props.storeConfig.id;
    this.props.fetchPage(pageSlug, storeId);
  }

  getPageHtml = () => {
    const { pages, storeConfig } = this.props;
    const currentPage = get(pages, 'terms-and-conditions');
    let html = null;
    if (currentPage) {
      html = unescape(currentPage?.content)
        .replace(/{{media url="/g, storeConfig?.base_media_url)
        .replace(/"}}/g, '');
    }
    return html;
  };

  render() {
    const content = this.getPageHtml();
    const { noBackGround } = this.props;
    return (
      <Wrapper noBackGround={noBackGround}>
        {content !== 'undefined' && (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        )}
      </Wrapper>
    );
  }
}
const mapStateToProps = state => ({
  pages: state.cms.pages,
  storeConfig: getCurrentStoreConfigSelector(state),
  translate: getTranslate(state.locale),
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchPage,
    },
    dispatch,
  );
export default connect(mapStateToProps, mapDispatchToProps)(TermsAndCon);
