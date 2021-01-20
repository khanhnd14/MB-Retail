import * as React from 'react'
import { View, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import Text from '../MsbText'
import { Images, Helpers, Metrics, Colors } from '../../theme'
import { Icon } from '..'
import { Utils } from '../../utilities'

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderBottomColor: '#BDBDBD',
    borderBottomWidth: 1,
    paddingVertical: Metrics.small,
    alignItems: 'center',
    flexDirection: 'row',
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
  icon: {
    width: Metrics.medium * 2,
    height: Metrics.medium * 2,
    marginRight: Metrics.medium,
  },
  more: {
    height: Metrics.normal * 3,
    width: Metrics.normal * 3,
  },
  iconLeft: {
    backgroundColor: Colors.primary2,
    width: Metrics.medium * 2,
    height: Metrics.medium * 2,
    marginRight: Metrics.normal,
    borderRadius: Metrics.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
const BenefitItem = (props) => {
  const { data, item, image, onOpen, typeModule, onPressItem, showIcon } = props
  const { servicesList } = useSelector((state) => state.product)

  const onClick = () => {
    if (onOpen) {
      onOpen()
    }
  }
  const billService = React.useMemo(() => {
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
          groupType: '6',
        })
        list.push({
          serviceList: subService.filter((value, index) => value.serviceType === 'EL'),
          groupType: '7',
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
          groupType: '8',
        })
        return list
      }
      list.push(value)
    })
    return list
  }, [servicesList])

  const iconService = React.useMemo(() => {
    const service = _.filter(typeModule === 'RG' ? servicesList : billService, {
      serviceList: [{ serviceId: Number(item.serviceId) }],
    })[0]
    // console.log('====================================')
    // console.log('service', service)
    // console.log('====================================')
    if (typeModule === 'RG') {
      switch (service?.groupType) {
        case '0':
          return 'icon-didong'
        case '2':
          return 'napgame'
        case '6':
          return 'mathe'
        case '5':
          return 'hocphi'
        case '11':
          return 'napthe'
        default:
          break
      }
    } else {
      switch (service?.groupType) {
        case '0':
          return 'icon-didong'
        case '1':
          return 'icon-dtcodinh'
        case '2':
          return 'internet'
        case '3':
          return 'truyenhinh'
        case '4':
          return 'icon-ve-tauxe'
        case '5':
          return 'icon-baohiem'
        case '6':
          return 'nuoc'
        case '7':
          return 'dien'
        case '8':
          return 'hocphi'
        default:
          break
      }
    }
  }, [item, servicesList])

  const renderIcon = () =>
    <View style={[styles.iconLeft, { backgroundColor: Colors.transparent }]} />

    // const icon =
    //   item.beneficiaryBankAddress === 'cardType'
    //     ? Images.icon_card
    //     : item.isInterBank === 'N'
    //     ? Images.icon_msb
    //     : Images.icon_interbank
    // if (!showIcon) {
    //   return <View style={[styles.iconLeft, { backgroundColor: Colors.transparent }]} />
    // }
    // return (
    //   <View style={styles.iconLeft}>
    //     {image || iconService ? (
    //       <Icon
    //         name={iconService}
    //         style={{
    //           color: Colors.white,
    //           fontSize: 20,
    //         }}
    //       />
    //     ) : (
    //       <Image resizeMode="contain" source={icon} style={styles.icon} />
    //     )}
    //   </View>
    // )

  return (
    <TouchableWithoutFeedback onPress={() => onPressItem && onPressItem(data)}>
      <View style={styles.container}>
        {renderIcon()}
        <View style={Helpers.fill}>
          <Text style={styles.name}>{item.beneficiaryAlias || item.beneficiaryName}</Text>
          <Text>{item.beneficiaryAccountNo}</Text>
          {!Utils.isArrayEmpty(item.beneficiaryBankName) && <Text>{item.beneficiaryBankName === 'MSB' ? 'MSB' : item.beneficiaryBankName}</Text>}
        </View>
        <TouchableOpacity onPress={() => onClick()} style={{ padding: Metrics.tiny }}>
          <Image resizeMode="contain" source={Images.more} style={styles.more} />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  )
}

BenefitItem.defaultProps = {
  showIcon: true,
}

BenefitItem.propTypes = {
  onOpen: PropTypes.func,
  showIcon: PropTypes.bool,
}
export default BenefitItem
