import React, { useState, useEffect } from 'react'
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native'
import PropTypes from 'prop-types'
import { Switch, Text, Icon } from '../../components'
import { Colors, Metrics, Helpers } from '../../theme'
import { Utils } from '../../utilities'

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: Metrics.small * 1.6,
    backgroundColor: Colors.white,
  },
  itemContainer: {
    paddingVertical: Metrics.small * 1.5,
    paddingRight: Metrics.small * 1.6,
  },
})

const ItemSetting = (props) => {
  const { title, style, toggle, icon, isOn, onSwitchChange, onSelectItem, children } = props
  const [on, setOn] = useState(isOn)

  useEffect(() => {
    setOn(isOn)
  }, [isOn])

  const onSwitch = (onoff) => {
    if (onSwitchChange) {
      onSwitchChange(onoff)
    }
  }
  const onSelect = () => {
    if (onSelectItem) {
      onSelectItem()
    }
  }
  return (
    <TouchableOpacity style={[Helpers.fullWidth, styles.cardContainer]} onPress={() => onSelect()}>
      <View style={[Helpers.rowCross, styles.itemContainer, style]}>
        <View style={{ width: Utils.getRatioDimension(30), alignItems: 'center' }}>
          <Icon name={icon} size={26} color={Colors.primary2} />
        </View>
        <Text
          style={{
            flex: 1,
            color: '#14203F',
            marginLeft: Metrics.tiny,
          }}
        >
          {title}
        </Text>

        {toggle && (
          <Switch
            isOn={on}
            onColor={Colors.primary}
            offColor={Colors.gray}
            size="small"
            onToggle={(val) => onSwitch(val)}
          />
        )}
        {children}
      </View>
    </TouchableOpacity>
  )
}

ItemSetting.defaultProps = {
  toggle: false,
  isOn: false,
}
ItemSetting.propTypes = {
  icon: PropTypes.string,
  isOn: PropTypes.bool,
  title: PropTypes.string.isRequired,
  style: PropTypes.object,
  toggle: PropTypes.bool,
}

export default ItemSetting
