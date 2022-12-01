import React, { PureComponent } from 'react'
import pt from 'prop-types'
import { format } from '../../utils/time'
import ArrowLeft from '../Icons/ArrowLeft'
import ArrowRight from '../Icons/ArrowRight'
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
    translate: pt.func.isRequired,
  }

  static defaultProps = {
    defaultValue: '',
    controlled: false,
    activeIndex: ''
  }

  state = { activeIntervalIndex: this.props.defaultValue }

  handleBackClick = () => {
    if (this.props.controlled) {
      const newIdx = this.props.activeIndex - 1

      return this.props.onIntervalChange(newIdx, this.props.intervals[newIdx], this.props.intervals)
    }
    const newIdx = this.state.activeIntervalIndex - 1

    this.setState({
      activeIntervalIndex: newIdx
    })
    return this.props.onIntervalChange(newIdx, this.props.intervals[newIdx], this.props.intervals)
  }

  handleForwardClick = () => {
    if (this.props.controlled) {
      const newIdx = this.props.activeIndex + 1

      return this.props.onIntervalChange(newIdx, this.props.intervals[newIdx], this.props.intervals)
    }
    const newIdx = this.state.activeIntervalIndex + 1

    this.setState({
      activeIntervalIndex: newIdx
    })
    return this.props.onIntervalChange(newIdx, this.props.intervals[newIdx], this.props.intervals)
  }

  render() {
    const idx = this.props.controlled ? this.props.activeIndex : this.state.activeIntervalIndex
    const interval = this.props.intervals[idx]
    const lang = this.props.lang
    const isSameYear = format(interval.intervalStart, 'YYYY', lang) === format(interval.intervalEnd, 'YYYY', lang)
    const dateStart = format(new Date(), 'YYYY-MM-DD', lang) === interval.intervalStart 
      ? this.props.translate('timeslot.grid.today') 
      : `
        ${format(interval.intervalStart, 'DD MMM', lang)} 
        ${!isSameYear ? lang === 'th_TH' ? Number(format(interval.intervalEnd, 'YYYY', lang)) + 543 : format(interval.intervalEnd, 'YYYY', lang) : ''}`

    return (
      <div className="timeslotswitch">
        {idx !== 0 ? (
          <div className="timeslotswitch__left-arrow" onClick={this.handleBackClick}>
            <ArrowLeft width="15" height="15" />
          </div>
        ) : (
          <div className="timeslotswitch__left-arrow" />
        )}
        {`${dateStart} - ${format(interval.intervalEnd, 'DD MMM', lang)} ${lang === 'th_TH' ? Number(format(interval.intervalEnd, 'YYYY', lang)) + 543 : format(interval.intervalEnd, 'YYYY', lang)}`}
        {idx !== this.props.intervals.length - 1 ? (
          <div className="timeslotswitch__right-arrow" onClick={this.handleForwardClick}>
            <ArrowRight width="15" height="15" />
          </div>
        ) : (
          <div className="timeslotswitch__right-arrow" />
        )}
      </div>
    )
  }
}

export default TimeslotDaysIntervalSwitch
