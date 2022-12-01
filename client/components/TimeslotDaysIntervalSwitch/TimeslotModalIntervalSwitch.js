import React, { PureComponent } from 'react'
import pt from 'prop-types'
import cx from 'classnames'
import { map } from 'lodash'
import { format } from '../../utils/time'
import './TimeslotDaysIntervalSwitch.scss'

/* eslint-disable jsx-a11y/click-events-have-key-events,
jsx-a11y/no-noninteractive-element-interactions,
jsx-a11y/no-static-element-interactions */

class TimeslotDaysIntervalSwitch extends PureComponent {
  static propTypes = {
    defaultValue: pt.oneOfType([pt.string, pt.number]),
    activeIndex: pt.oneOfType([pt.string, pt.number]),
    controlled: pt.bool,    
    intervals: pt.arrayOf(
      pt.shape({
        intervalStart: pt.string,
        intervalEnd: pt.string,
        id: pt.oneOfType([pt.string, pt.number])
      })
    ).isRequired,
    onIntervalChange: pt.func.isRequired,
    lang: pt.string.isRequired,
    translate: pt.func.isRequired
  }

  static defaultProps = {
    defaultValue: '',
    controlled: false,
    activeIndex: ''
  }

  state = { activeIntervalIndex: this.props.defaultValue }

  handleChangeActiveInterval = newActiveIndex => {
    if (this.props.controlled) {
      return this.props.onIntervalChange(
        newActiveIndex,
        this.props.intervals[newActiveIndex],
        this.props.intervals
      )
    }

    this.setState({
      activeIntervalIndex: newActiveIndex
    })
    return this.props.onIntervalChange(newActiveIndex, this.props.intervals[newActiveIndex], this.props.intervals)
  }

  render() {
    const idx = this.props.controlled
      ? this.props.activeIndex
      : this.state.activeIntervalIndex
    const lang = this.props.lang
      
    return (
      <div className="timeslotmodalswitch">
        {map(this.props.intervals, (interval, i) => (
          <div
            className={cx('timeslotmodalswitch-interval', { active: idx === i })}
            onClick={() => this.handleChangeActiveInterval(i)}
          >
            {`
              ${format(new Date(), 'YYYY-MM-DD', lang) === interval.intervalStart 
                ? this.props.translate('timeslot.grid.today') 
                : format(interval.intervalStart, 'DD MMM', lang)                
              } 
              ${
                !(format(interval.intervalStart, 'YYYY', lang) === format(interval.intervalEnd, 'YYYY', lang))
                ? lang === 'th_TH' 
                  ? Number(format(interval.intervalEnd, 'YYYY', lang)) + 543 
                  : format(interval.intervalEnd, 'YYYY', lang) 
                : ''
              }
              - 
              ${format(interval.intervalEnd, 'DD MMM', lang)} 
              ${lang === 'th_TH' ? Number(format(interval.intervalEnd, 'YYYY', lang)) + 543 : format(interval.intervalEnd, 'YYYY', lang)}`
            }
          </div>
        ))}
        
        
      </div>
    )
  }
}

export default TimeslotDaysIntervalSwitch
