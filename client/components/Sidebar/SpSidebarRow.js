import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../../magenta-ui';

const SpSidebarRow = ({
  type,
  title,
  link,
  icon,
  onPressPusher,
  children,
  classname,
  onClick,
}) => {
  if (type === 'link') {
    return (
      <div className={`sp-sidebar__row ${classname}`}>
        <div className="sp-sidebar__link" onClick={onClick}>
          <span className="icon left">
            <img src={icon} alt={title} />
          </span>
          <span className="title">{title}</span>
        </div>
      </div>
    );
  } else if (type === 'window') {
    return (
      <div className={`sp-sidebar__row ${classname}`}>
        <a
          className="sp-sidebar__link"
          href={link}
          target="_blank"
          onClick={onClick}
        >
          <span className="icon left">
            <img src={icon} alt={title} />
          </span>
          <span className="title">{title}</span>
        </a>
      </div>
    );
  } else if (type === 'header') {
    return (
      <div className={`sp-sidebar__row ${classname}`}>
        <div className="sp-sidebar__title">{title}</div>
      </div>
    );
  } else if (type === 'pusher') {
    return (
      <div className={`sp-sidebar__row ${classname}`}>
        <button className="sp-sidebar__link" onClick={onPressPusher}>
          <span className="icon left">
            <img src={icon} alt={title} />
          </span>
          <span className="title">{title}</span>
          <Icon name="chevron right" />
        </button>
      </div>
    );
  }
  return <div className={`sp-sidebar__row ${classname}`}>{children}</div>;
};

SpSidebarRow.propTypes = {
  type: PropTypes.string,
  title: PropTypes.string,
  link: PropTypes.string,
  icon: PropTypes.string,
  onPressPusher: PropTypes.func,
  children: PropTypes.node,
  classname: PropTypes.string,
  onClick: PropTypes.func,
};

SpSidebarRow.defaultProps = {
  title: '',
  classname: '',
  children: '',
  link: '',
  icon: '',
  type: '',
  onPressPusher: () => null,
  onClick: () => null,
};

export default SpSidebarRow;
