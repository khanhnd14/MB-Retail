import React, { forwardRef, useState, useEffect } from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { FlatList } from 'react-native-gesture-handler';
import { Metrics, Colors, Helpers } from '../../../theme'
import { Text, BottomSheet, SearchInput } from '../../../components'
import I18n from '../../../translations'
import { Utils } from '../../../utilities'
import { transferSelectors, transferOperations } from '../../../state/transfer'

const styles = StyleSheet.create({
  content: {
    height: 600,
    width: '100%',
    paddingHorizontal: Metrics.medium,
    paddingBottom: Metrics.medium,
  },
  line: {
    height: 1,
    backgroundColor: Colors.line,
  },
})
var timeOut
const BankBranchScreen = forwardRef((props, ref) => {
  const dispatch = useDispatch()
  const { listBranch } = useSelector((state) => state.transfer)
  const [textSearch, setTextSearch] = useState('')
  const [lists, setData] = useState(listBranch)

  useEffect(() => {
    setData(listBranch)
  }, [listBranch])

  useEffect(() => {
    transferSelectors.formatBranch(listBranch)
  }, [listBranch])

  const onSelectBank = (item) => {
    dispatch(transferOperations.selectBranch(item))
    ref.current && ref.current.hide()
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => onSelectBank(item)}
      style={[Helpers.rowCross, { padding: Metrics.small }]}
    >
      <Text>{item.bankOrgName}</Text>
    </TouchableOpacity>
  )
  const renderSeparator = () => <View style={styles.line} />

  const search = (val) => {
    setTextSearch(val)
    if (timeOut) {
      clearTimeout(timeOut)
    }
    timeOut = setTimeout(() => {
      const listData = transferSelectors.filterBankBranch(val, listBranch)
      setData(listData)
    }, 300)
  }

  const onReset = () => {
    setTextSearch('')
    setData(listBranch)
  }

  const renderContent = () => (
    <View style={{ paddingHorizontal: Metrics.medium, paddingBottom: Metrics.medium * 2.5 }}>
      <SearchInput value={textSearch} onChangeText={search} onSubmitEditing={() => {}} />
      {!Utils.isArrayEmpty(lists) && (
      <FlatList
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={renderSeparator}
        data={lists}
        keyExtractor={(item, index) => `${index}`}
        renderItem={renderItem}
      />
        )}
    </View>
  )

  return (
    <BottomSheet
      onCloseEnd={onReset}
      snapPoint={Metrics.medium * 30}
      title={I18n.t('transfer.title_branch')}
      ref={ref}
    >
      {renderContent()}
    </BottomSheet>
  )
})

export default BankBranchScreen
