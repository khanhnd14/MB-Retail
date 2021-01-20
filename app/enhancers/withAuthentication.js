import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { AuthScreen, AuthByPin } from '../screens'
import { appTypes } from '../state/application'

export default function withAuthentication(WrappedComponent) {
  const WithAuthentication = (props) => {
    const { isAuthen, loginSecurityType } = props
    if (isAuthen) {
      if (loginSecurityType === appTypes.SECURITY_TYPE.PIN) {
        return <AuthByPin {...props} />
      }
        return <AuthScreen {...props} />
    }

    return <WrappedComponent {...props} />
  }

  const { bool } = PropTypes
  WithAuthentication.propTypes = {
    isAuthen: bool.isRequired,
  }

  const mapStateToProps = (state) => ({
    isAuthen: state.application.isTimeout,
    loginSecurityType: state.user.loginSecurityType,
  })

  return connect(mapStateToProps)(WithAuthentication)
}
