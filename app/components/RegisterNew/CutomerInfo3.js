import React, { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react'
import { StyleSheet, View } from 'react-native'
import I18n from 'i18n-js'
import { useSelector, useDispatch } from 'react-redux'
import { Metrics, Colors } from '../../theme'
import Select from './Select'
import { ekycOperations } from '../../state/ekyc'
import * as ekycTypes from '../../state/ekyc/types'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingVertical: Metrics.normal,
    marginHorizontal: Metrics.normal,
    borderBottomRightRadius: Metrics.normal,
    borderBottomLeftRadius: Metrics.normal
  }
})
const CustomerInfo3 = forwardRef(({ setChoiceBranchForm, choiceBranchForm, setDisableButton }, ref) => {
  const { dataOtpVerified, resultDistrict, resultSubBranch } = useSelector((state) => state.ekyc)
  const [province, setProvince] = useState(null)
  const [district, setDistrict] = useState(null)
  const [branch, setBranch] = useState(null)
  const dispatch = useDispatch()
  const branchs = useMemo(() => resultSubBranch && resultSubBranch.map((value, index) => {
    console.log('====================================');
    console.log(value);
    console.log('====================================');
    return { name: value.branchName, code: value.subBranch, address: value.address }
  }), [resultSubBranch])

  const submit = () => {
    branch && dispatch(ekycOperations.choiceBranch(branch))
    setChoiceBranchForm({ province, district, branch })
  }

  console.log('====================================');
  console.log(branchs);
  console.log('====================================');
  useEffect(() => {
    if (province) {
      setDistrict(null)
      setBranch(null)
      dispatch({
        type: ekycTypes.GET_SUB_BRANCH_COMPLETED,
        payload: null
      })
      dispatch(ekycOperations.getDistrict(dataOtpVerified.token, province.code))
    }
  }, [province])

  useEffect(() => {
    if (district) {
      setBranch(null)
      dispatch(ekycOperations.getSubBranch(dataOtpVerified.token, district.code))
    }
  }, [district])

  useEffect(() => {
    if (branch) {
      setBranch(branch)
      setDisableButton(false)
    } else {
      setDisableButton(true)
    }
  }, [branch])

  useEffect(() => {
    if (choiceBranchForm) {
      console.log('====================================');
      console.log('choiceBranchForm', choiceBranchForm);
      console.log('====================================');
      setProvince(choiceBranchForm.province)
      setTimeout(() => {
        setDistrict(choiceBranchForm.district)
        setTimeout(() => {
          setBranch(choiceBranchForm.branch)
        }, 0);
      }, 0);
    }
  }, [choiceBranchForm])

  useImperativeHandle(ref, () => ({

    submit,

  }));

  console.log('====================================');
  console.log(province, district, branch);
  console.log('====================================');
  return (
    <View style={styles.container}>
      <Select title={I18n.t('ekyc.select_combo.city')} content="Chọn Tỉnh / TP" data={dataOtpVerified?.listProvince} choiceItem={setProvince} defaultItem={province} isSearch />
      <Select title={I18n.t('ekyc.select_combo.district')} content="Chọn Quận / Huyện" data={resultDistrict} choiceItem={setDistrict} defaultItem={district} isSearch />
      <Select title={I18n.t('ekyc.select_combo.branch')} content="Chọn chi nhánh" data={branchs} choiceItem={setBranch} defaultItem={branch} isSearch />
    </View>
      )
})

export default CustomerInfo3
