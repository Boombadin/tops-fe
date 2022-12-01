import React, { Component } from 'react'
import { connect } from 'react-redux'
import RegisHeader from '../../components/RegisHeader'
import Footer from '../../components/Footer'
import { getTranslate } from 'react-localize-redux';
import { Grid } from '../../magenta-ui'
import CompletedContainer from '../../components/CompletedContainer'
import { isLoggedIn } from '../../utils/cookie';
import './Registration.scss'
import MetaTags from '../../components/MetaTags';
import { fullpathUrl } from '../../utils/url';

class RegisCompleted extends Component {
  handleBackClick = () => {
    const { history } = this.props
    history.push('/')
  }

  componentDidMount() {
    if (isLoggedIn()) {
      window.location.replace('/');
    }
  }
  
  render() {
    const {  translate } = this.props

    return (
      <div className="registration-content">
        <MetaTags
            canonicalUrl={fullpathUrl(this.props.location)}
            title={translate('meta_tags.registration_completed.title')}
            keywords={translate('meta_tags.registration_completed.keywords')}
            description={translate('meta_tags.registration_completed.description')}
          />
        <RegisHeader  />
          <div className="regis-wrap">
            <Grid centered columns={2}>
              <div className="regis-form">
                <Grid.Column>
                  <CompletedContainer
                    img="/assets/images/received-email.png"
                    width="107"
                    btnText={translate('regis_completed.button')}
                    onClick={this.handleBackClick}
                  >
                    <div className="content-section center">
                      <p className="title">{translate('regis_completed.text_thanks')} <br/> {translate('regis_completed.text_check_email1')} </p>
                      <p>{translate('regis_completed.text_check_email2')}</p>
                    </div>
                  </CompletedContainer>
                </Grid.Column>
              </div>
            </Grid>
          </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = state => ({
  translate: getTranslate(state.locale)
})

export default connect(mapStateToProps)(RegisCompleted)
