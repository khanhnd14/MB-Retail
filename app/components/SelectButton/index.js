/* eslint-disable no-mixed-operators */
import * as React from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native'
import PropTypes from 'prop-types'
import { Colors, Metrics } from '../../theme'
import Text from '../MsbText'
import MsbIcon from '../MsbIcon'
import { Utils } from '../../utilities'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingVertical: Metrics.small,
    borderBottomColor: Colors.line,
    borderBottomWidth: 1,
  },
  title: {
    color: Colors.primary2,
    fontSize: 12,
    fontWeight: 'bold',
    paddingVertical: Utils.getRatioDimension(8),

  },
  contentLayout: {
    paddingVertical: Utils.getRatioDimension(8),
    alignItems: 'center',
    flexDirection: 'row',
  },
  label: {
    color: Colors.textBlack,
    flex: 1,
    fontStyle: 'italic'
  },
  labelReadOnly: {
    color: '#8E8E93',
    flex: 1,
    fontStyle: 'italic'
  },
  accountContainer: {
    flexDirection: 'row',
    width: '90%',
  },
  content: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
  },
  view: {
    margin: 0,
    justifyContent: 'flex-end',
  },
})

const SelectButton = ({ data, onPress, defaultValue, title, titleModal, hideTitle, isTouchDisable, readOnly }) => {
  const onClick = () => {
    if (onPress) {
      onPress()
    }
  }

  return (
    <TouchableOpacity disabled={readOnly} onPress={onClick}>
      <View style={styles.container}>
        {!hideTitle && (
          <Text style={styles.title}>
            {title}
          </Text>
        )}
        <View style={styles.contentLayout}>
          <Text style={readOnly ? styles.labelReadOnly : styles.label}>{defaultValue}</Text>
          {!readOnly && <MsbIcon name="icon-detail" size={18} color={Colors.primary2} />}
        </View>
      </View>
    </TouchableOpacity>
  )
}

SelectButton.defaultProps = {
  data: [],
  defaultValue: '',
  title: 'Vui lòng chọn',
  titleModal: null,
  hideTitle: false,
  readOnly: false
}

SelectButton.propTypes = {
  data: PropTypes.array,
  onPress: PropTypes.func,
  defaultValue: PropTypes.string,
  title: PropTypes.string,
  titleModal: PropTypes.string,
  hideTitle: PropTypes.bool,
  readOnly: PropTypes.bool
}
export default SelectButton
