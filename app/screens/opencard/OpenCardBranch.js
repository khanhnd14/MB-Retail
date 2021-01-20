/* eslint-disable no-empty */
/* eslint-disable radix */
import React, { Fragment, useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import _ from 'lodash'
import { Helpers, Metrics, Colors } from '../../theme'
import {
  Topbar,
  ConfirmButton,
  SelectBox,
} from '../../components'
import * as Navigation from '../../navigation'
import { openCardOperations } from '../../state/opencard'
import I18n from '../../translations'
import { Utils } from '../../utilities'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Metrics.small * 1.8,
    backgroundColor: Colors.white,
    marginHorizontal: Metrics.small * 1.8,
    paddingBottom: Metrics.small,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  titleContainer: {
    paddingHorizontal: Metrics.small * 1.8,
    backgroundColor: Colors.white,
    paddingBottom: Metrics.small,
    marginTop: Utils.getRatioDimension(8),
    width: '100%',
  },
  contentContainer: {
    paddingHorizontal: Metrics.small * 1.8,
    backgroundColor: Colors.white,
    paddingVertical: Utils.getRatioDimension(18),
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: Utils.getRatioDimension(8),
    width: '100%',
  },
  element: {
    backgroundColor: Colors.white,
    paddingVertical: Metrics.small,
    borderBottomColor: Colors.line,
    borderBottomWidth: 1,
  },
  error: {
    color: Colors.error,
    fontSize: 12,
    paddingVertical: Utils.getRatioDimension(8),
  },
  title: {
    fontWeight: 'bold',
    color: Colors.primary2,
    fontSize: 12,
    paddingVertical: Utils.getRatioDimension(8),
  },
  content: {
    color: '#8E8E93',
    paddingVertical: Utils.getRatioDimension(8),
  },
  contentBold: {
    color: Colors.textBlack,
    fontWeight: 'bold',
    paddingVertical: Metrics.tiny,
    paddingRight: Metrics.tiny,
  },
  contentAmount: {
    color: Colors.text,
    paddingVertical: Metrics.tiny / 2,
  },
  line: {
    backgroundColor: Colors.line,
    height: 1,
  },
  formAmount: {
    fontSize: 12,
    color: Colors.gray1,
  },
  input: {
    paddingTop: Metrics.small,
  },
  checkBox: {
    paddingVertical: Metrics.normal,
  },
  textCheckBox: {
    fontSize: 12,
    color: '#171D33',
  },
})

const OpenCardBranch = () => {
  const dispatch = useDispatch()
  const { initData, initError, listDistrict, listBranch } = useSelector((state) => state.opencard)
  const { listProvince } = initData || {}

  const [provides, setListProvide] = useState([])
  const [provide, setProvide] = useState(null)
  const [districts, setListDistrict] = useState([])
  const [district, setDistrict] = useState(null)
  const [branchs, setListBranch] = useState([])
  const [branch, setBranch] = useState(null)

  useEffect(() => {
    if (!_.isEmpty(listProvince)) {
      Utils.hideLoading()
      const tempList = []
      listProvince.forEach((item) => {
        tempList.push({ ...item, value: item.name })
      })
      setListProvide(tempList)
    }
  }, [listProvince])

  useEffect(() => {
    if (!_.isEmpty(listDistrict)) {
      Utils.hideLoading()
      const tempList = []
      listDistrict.forEach((item) => {
        tempList.push({ ...item, value: item.name })
      })
      setListDistrict(tempList)
    }
  }, [listDistrict])

  useEffect(() => {
    if (!_.isEmpty(listBranch)) {
      Utils.hideLoading()
      const tempList = []
      listBranch.forEach((item) => {
        tempList.push({ ...item, value: item.branchName })
      })
      setListBranch(tempList)
    }
  }, [listBranch])

  const getDistrict = (code) => {
    Utils.showLoading()
    dispatch(openCardOperations.getDistrict({ cityCode: code }))
  }
  const getBranch = (code) => {
    Utils.showLoading()
    dispatch(openCardOperations.getSubBranch({ idDistrict: code }))
  }
  const onSelectProvide = (item) => {
    setProvide(item)
    getDistrict(item.code)
    setDistrict(null)
    setBranch(null)
  }
  const onSelectDistrict = (item) => {
    setDistrict(item)
    getBranch(item.code)
    setBranch(null)
  }

  const onSelectBranch = (item) => {
    setBranch(item)
  }
  const onRegister = () => {
    Navigation.pop()
    dispatch(openCardOperations.selectBranch(branch))
  }

  return (
    <Fragment>
      <Topbar title={I18n.t('opencard.title')} subTitle={I18n.t('opencard.sub_title_input')} />
      <KeyboardAwareScrollView
        style={Helpers.fullWidth}
        showsVerticalScrollIndicator
        extraHeight={300}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[Helpers.fill, styles.container]}>
          <SelectBox
            title={I18n.t('opencard.provide')}
            data={provides}
            defaultValue={provide}
            onSelect={onSelectProvide}
            textHolder={I18n.t('opencard.provide_holder')}
            isSearch
          />
          <SelectBox
            title={I18n.t('opencard.district')}
            data={districts}
            defaultValue={district}
            onSelect={onSelectDistrict}
            textHolder={I18n.t('opencard.district_holder')}
            isSearch
          />
          <SelectBox
            title={I18n.t('opencard.branch')}
            data={branchs}
            defaultValue={branch}
            textHolder={I18n.t('opencard.branch_holder')}
            onSelect={onSelectBranch}
            isSearch
          />
        </View>
      </KeyboardAwareScrollView>
      <ConfirmButton onPress={() => onRegister()} />
    </Fragment>
  )
}
export default OpenCardBranch
