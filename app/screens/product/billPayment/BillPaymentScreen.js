import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ScrollView, StyleSheet } from 'react-native'
import I18n from '../../../translations'
import { Helpers, Metrics, Colors } from '../../../theme'
import { Topbar, MenuItem } from '../../../components'
import * as Navigation from '../../../navigation'
import { productOperations } from '../../../state/product'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBg,
    // marginBottom: Metrics.normal,
    paddingHorizontal: Metrics.medium,
  },
})

const BillPaymentScreen = () => {
  const { servicesList } = useSelector((state) => state.product)
  const mobileServiceList = React.useMemo(() => {
    const list = []
    servicesList.map((value, index) => {
      const subService = value.serviceList
      if (value.groupType === '3') {
        list.push({
          serviceList: subService.filter((value, index) => value.serviceType === 'TV'),
          groupType: '3',
        })
        list.push({
          serviceList: subService.filter((value, index) => value.serviceType === 'WC'),
          groupType: '3',
        })
        list.push({
          serviceList: subService.filter((value, index) => value.serviceType === 'EL'),
          groupType: '3',
        })
        return list
      }
      if (value.groupType === '5') {
        list.push({
          serviceList: subService.filter(
            (value, index) => value.serviceType === 'BH' || value.serviceType === 'SU'
          ),
          groupType: '5',
        })
        list.push({
          serviceList: subService.filter((value, index) => value.serviceType === 'OH'),
          groupType: '5',
        })
        return list
      }
      list.push(value)
    });
[list[1], list[5]] = [list[5], list[1]];
[list[2], list[4]] = [list[4], list[2]]

    return list
  }, [servicesList])

  const dispatch = useDispatch()
  React.useEffect(() => {
    dispatch(
      productOperations.getServiceList({
        moduleType: 'BP',
      })
    )
    dispatch(productOperations.getBillAlias())
  }, [])

  return (
    <>
      <Topbar background={Colors.mainBg} title={I18n.t('product.bill_payment')} />
      <ScrollView style={[styles.container]}>
        {mobileServiceList.map((value, index) => {
          let service
          let icon = ''
          let route
          let params
          switch (index) {
            case 0:
              service = I18n.t('product.service_list.mobile_payment')
              icon = 'icon-didong'
              route = 'MobilePaymentInputScreen'
              break
            case 1:
              service = I18n.t('product.service_list.electric')
              icon = 'dien'
              route = 'ElectricPayment'
              params = {
                selectedService: value?.serviceList[0],
              }
              break
            case 2:
              service = I18n.t('product.service_list.water')
              icon = 'nuoc'
              route = 'ElectricPayment'
              break
            case 3:
              service = I18n.t('product.service_list.television')
              icon = 'truyenhinh'
              route = 'ElectricPayment'
              break
            case 4:
              service = I18n.t('product.service_list.internet')
              icon = 'internet'
              route = 'ElectricPayment'
              break
            case 5:
              service = I18n.t('product.service_list.fixed_mobile')
              icon = 'icon-dtcodinh'
              route = 'ElectricPayment'
              break
            case 6:
              service = I18n.t('product.service_list.ticket')
              icon = 'icon-ve-tauxe'
              route = 'ElectricPayment'
              break
            case 7:
              service = I18n.t('product.service_list.insurrance')
              icon = 'icon-baohiem'
              route = 'ElectricPayment'
              break
            case 8:
              service = I18n.t('product.service_list.fee')
              icon = 'hocphi'
              route = 'ElectricPayment'
              break
            default:
              service = ''
              break
          }
          return (
            <MenuItem
              icon={icon}
              key={`${index}`}
              onPress={() =>
                Navigation.push(route, {
                  title: service,
                  groupType: value.groupType,
                  serviceList: value?.serviceList,
                  ...params,
                })
              }
              text={service}
            />
          )
        })}
      </ScrollView>
    </>
  )
}
export default BillPaymentScreen
