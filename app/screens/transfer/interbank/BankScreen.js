import React, { forwardRef, useState, useEffect } from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { FlatList } from 'react-native-gesture-handler'
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
const BankScreen = forwardRef((props, ref) => {
  const { data, type, selectBranch } = props
  const dispatch = useDispatch()
  const { listBranch } = useSelector((state) => state.transfer)
  const [textSearch, setTextSearch] = useState('')
  const [lists, setData] = useState(data)
  useEffect(() => {
    setData(data)
  }, [data])

  useEffect(() => {
    transferSelectors.formatBranch(listBranch)
  }, [listBranch])

  const onSelectBank = (item) => {
    dispatch(transferOperations.selectBank(item))
    const body = {
      bankNo: item.bankNo,
    }
    dispatch(transferOperations.getListBankBranch(body))
    if (selectBranch) {
      selectBranch()
    }
    ref.current && ref.current.hide()
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => onSelectBank(item)}
      style={[Helpers.rowCross, { padding: Metrics.small }]}
    >
      <Text>{item.bankName}</Text>
    </TouchableOpacity>
  )

  const renderSeparator = () => <View style={styles.line} />

  const search = (val) => {
    setTextSearch(val)
    if (timeOut) {
      clearTimeout(timeOut)
    }
    timeOut = setTimeout(() => {
      const listData = transferSelectors.filterBanks(val, data)
      setData(listData)
    }, 300)
  }

  const onCloseEnd = () => {
    setTextSearch('')
    setData(data)
  }

  const renderContent = () => (
    <View style={{ paddingHorizontal: Metrics.medium, paddingBottom: Metrics.medium * 2.5 }}>
      <SearchInput value={textSearch} onChangeText={search} onSubmitEditing={() => {}} />
      {!Utils.isArrayEmpty(lists) && (
        <FlatList
          style={{ zIndex: 1 }}
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
      onCloseEnd={onCloseEnd}
      snapPoint={Metrics.medium * 30}
      title={I18n.t('transfer.title_bank')}
      ref={ref}
    >
      {renderContent()}
    </BottomSheet>
  )
})

BankScreen.defaultProps = {
  data: [],
  type: '',
}

BankScreen.propTypes = {
  data: PropTypes.array,
  type: PropTypes.string,
  selectBranch: PropTypes.func,
}

export default BankScreen
