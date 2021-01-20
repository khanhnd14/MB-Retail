import React, { Fragment, useState, useEffect, useRef } from 'react'
import { View, StyleSheet, SectionList, TouchableHighlight, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import { Helpers, Metrics, Colors } from '../../../theme'
import { Topbar, Text, TextInput, ConfirmButton, Icon } from '../../../components'
import * as Navigation from '../../../navigation'
import { transferOperations, transferSelectors } from '../../../state/transfer'
import I18n from '../../../translations'
import { Utils } from '../../../utilities'
import BankScreen from './BankScreen'
import BankBranchScreen from './BankBranchScreen'

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
    fontSize: 16,
  },
  element: {
    ...Helpers.rowCross,
    backgroundColor: Colors.white,
    paddingVertical: Metrics.medium,
    borderTopColor: Colors.line,
    borderTopWidth: 1,
  },
  title: {
    color: Colors.primary2,
    fontWeight: 'bold',
    paddingVertical: Metrics.tiny / 2,
  },
  contentBold: {
    color: Colors.textBlack,
    fontWeight: 'bold',
    paddingVertical: Metrics.tiny,
  },
})
let timeOut = false

const BenefitInterbank = ({ route }) => {
  const dispatch = useDispatch()
  const { selectedAcc, type } = route.params
  const {
    beneficiaryS,
    beneficiaryY,
    toBenefitBank,
    toBenefitBranch,
    benefitSelected,
    benefitSelectedError,
    listBank,
    listBankSML,
  } = useSelector((state) => state.transfer)
  const { beneficiaryAccountNo, beneficiaryName } = benefitSelected || {}
  const [listBeneficiary, setListBeneficiary] = useState({})
  const [listData, setListData] = useState([])
  const [benefitAcc, setBenefitAcc] = useState(beneficiaryAccountNo || '')
  const [loading, setLoading] = useState(false)
  const [accountName, setAccountName] = useState(beneficiaryName || '')

  const sheetBank = useRef(null)
  const sheetBranch = useRef(null)

  useEffect(() => {
    var listBenefit = []
    // Nội bộ hoặc thường
    if (type === 'N' || type === 'Y') {
      listBenefit = beneficiaryY
    } else if (type === 'A') {
      // nhanh
      listBenefit = _.filter(beneficiaryS, (acc) => acc.beneficiaryBankAddress !== 'cardType')
    } else if (type === 'C') {
      // Thẻ
      listBenefit = _.filter(beneficiaryS, (acc) => acc.beneficiaryBankAddress === 'cardType')
    }
    const category = transferSelectors.getBeneficiaryInternal(selectedAcc, listBenefit)
    setListBeneficiary(category)
    setListData(transferSelectors.filterDatasource('', category))
  }, [beneficiaryS, beneficiaryY])

  useEffect(() => {
    if (loading && !Utils.isStringEmpty(benefitAcc)) {
      setLoading(false)
      if (type === 'Y') {
        if (toBenefitBank && toBenefitBranch) {
          Navigation.pop()
        }
      } else {
        Navigation.pop()
      }
    }
  }, [benefitSelected])

  useEffect(() => {
    if (!Utils.isStringEmpty(benefitAcc)) {
      setLoading(false)
    }
  }, [benefitSelectedError])

  const getBenefit = (textSearch, bCode = null) => {
    if (type === 'Y') {
      // chuyển thường
      if (!toBenefitBank) {
        Utils.toast(I18n.t('transfer.mess_select_bank'))
        return
      }
      if (!toBenefitBranch) {
        // Utils.toast(I18n.t('transfer.mess_select_branch'))
        const body = {
          bankNo: toBenefitBank.bankNo,
        }
        dispatch(transferOperations.getListBankBranch(body))
        sheetBranch.current && sheetBranch.current.show()
        return
      }
      setLoading(true)
      dispatch(
        transferOperations.selectBenefitAccInterbank({
          beneficiaryAccountNo: textSearch,
          beneficiaryName: accountName,
        })
      )
    } else {
      setLoading(true)
      const bankCode = bCode || (toBenefitBank ? toBenefitBank.bankNo : '')
      const params = {
        bankCode,
        beneficiaryAccount: textSearch,
        type: type === 'C' ? 'cardType' : 'acctType',
        fromAcct: selectedAcc,
      }
      dispatch(transferOperations.getAccInterbank(params))
    }
  }

  const selectBenefit = (data) => {
    setLoading(true)
    setBenefitAcc(data.beneficiaryAccountNo)
    setAccountName(data.beneficiaryName)
    if (type === 'Y') {
      dispatch(transferOperations.selectBenefitAcc(data))
    } else {
      getBenefit(data.beneficiaryAccountNo, data.beneficiaryBankId)
    }
  }

  const queryBenefitAccount = () => {
    if (!benefitAcc) {
      Utils.toast(I18n.t('transfer.mess_select_benefit_acc'))
      return
    }

    if (type !== 'C' && !toBenefitBank) {
      Utils.toast(I18n.t('transfer.mess_select_bank'))
      return
    }
    getBenefit(benefitAcc)
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
    setBenefitAcc(text)
    if (timeOut) {
      clearTimeout(timeOut)
    }
    timeOut = setTimeout(() => {
      const lists = transferSelectors.filterDatasource(text, listBeneficiary)
      setListData(lists)
    }, 300)
  }

  const selectBank = () => {
    // if (type === 'Y' && toBenefitBank) {
    //   const body = {
    //     bankNo: toBenefitBank.bankNo,
    //   }
    //   dispatch(transferOperations.getListBankBranch(body))
    //   sheetBranch.current && sheetBranch.current.show()
    // } else {
    sheetBank.current && sheetBank.current.show()
    // }
  }

  const selectBranch = () => {
    sheetBranch.current && sheetBranch.current.show()
  }

  const beneficiaryBankName = toBenefitBank ? toBenefitBank.bankName : null
  const beneficiaryBranchName = toBenefitBranch ? toBenefitBranch.bankOrgName : null
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
                value={benefitAcc}
                onChangeText={search}
                onSubmitEditing={() => {}}
                maxLength={30}
                returnKeyType="done"
                keyboardType={type === 'C' ? 'numeric' : 'default'}
                underlineColorAndroid="transparent"
              />
            </View>
            {type === 'Y' && (
              <View style={[styles.element]}>
                <View style={Helpers.fill}>
                  <Text style={styles.title}>{I18n.t('transfer.benefit_name')}</Text>
                  <TextInput
                    value={accountName}
                    onChangeText={(val) => setAccountName(val)}
                    returnKeyType="done"
                    maxLength={150}
                  />
                </View>
              </View>
            )}
            {(type === 'A' || type === 'Y') && (
              <TouchableOpacity onPress={selectBank} style={[styles.element]}>
                <View style={Helpers.fill}>
                  <Text style={styles.title}>{I18n.t('transfer.benefit_bank')}</Text>
                  {beneficiaryBankName && (
                    <Text style={styles.contentBold}>{beneficiaryBankName}</Text>
                  )}
                  {beneficiaryBranchName && (
                    <Text style={styles.contentAmount}>{beneficiaryBranchName}</Text>
                  )}
                </View>
                <Icon name="icon-detail" size={20} color={Colors.check} />
              </TouchableOpacity>
            )}
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
      <BankScreen
        ref={sheetBank}
        data={type === 'Y' ? listBank : listBankSML}
        type={type}
        selectBranch={selectBranch}
      />
      {type === 'Y' && <BankBranchScreen ref={sheetBranch} />}
    </Fragment>
  )
}
export default BenefitInterbank
