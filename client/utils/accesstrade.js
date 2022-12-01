import { filter, isEmpty } from 'lodash';

export const initAccessTrade = () => {
  let url;
  if (window?.App?.environment === 'prod') {
    url = 'https://click.accesstrade.in.th/js/nct/lp.js';
  } else {
    url = 'http://click.accesstrade.in.th/adv.php?rk=000mqm000001';
  }

  if (!isEmpty(url)) {
    const checkAccessTrand = filter(
      document.getElementsByTagName('script'),
      val => {
        return val.src === url;
      },
    );

    if (isEmpty(checkAccessTrand)) {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      document.body.appendChild(script);
    }
  }

  // const script2 = document.createElement('script');
  // script2.type = 'text/javascript';
  // script2.innerHTML = `var _atw = _atw || [];_atw.push({"mcn": "20f07591c6fcb220ffe637cda29bb3f6","param": {"result_id": "30","identifier": "1","products": [{id: "{PRODUCT_ID}",category_id: "{PRODUCT_CATEGORY_ID}",price: "{PRODUCT_UNIT_PRICE}",quantity: "{PRODUCT_QUANTITY}"}, {id: "{PRODUCT_ID}",category_id: "{PRODUCT_CATEGORY_ID}",price: "{PRODUCT_UNIT_PRICE}",quantity: "{PRODUCT_QUANTITY}"}],"transaction_discount": "{TRANSACTION_DISCOUNT}"}});(function (d){var s = d.createElement('script');s.src = 'https://cv.accesstrade.in.th/js/nct/cv.js';s.async = true;var e = d.getElementsByTagName('script')[0];e.parentNode.insertBefore(s, e);})(document);`;
  // document.body.appendChild(script2);
};
