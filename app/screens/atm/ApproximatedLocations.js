import React, { forwardRef, useCallback, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import RBSheet from 'react-native-raw-bottom-sheet'
import { ItemBranchBank } from './ItemBranchBank'
import { Utils } from '../../utilities'
import { Text } from '../../components'
import i18n from '../../translations'
import ListFullOption from '../../components/List/ListFullOption'

const styles = StyleSheet.create({
  empty: {
    paddingVertical: Utils.getRatioDimension(10),
    alignItems: 'center',
  },
})
export const ApproximatedLocations = forwardRef(
  (
    {
      filterBranch,
      currentLatitude,
      currentLongitude,
      animateToLocation,
      sheetRef,
      setFilterMakers,
      onClose,
    },
    ref
  ) => {
    const [branches, setBranches] = useState([])
    useEffect(() => {
      if (filterBranch) {
        setBranches(filterBranch)
      }
    }, [filterBranch])
    const renderList = useCallback(
      (isFavorite, item, index, onPress) => {
        if (item) {
          return (
            <ItemBranchBank
              item={item}
              index={index}
              key={index}
              currentLatitude={currentLatitude}
              currentLongitude={currentLongitude}
              animateToLocation={animateToLocation}
              sheetRef={sheetRef}
              setFilterMakers={setFilterMakers}
              filterBranch={filterBranch}
              onClose={() => sheetRef?.current?.close()}
            />
          )
        }
        return null
      },
      [sheetRef, filterBranch]
    )
    const renderEmptyList = useCallback(
      () => (
        <View style={styles.empty}>
          <Text>{i18n.t('product.atm.empty_branch')}</Text>
        </View>
      ),
      []
    )
    return (
      <RBSheet
        ref={ref}
        height={Utils.getRatioDimension(400)}
        minClosingHeight={Utils.getRatioDimension(230)}
        customStyles={{
          container: {
            borderTopRightRadius: Utils.getRatioDimension(22),
            borderTopLeftRadius: Utils.getRatioDimension(22),
          },
        }}
      >
        <ListFullOption
          noRefresh
          data={branches}
          showsVerticalScrollIndicator={false}
          renderSubItem={renderList}
          ListEmptyComponent={renderEmptyList}
          loadMore={false}
        />
      </RBSheet>
    )
  }
)
