import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import PropsMapper from './PropsMapper';
import { langSelector } from '../../selectors';

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  lang: langSelector(state),
});

export default connect(mapStateToProps)(PropsMapper);
