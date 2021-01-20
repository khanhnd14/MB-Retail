/* eslint-disable no-use-before-define */
import React, { useState, useEffect, Fragment } from 'react'
import { View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Helpers, Colors } from '../../theme'
import { employeeOperations } from '../../state/employee'
import { Topbar } from '../../components'
import EmployeeRegister from './EmployeeRegister'
import EmployeeTransfer from './EmployeeTransfer'
import I18n from '../../translations'
import { Utils } from '../../utilities'

const EmployeeScreen = () => {
  const { info, isInfoComplete } = useSelector((state) => state.employee)
  const [isActive, setActive] = useState(false)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    getInfo()
  }, [])

  useEffect(() => {
    if (loading && isInfoComplete) {
      // setLoading(false)
      Utils.hideLoading()
      setActive(info !== null)
    }
  }, [isInfoComplete])

  const getInfo = () => {
    // setLoading(true)
    Utils.showLoading()
    dispatch(employeeOperations.getInfo())
  }
  const subTitle = isActive ? I18n.t('employee.manager_title') : I18n.t('employee.sub_title')

  return (
    <Fragment>
      <Topbar title={I18n.t('employee.title')} subTitle={subTitle} />
      <View style={[Helpers.fill, { backgroundColor: Colors.mainBg }]}>
        {/* <Spinner visible={!isInfoComplete} /> */}
        {isInfoComplete && (info ? <EmployeeTransfer /> : <EmployeeRegister />)}
      </View>
    </Fragment>
  )
}

export default EmployeeScreen
