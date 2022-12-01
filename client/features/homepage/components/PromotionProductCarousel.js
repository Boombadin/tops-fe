import get from 'lodash/get';
import take from 'lodash/take';
import queryString from 'query-string';
import React, { PureComponent } from 'react';

import ProductApi from '@client/apis/product';
import PreloadedProductCarousel from '@client/components/PreloadedProductCarousel';
import { ProductListPreloader } from '@client/components/PreloaderComponent';
import withLocales from '@client/hoc/withLocales';

@withLocales
class PromotionProductCarousel extends PureComponent {
  state = {
    loading: false,
    products: [],
  };

  componentDidMount() {
    this.fetchTrendingProduct();
  }

  fetchTrendingProduct = async () => {
    this.setState({
      loading: true,
    });

    const field = `promotion_type,${encodeURIComponent(
      'Sale,Red Hot,BOGO,B2G1,B3G1,B1GV,B2GV,B3GV',
    )},in`;
    const params = {
      page_size: 30,
      page_number: 1,
      field,
      filters: JSON.stringify({}),
      sort: 'ranking,desc',
    };

    const paramString = queryString.stringify(params);
    const { products } = await ProductApi.getPromotion(paramString);
    const productItems = get(products, 'items', []);
    this.setState({
      loading: false,
      products: productItems,
    });
  };

  render() {
    const { translate } = this.props;
    return (
      <React.Fragment>
        {this.state.loading ? (
          <ProductListPreloader />
        ) : (
          <PreloadedProductCarousel
            id="promotion"
            ownProducts={take(this.state.products, 30)}
            title={translate('homepage.promotion')}
            button
            url="/promotion"
            isCustomSlide
            titlePosition="left"
            titleLine={false}
            btnName="homepage.show_all"
            section="Promotion this week"
          />
        )}
      </React.Fragment>
    );
  }
}

PromotionProductCarousel.propTypes = {};

export default PromotionProductCarousel;
