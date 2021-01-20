import * as React from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import _ from 'lodash'
import I18n from '../../translations'
import Button from '../MsbButton'
import Text from '../MsbText'
import { Colors, ApplicationStyles, Metrics } from '../../theme'
import { Utils } from '../../utilities'

const ConfirmButton = (props) => {
  const {
    text,
    onPress,
    loading,
    style,
    styleButton,
    disabled,
    color,
    styleText,
    textColor,
    indicatorStyle
  } = props

  const onClick = () => {
    if (onPress) {
      onPress()
    }
  }
  const styles = _.assign(
    { width: Utils.getWindowWidth() - Metrics.medium * 2, backgroundColor: color || Colors.primary2 },
    styleButton
  )
  return (
    <View style={[ApplicationStyles.confirmContainer, style]}>
      <Button
        onPress={onClick}
        loading={loading}
        style={[ApplicationStyles.btnPrimary, styles]}
        color={color || Colors.primary2}
        disabled={disabled}
        indicatorStyle={indicatorStyle}
      >
        <Text
          style={[
            {
              color: textColor || Colors.white,
              fontWeight: 'bold',
              fontSize: 15,
            },
            styleText,
          ]}
        >
          {text === null ? I18n.t('action.action_continue').toUpperCase() : text.toUpperCase()}
        </Text>
      </Button>
    </View>
  )
}

ConfirmButton.defaultProps = {
  text: null,
  onPress: null,
  loading: false,
}

ConfirmButton.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.func,
  loading: PropTypes.bool,
  color: PropTypes.string,
  textColor: PropTypes.string,
  disabled: PropTypes.bool,
}
export default ConfirmButton
