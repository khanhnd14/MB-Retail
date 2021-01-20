import haversine from 'haversine'
import React, { useMemo } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import _ from 'lodash'
import { useDispatch } from 'react-redux'
import { Utils } from '../../utilities'
import { Colors } from '../../theme'
import { Icon, Text } from '../../components'
import { atmOperations } from '../../state/atm'

const DEBOUNCE_MARKER = 50
const styles = StyleSheet.create({
  branchContainer: {
    paddingHorizontal: Utils.getRatioDimension(16),
    paddingTop: Utils.getRatioDimension(16),
    backgroundColor: Colors.white,
  },
  branchChild: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray4,
    paddingHorizontal: Utils.getRatioDimension(10),
    paddingBottom: Utils.getRatioDimension(10),
  },
  branch: {
    fontSize: 14,
    marginBottom: Utils.getRatioDimension(8),
  },
  branchName: {
    color: Colors.darkBlue,
  },
})

export const ItemBranchBank = ({
  item,
  index,
  currentLongitude,
  currentLatitude,
  animateToLocation,
  sheetRef,
  onClose,
  setFilterMakers,
  filterBranch,
}) => {
  const dispatch = useDispatch()
  // const distance = useMemo(
  //   () =>
  //     haversine(
  //       {
  //         latitude: currentLatitude,
  //         longitude: currentLongitude,
  //       },
  //       item.coordinate,
  //       { unit: 'meter' }
  //     ),
  //   [item]
  // )

  const onChoiceLocation = () => {
    // dispatch(atmOperations.selectBranch(item))
    // if (index >= DEBOUNCE_MARKER) {
    //   // lấy 100 thằng tiếp theo từ vị trí click
    //   setFilterMakers(filterBranch.slice(index, index + DEBOUNCE_MARKER))
    //   _.debounce(() => {
    //     animateToLocation(item.coordinate)
    //     onClose?.()
    //     sheetRef.close()
    //   }, 500)()
    //   return
    // }
    onClose()
    animateToLocation(item)
  }
  return (
    <TouchableOpacity onPress={onChoiceLocation} style={styles.branchContainer}>
      <View style={styles.branchChild}>
        <Text style={[styles.branch, styles.branchName]}>{item?.name?.trim()}</Text>
        <Text style={[styles.branch, styles.branchName]}>{item?.comments?.trim()}</Text>
      </View>
    </TouchableOpacity>
  )
}
