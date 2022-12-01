import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { keys, includes, filter, get as prop, unescape } from 'lodash';
import ReactHtmlParser from 'react-html-parser';
import queryString from 'query-string';
import { fetchCmsBlock } from '../../reducers/cmsBlock';
import Layout from '../../components/Layout';
import MetaTags from '../../components/MetaTags';
import Tabbar from '../../components/Tabbar';
import Breadcrumbs from '../../components/Breadcrumbs';

import { Breadcrumb, Button, Menu } from '../../magenta-ui';
import { fullpathUrl } from '../../utils/url';

import './Help.scss';

const mockContents = {
  how_to_use_website: {
    icon: '/assets/icons/help-page/how-to-use-website.png',
  },
  how_to_shop: {
    icon: '/assets/icons/help-page/how-to-shop.png',
  },
  product_and_promotion: {
    icon: '/assets/icons/help-page/product-info-and-promotion.png',
  },
  how_to_pay: {
    icon: '/assets/icons/help-page/how-to-pay.png',
  },
  shipping_and_delivery: {
    icon: '/assets/icons/help-page/delivery-and-shipment.png',
  },
  user_account: {
    icon: '/assets/icons/help-page/user-account.png',
  },
};

class Help extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTopic: null,
      topics: [],
      topicContents: {},
    };
  }

  static defaultProps = {
    cmsBlock: [],
  };

  static propTypes = {
    storeConfig: PropTypes.object.isRequired,
    cmsBlock: PropTypes.array,
    translate: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const search =
      this.props.location.search.length > 0
        ? queryString.parse(this.props.location.search)
        : null;
    const topics = keys(mockContents);
    const firstTopic = topics[0];
    const fetchedTopicsContent = {};

    if (prop(search, 'topic')) {
      this.setState({
        topics,
        activeTopic: search.topic,
      });
    } else {
      this.setState({
        topics,
        activeTopic: firstTopic,
      });
    }

    topics.forEach(topic => {
      const fetchedContent = ReactHtmlParser(
        this.filterCMSBlock(`help_${topic}`),
      );
      fetchedTopicsContent[topic] = fetchedContent;
    });

    this.setState({
      topicContents: fetchedTopicsContent,
    });
  }

  handleLinkClick(e, container = null, target = null) {
    e.preventDefault();
    if (container && target) {
      container.scrollTop = target.offsetTop;
    }
  }

  componentDidMount() {
    // comment this one for now it cause web crash
    // const helpLinks = document.querySelectorAll('#help-link a')
    // const helpViewer = document.querySelector('#help-viewer')
    //
    // helpLinks.forEach(link => {
    //   const linkHash = link.attributes.href.value
    //   const linkQ = document.querySelector(String(linkHash))
    //
    //   link.addEventListener('click', e => {
    //     e.preventDefault()
    //     scrollIntoView(linkQ, helpViewer, {
    //       alignWithLeft: true,
    //       alignWithTop: true,
    //       onlyScrollIfNeeded: true
    //     })
    //   })
    // })
  }

  shouldComponentUpdate(nextState) {
    return this.state.activeTopic !== nextState.activeTopic;
  }

  filterCMSBlock(identifier) {
    const data = this.props.cmsBlock;
    const baseMediaUrl = this.props.storeConfig.base_media_url;
    let content = '';

    if (data.length > 0) {
      const filterData = filter(data, val => {
        return includes(val.identifier, identifier) && val.active === true;
      });

      filterData.map(resp => {
        content = unescape(resp.content)
          .replace(/{{media url="/g, baseMediaUrl)
          .replace(/"}}/g, '');
      });
    }

    return content;
  }

  transfromSpecialBannerContent(content) {
    const result = [];
    content.map(resp => {
      resp.props.children.map((children, key) => {
        const data = {};

        if (children.props.href) {
          data.href = children.props.href;
          data.image = children.props.children[0].props.src;
          result.push(data);
        }
      });
    });

    return result;
  }

  renderSpecialBanner() {
    const baseMediaUrl = this.props.storeConfig.base_media_url;

    const contentSpecialBanner = this.filterCMSBlock('help_hero_banner');
    const heroBannerData =
      contentSpecialBanner &&
      unescape(contentSpecialBanner)
        .replace(/{{media url="/g, baseMediaUrl)
        .replace(/"}}/g, '');
    if (contentSpecialBanner.length > 0) {
      return (
        <div
          className="special-banner-help-page"
          dangerouslySetInnerHTML={{ __html: heroBannerData }}
        />
      );
    }
  }

  renderBreadcrums() {
    const { translate } = this.props;

    const breadcrumbs = [
      {
        label: translate('homepage_text'),
        url: '/',
      },
      {
        label: translate('help_page_text'),
        isStatic: true,
      },
    ];

    return (
      <div className="breadcrumb-background">
        <Breadcrumb>
          {breadcrumbs.map((breadcrumb, index) => (
            <Breadcrumbs
              key={breadcrumb.label}
              label={breadcrumb.label}
              url={breadcrumb.url}
              isStatic={breadcrumb.isStatic}
              hasNext={index < breadcrumbs.length - 1}
            />
          ))}
        </Breadcrumb>
      </div>
    );
  }

  handleTopicClick(topic) {
    this.setState({
      activeTopic: topic,
    });
  }

  renderTopics() {
    const { topics, activeTopic } = this.state;
    const { translate } = this.props;

    if (topics) {
      return (
        <div className="topic-selectors">
          {topics.map(topic => (
            <Link
              to={`${this.props.match.path}?topic=${topic}`}
              key={topic}
              className="topic-selector"
              data-active={topic === activeTopic}
              onClick={() => this.handleTopicClick(topic)}
            >
              <img
                className="topic-selector-icon"
                src={mockContents[topic].icon}
                alt={translate(`topics.${topic}`)}
              />
              <p className="topic-selector-title">
                {translate(`topics.${topic}`)}
              </p>
            </Link>
          ))}
        </div>
      );
    }
    return <h4>No content available</h4>;
  }

  renderActiveTopicContent() {
    const { activeTopic, topicContents } = this.state;
    const { translate } = this.props;

    if (topicContents[activeTopic]) {
      return (
        <div className="help-viewer-container">
          <h4 className="help-link-title">
            {translate(`topics.${activeTopic}`)}
          </h4>
          {topicContents[activeTopic]}
        </div>
      );
    }
    return <h4>No content available</h4>;
  }

  render() {
    const { activeTopic, topicContents } = this.state;
    const { translate } = this.props;
    let isTopicValid = false;

    if (topicContents[activeTopic]) {
      isTopicValid = true;
    }

    return (
      <div id="help-page">
        <Layout
          title={translate('help_page_text')}
          customItems={() => (
            <Menu.Item
              key="my-list"
              className="sidebar-item active"
              name={this.props.translate('help_page_text')}
              active
            >
              <a className="sidebar-link" href="javascript: void(0)">
                {this.props.translate('help_page_text')}
              </a>
              <span className="sidebar-icon">
                <i className="nav-icon" />
              </span>
            </Menu.Item>
          )}
        >
          <MetaTags
            canonicalUrl={fullpathUrl(this.props.location)}
            title={
              !isTopicValid
                ? translate('meta_tags.help.title')
                : translate(`meta_tags.help.nodes.${activeTopic}.title`)
            }
            keywords={
              !isTopicValid
                ? translate('meta_tags.help.keywords')
                : translate(`meta_tags.help.nodes.${activeTopic}.keywords`)
            }
            description={
              !isTopicValid
                ? translate('meta_tags.help.description')
                : translate(`meta_tags.help.nodes.${activeTopic}.description`)
            }
          />

          <Tabbar />
          {this.renderBreadcrums()}
          {this.renderSpecialBanner()}
          <div className="topic-selectors-wrap">
            {this.renderTopics()}
            {this.renderActiveTopicContent()}
          </div>
          <div className="help-static-content">
            <div className="help-link-static">
              {/* <h4 className="help-link-static-title">{translate('help_page.most_asked_questions')}</h4>
              <ul>
                <li>
                  <a href="#">How to get the discount</a>
                </li>
                <li>
                  <a href="#">How to contact our team</a>
                </li>
                <li>
                  <a href="#">How to navigate the website</a>
                </li>
              </ul>
              <br />
              <hr /> */}
              <h4 className="help-link-static-title">
                {translate('help_page.contact_tops_online')}
              </h4>
              <p>{translate('help_page.not_find_the_answer')}</p>
              <Link to="/contact">
                <Button className="contact-us-button">
                  {translate('help_page.contact_us')}
                </Button>
              </Link>
            </div>
          </div>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  storeConfig: state.storeConfig.current,
  cmsBlock: state.cmsBlock.items,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  fetchCmsBlock: search => dispatch(fetchCmsBlock(search)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Help);
