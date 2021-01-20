import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import I18n from 'i18n-js'
import Button from '../MsbButton'
import Text from '../MsbText'
import { Colors, ApplicationStyles, Helpers, Metrics } from '../../theme'

const styles = StyleSheet.create({
  btnWhite: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 38,
    paddingVertical: Metrics.small * 0.9,
    paddingHorizontal: Metrics.medium * 1.5
  },
})
const ConfirmButtonWhite = (props) => {
  const { text, onPress, loading, style } = props

  const onClick = () => {
    if (onPress) {
      onPress()
    }
  }

  return (
    <View style={[ApplicationStyles.confirmContainer, style]}>
      <Button
        onPress={onClick}
        loading={loading}
        style={[Helpers.contentWidth, styles.btnWhite]}
        color={Colors.primary2}
      >
        <Text style={{ color: '#333333', fontWeight: 'bold', fontSize: 15 }}>
          {text.toUpperCase()}
        </Text>
      </Button>
    </View>
  )
}

ConfirmButtonWhite.defaultProps = {
  text: I18n.t('action.action_continue'),
  onPress: null,
  loading: false,
}

ConfirmButtonWhite.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.func,
  loading: PropTypes.bool,
}
export default ConfirmButtonWhite
