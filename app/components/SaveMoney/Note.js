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

const Note = ({ onPress, text }) => {
  const onClicked = () => {
    if (onPress) {
      onPress()
    }
  }

  return (
    <TouchableOpacity onPress={onClicked} style={styles.container}>
      <MsbIcon size={Metrics.tiny * 2} name="icon-internet" color={Colors.gray3} />
      <Text style={styles.note}>{text}</Text>
    </TouchableOpacity>
  )
}

Note.defaultProps = {
  text: I18n.t('action.action_note')
}

Note.propTypes = {
  onPress: PropTypes.func,
  text: PropTypes.string,
}

export default Note
