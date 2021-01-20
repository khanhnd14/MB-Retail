import * as React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import I18n from 'i18n-js'
import Icon from '../MsbIcon'
import Text from '../MsbText'
import { Colors, ApplicationStyles, Helpers, Metrics } from '../../theme'

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: '#F8884D',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: '#FB6719',
    right: 0,
  },
})

const BenefitHiddenItem = (props) => {
  const { onDelete, onPress, onTransfer, data } = props

  const transfer = () => {
    if (onTransfer) {
      onTransfer()
    }
  }

  const remove = () => {
    if (onDelete) {
      onDelete()
    }
  }

  return (
    <View style={styles.rowBack}>
      <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnLeft]} onPress={() => transfer()}>
        <Icon name="icon-chuyenkhoan" color={Colors.white} size={20} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={() => remove()}>
        <Icon name="delete" color={Colors.white} size={20} />
      </TouchableOpacity>
    </View>
  )
}

BenefitHiddenItem.defaultProps = {
}

BenefitHiddenItem.propTypes = {
  data: PropTypes.object,
  onTransfer: PropTypes.func,
  onDelete: PropTypes.func,
}
export default BenefitHiddenItem
