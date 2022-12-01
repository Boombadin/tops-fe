import React from "react";
import PropTypes from "prop-types";
import { get as prop } from 'lodash';
import DeliveryIcon from "../Icons/Delivery";
import "./PromotionIndicator.scss";

const PromotionIndicator = ({ totals, limit, className }) => {
  const current = prop(totals, 'base_grand_total', 0);
  let percent = (current / limit) * 100;

  if (percent > 100) {
    percent = 100;
  }

  let diffTotal = limit - current;

  if (diffTotal <= 0) {
    diffTotal = 0;
  }

  return (
    <div className={`mt-promotion-indicator-root ${className}`}>
      <div className="mt-promotion-indicator-content">
        <DeliveryIcon />
        <div className="mt-promotion-indicator-wrapper">
          <div className="mt-promotion-indicator-text">
            ช็อปอีก {diffTotal} บาท จะฟรีค่าจัดส่งค่ะ
          </div>
          <div className="mt-promotion-indicator-scale">
            <div
              style={{ width: `${percent}%` }}
              className="mt-promotion-indicator-filled"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

PromotionIndicator.propTypes = {
  percent: PropTypes.number,
  className: PropTypes.string
};

PromotionIndicator.defaultProps = {
  percent: 0,
  className: ""
};

export default PromotionIndicator;
