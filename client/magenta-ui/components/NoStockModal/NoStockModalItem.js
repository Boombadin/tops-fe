import React from 'react';
import './NoStockModalItem.scss';

/**
 * reason: 'out_of_stock' | ''
 */
const phrases = {
  outOfStockNote: {
    en_US: '*Out of stock',
    th_TH: '*สินค้าหมด',
  },
  notAvailableNote: {
    en_US: '*Product cannot be delivered in your area',
    th_TH: '*สินค้าไม่สามารถจัดส่งได้ในพื้นที่ของท่าน',
  },
  notEnoughQuant: {
    en_US: '*Not enough stock',
    th_TH: '*จำนวนสินค้าไม่เพียงพอ',
  },
  priceChanged: {
    en_US: '*Price changed',
    th_TH: '*สินค้ามีราคาเปลี่ยนแปลง',
  },
  piece: {
    en_US: 'piece',
    th_TH: 'ชิ้น',
  },
  notifyMe: {
    en_US: 'Notify me when available',
    th_TH: 'แจ้งเตือนเมื่อมีสินค้า',
  },
};

function getNote(reason, lang) {
  if (reason === 'out_of_stock') {
    return phrases.outOfStockNote[lang];
  } else if (reason === 'not_available') {
    return phrases.notAvailableNote[lang];
  } else if (reason === 'not_enough_quant' || reason === 'insufficient_stock') {
    return phrases.notEnoughQuant[lang];
  } else if (reason === 'price_changed') {
    return phrases.priceChanged[lang];
  }
}

export const NoStockModalItem = ({ image, name, price, reason, lang, missingQuant = 1 }) => {
  const disabled = reason === 'out_of_stock' || reason === 'not_available';

  return (
    <div className={`mt-no-stock-item no-stock-reason--${reason}`}>
      <div className="mt-no-stock-item__image-column">
        <img
          className={`mt-no-stock-item__image ${disabled ? 'inactive' : ''}`}
          src={image}
          alt={name}
        />
      </div>
      <div className="mt-no-stock-item__details-column">
        <div className={`mt-no-stock-item__name ${disabled ? 'inactive' : ''}`}>{name}</div>
        <div className={`mt-no-stock-item__price-container ${disabled ? 'inactive' : ''}`}>
          <span className="mt-no-stock-item__price">{price}</span>
          <span className="mt-no-stock-item__price-divider">/</span>
          <span className="mt-no-stock-item__price-piece">{phrases.piece[lang]}</span>
          <div className={`mt-no-stock-item__note ${disabled ? 'inactive' : ''}`}>
            {getNote(reason, lang)}
          </div>
        </div>
      </div>
      <div className="mt-no-stock-item__controls-column">
        {reason === 'out_of_stock' && (
          <div className="mt-no-stock-item__not-available-label">-</div>
        )}
        {reason === 'not_available' && (
          <div className="mt-no-stock-item__not-available-label">-</div>
        )}
        {reason === 'not_enough_quant' && (
          <div className="mt-no-stock-item__not_enough_quant-label">{missingQuant}</div>
        )}
      </div>
    </div>
  );
};
