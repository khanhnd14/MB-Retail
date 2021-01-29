import * as React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import { Colors, Metrics } from '../../theme'
import MsbIcon from '../MsbIcon'
import I18n from '../../translations'
import { Text } from '..'

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Metrics.tiny * 2,
    flexDirection: 'row',
  },
  note: {
    color: Colors.gray3,
    marginLeft: Metrics.tiny,
    fontSize: 12
  },
})

const Note = ({ onPress, text, style }) => {
  const onClicked = () => {
    if (onPress) {
      onPress()
    }
  }

  return (
    <TouchableOpacity onPress={onClicked} style={[styles.container, style]}>
      <MsbIcon size={Metrics.tiny * 2} name="icon-internet" color={Colors.gray3} />
      <Text style={styles.note}>{text || I18n.t('action.action_note')}</Text>
    </TouchableOpacity>
  )
}

Note.defaultProps = {
}

Note.propTypes = {
  onPress: PropTypes.func,
  text: PropTypes.string,
}

export default Note
