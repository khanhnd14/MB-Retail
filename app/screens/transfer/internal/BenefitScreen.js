import React, { Fragment, useState, useEffect } from 'react'
import { View, StyleSheet, SectionList, TouchableHighlight } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { Helpers, Metrics, Colors } from '../../../theme'
import { Topbar, Text, TextInput, ConfirmButton } from '../../../components'
import * as Navigation from '../../../navigation'
import { transferOperations, transferSelectors } from '../../../state/transfer'
import I18n from '../../../translations'
import { Utils } from '../../../utilities'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
  },
  searchTitle: {
    color: Colors.primary2,
    fontWeight: 'bold',
    paddingTop: Metrics.small * 1.1,
    paddingBottom: Metrics.small * 0.8,
  },
  searchInput: {
    borderBottomColor: Colors.line,
    borderBottomWidth: 1,
    paddingVertical: Metrics.small,
  },
  contentContainer: {
    marginHorizontal: Metrics.small * 1.8,
    flex: 1,
  },
  content: {
    paddingVertical: Metrics.normal,
    backgroundColor: Colors.white,
    paddingHorizontal: Metrics.small * 1.6,
  },
  contentRadius: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  line: {
    height: 1,
    backgroundColor: Colors.line,
  },
  itemContainer: {
    height: Metrics.medium,
    marginHorizontal: Metrics.normal,
    justifyContent: 'center',
  },
  sectionContainer: {
    justifyContent: 'flex-end',
    paddingVertical: Metrics.small * 0.8,
  },
  sectionHeader: {
    fontWeight: 'bold',
    color: Colors.primary2,
  },
  list: {
    flex: 1,
    paddingHorizontal: Metrics.small,
    backgroundColor: Colors.white,
  },
  itemContent: {
    paddingVertical: Metrics.small,
    color: '#4F4F4F',
  },
})
let timeOut = false

const BenefitScreen = ({ route }) => {
  const dispatch = useDispatch()
  const { selectedAcc } = route.params
  const { beneficiaryN, benefitSelected, benefitSelectedError } = useSelector(
    (state) => state.transfer
  )
  const [textSearch, setTextSearch] = useState('')
  const [listBeneficiary, setListBeneficiary] = useState({})
  const [listData, setListData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const category = transferSelectors.getBeneficiaryInternal(selectedAcc, beneficiaryN)
    setListBeneficiary(category)
    setListData(transferSelectors.filterDatasource('', category))
  }, [beneficiaryN])

  useEffect(() => {
    if (!Utils.isStringEmpty(textSearch)) {
      setLoading(false)
      Navigation.pop()
    }
  }, [benefitSelected])

  useEffect(() => {
    if (!Utils.isStringEmpty(textSearch)) {
      setLoading(false)
    }
  }, [benefitSelectedError])

  const selectBenefit = (data) => {
    setLoading(true)
    setTextSearch(data.beneficiaryAccountNo)
    const params = {
      toBenefitAcc: data.beneficiaryAccountNo,
    }
    dispatch(transferOperations.getAccInternal(params))
  }

  const queryBenefitAccount = () => {
    if (Utils.isStringEmpty(textSearch)) {
      Utils.toast(I18n.t('application.input_empty'))
      return
    }
    setLoading(true)
    const params = {
      toBenefitAcc: textSearch,
    }
    dispatch(transferOperations.getAccInternal(params))
  }

  const renderSeparator = () => <View style={styles.line} />

  const renderItem = ({ item }) => (
    <TouchableHighlight
      style={[styles.content, { paddingVertical: 0 }]}
      onPress={() => selectBenefit(item)}
      underlayColor="#ddd"
    >
      <Text style={styles.itemContent}>
        {item.beneficiaryAccountNo} - {item.beneficiaryAlias}
      </Text>
    </TouchableHighlight>
  )

  const renderSectionHeader = ({ section }) => {
    const isEmpty = Utils.isArrayEmpty(section.data)
    const { category } = section
    return (
      <View>
        {!isEmpty && (
          <View style={[styles.sectionContainer]}>
            <Text style={[styles.sectionHeader]}> {category} </Text>
          </View>
        )}
      </View>
    )
  }

  const search = (text) => {
    setTextSearch(text)
    if (timeOut) {
      clearTimeout(timeOut)
    }
    timeOut = setTimeout(() => {
      const lists = transferSelectors.filterDatasource(text, listBeneficiary)
      setListData(lists)
    }, 300)
  }

  return (
    <Fragment>
      <Topbar title={I18n.t('transfer.title')} subTitle={I18n.t('transfer.title_benefit')} />
      <View style={[Helpers.fill, styles.container]}>
        <View style={styles.contentContainer}>
          <View style={styles.content}>
            <View style={styles.searchInput}>
              <TextInput
                placeholderTextColor={Colors.holder}
                autoCorrect={false}
                autoFocus={false}
                placeholder={I18n.t('transfer.input_benefit')}
                value={textSearch}
                onChangeText={search}
                onSubmitEditing={() => {}}
                maxLength={30}
                returnKeyType="done"
                underlineColorAndroid="transparent"
              />
            </View>
          </View>

          <SectionList
            styles={styles.list}
            sections={listData}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            renderSectionHeader={renderSectionHeader}
            ItemSeparatorComponent={renderSeparator}
            enableEmptySections
            keyExtractor={(item, index) => `${index}`}
            removeClippedSubviews={false}
            stickySectionHeadersEnabled={false}
          />
        </View>
        <ConfirmButton onPress={() => queryBenefitAccount()} loading={loading} />
      </View>
    </Fragment>
  )
}
export default BenefitScreen
