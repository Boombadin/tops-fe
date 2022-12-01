import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { string, array } from 'prop-types';
import { filter, includes, unescape } from 'lodash';
import withStoreConfig from '../../hoc/withStoreConfig';
import { getImageNameFromSrc } from '../../utils/gtmDataAttr';

function CMSBlock({
  identifier,
  className,
  id,
  cmsBlock,
  bannerLocation,
  storeConfig,
}) {
  let cmsContainer = React.createRef();
  const [cmsContent, setCmsContent] = useState('');

  useEffect(() => {
    const baseMediaUrl = storeConfig.base_media_url;
    let content = '';

    if (cmsBlock.length > 0) {
      const filterData = filter(cmsBlock, val => {
        return includes(val.identifier, identifier) && val.active === true;
      });

      filterData.map(resp => {
        content = unescape(resp.content)
          .replace(/{{media url="/g, baseMediaUrl)
          .replace(/"}}/g, '');
      });
    }

    setCmsContent(content);
  }, [cmsBlock]);

  useEffect(() => {
    if (cmsContent && cmsContainer) {
      const element = ReactDOM.findDOMNode(cmsContainer);
      if (element) {
        const images = element.querySelectorAll('img');
        const aLink = element.querySelectorAll('a');
        for (let i = 0; i < images.length; i++) {
          const imageName =
            getImageNameFromSrc(images[i].getAttribute('src')) || '';
          const bannerId = `${bannerLocation}`;
          const bannerName = `${bannerLocation}|${imageName}|${aLink[i]}`;
          images[i].setAttribute('databanner-id', bannerId);
          images[i].setAttribute('databanner-name', bannerName);
          images[i].setAttribute('databanner-position', i + 1);
        }
      }
    }
  }, [cmsContent]);

  return (
    <div
      ref={node => (cmsContainer = node)}
      id={id}
      className={className}
      dangerouslySetInnerHTML={{ __html: cmsContent }}
    />
  );
}

CMSBlock.propTypes = {
  identifier: string,
  cmsBlock: array.isRequired,
};

const mapStateToProps = state => ({
  cmsBlock: state.cmsBlock.items,
});

export default withStoreConfig(connect(mapStateToProps, null)(CMSBlock));
