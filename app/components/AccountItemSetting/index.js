import * as React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import MsbText from '../MsbText'
import AmountLabel from '../AmountLabel'
import Radio from '../MsbRadio'
import { Metrics, Colors, Helpers } from '../../theme'

const styles = StyleSheet.create({
  smallLabel: {
    color: '#4F4F4F',
    marginRight: 5,
  },
  name: {
    color: Colors.textBlack,
    marginVertical: Metrics.tiny,
  },
  benificaryAccountItem: {
    flexDirection: 'row',
    marginHorizontal: Metrics.small * 1.8,
    marginBottom: Metrics.small,
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: Metrics.normal,
    paddingVertical: Metrics.normal,
  },
  benificaryAccountItemInner: {
    flexDirection: 'row',
    flex: 4,
  },
  benificaryAccountItemPrimaryInfo: {
    fontWeight: 'bold',
    color: Colors.primary2,
  },
})

const AccountItemSetting = (props) => {
  const { item, checked, onSelectItem } = props

  const onSelect = () => {
    if (onSelectItem) {
      onSelectItem()
    }
  }

  return (
    <TouchableOpacity onPress={() => onSelect()}>
      <View style={styles.benificaryAccountItem}>
        <View style={Helpers.fillCenter}>
          <Radio checked={checked} onPress={() => {}} />
        </View>
        <View style={styles.benificaryAccountItemInner}>
          <View style={{ flex: 1 }}>
            <MsbText style={styles.benificaryAccountItemPrimaryInfo}>{item.alias}</MsbText>
            <MsbText style={styles.name}>{`${item.accountInString} - ${item.acctName}`}</MsbText>
            <View style={Helpers.rowCross}>
              <AmountLabel style={styles.smallLabel} value={item.availableBalance} />
              <MsbText style={styles.smallLabel}>{item?.currencyCode}</MsbText>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

AccountItemSetting.defaultProps = {
  checked: false,
}

AccountItemSetting.propTypes = {
  checked: PropTypes.bool,
  onSelectItem: PropTypes.func
}

export default AccountItemSetting
