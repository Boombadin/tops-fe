import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getTranslate } from 'react-localize-redux';
import RegisHeader from '../../components/RegisHeader'
import Footer from '../../components/Footer'
import { Grid } from '../../magenta-ui'
import CompletedContainer from '../../components/CompletedContainer'
import './ForgotPassword.scss'
import MetaTags from '../../components/MetaTags';
import { fullpathUrl } from '../../utils/url';

class ForgotPasswordCompleted extends Component {
  handleBackClick = () => {
    const { history } = this.props
    history.push('/')
  }

  render() {
    const {  translate } = this.props

    return (
      <div className="forgot-password-content">
        <MetaTags
          canonicalUrl={fullpathUrl(this.props.location)}
          title={translate('meta_tags.forgot_completed.title')}
          keywords={translate('meta_tags.forgot_completed.keywords')}
          description={translate('meta_tags.forgot_completed.description')}
        />
        <RegisHeader />
        <div className="forgot-password-wrap">
          <Grid centered columns={2}>
            <div className="forgot-form">
              <Grid.Column>
                <CompletedContainer 
                  img="/assets/images/sent-email.png" 
                  width="129"
                  btnText={translate('forgot_password.completed.button')} 
                  onClick={this.handleBackClick}>
                  <div className="content-section center">
                    <p className="title">
                      {translate('forgot_password.completed.title')} <br /> {translate('forgot_password.completed.sub_title')}
                    </p>
                    <p>
                    {translate('forgot_password.completed.desc')}
                    </p>
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
export default connect(mapStateToProps)(ForgotPasswordCompleted)
