import { connect } from 'react-redux'
import { getTranslate } from 'react-localize-redux'
import TimeslotDaysIntervalSwitch from './TimeslotDaysIntervalSwitch'
import ModalSwitch from './TimeslotModalIntervalSwitch'
import { langSelector } from '../../selectors'

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  lang: langSelector(state)
})

export const TimeslotModalIntervalSwitch = connect(mapStateToProps)(ModalSwitch)

export default connect(mapStateToProps)(TimeslotDaysIntervalSwitch)
