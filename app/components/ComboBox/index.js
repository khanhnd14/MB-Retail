import React, { useState, forwardRef } from 'react'
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import { Colors, Metrics, Helpers } from '../../theme'
import BottomSheet from '../BottomSheet'
import { Utils } from '../../utilities'

const styles = StyleSheet.create({
  container: {},
  line: {
    backgroundColor: Colors.line,
    height: StyleSheet.hairlineWidth,
  }
})

const ComboBox = forwardRef(({ data, onSelect, title }, ref) => {
  const close = () => {
    ref.current && ref.current.hide()
  }

  const onSelectItem = (item) => {
    close()
    if (onSelect) {
      onSelect(item)
    }
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => onSelectItem(item)}
      style={[Helpers.rowCross, { paddingVertical: Metrics.small }]}
    >
      <Text>{item.display}</Text>
    </TouchableOpacity>
  )

  const renderSeparator = () => <View style={styles.line} />

  return (
    <BottomSheet
      onCloseEnd={close}
      snapPoint={400}
      title={title}
      ref={ref}
    >
      {!Utils.isArrayEmpty(data) && (
      <FlatList
        style={{ paddingHorizontal: Metrics.medium * 2 }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={renderSeparator}
        data={data}
        keyExtractor={(item, index) => `${index}`}
        renderItem={renderItem}
      />
        )}
    </BottomSheet>

  )
})

ComboBox.defaultProps = {
  data: [],
  title: '',
}

ComboBox.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string,
  onSelect: PropTypes.func,
}

export default ComboBox
