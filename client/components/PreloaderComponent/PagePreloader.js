import React from 'react';
import { Loader } from '../../magenta-ui';
import './PagePreloader.scss';

const PagePreloader = () => (
  <div className="preload-page">
    <Loader className="preload-page-loader" active size="large" />
  </div>
);

export default PagePreloader;
