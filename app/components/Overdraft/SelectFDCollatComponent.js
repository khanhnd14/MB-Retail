import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native'
import I18n from 'i18n-js'
import { Helpers, Metrics, Colors, ApplicationStyles } from '../../theme'
import { Topbar, MenuItem, Icon, ModalSelect, TextInput, Text, ConfirmButton, AmountLabel } from '..'
import * as Navigation from '../../navigation'
import { productOperations } from '../../state/product'

import CheckBox from '../Checkbox'

const styles = StyleSheet.create({
  container: {
    borderBottomColor: Colors.lineSep,
    borderBottomWidth: 1,
    marginHorizontal: Metrics.medium,
    paddingVertical: Metrics.small,
  },
  title: { fontWeight: 'bold', fontSize: 13, color: Colors.primary2 },
  select: {
    color: Colors.gray,
    fontSize: 14,
  },
  selectCollatView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Metrics.small
  },
  tsbdTotalLabel: {
    alignItems: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tsbdTotalAmount: {
    alignItems: 'center',
    fontSize: 14,
    color: Colors.primary2
  },
  tsbdTotalView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20
  },
  fdRowView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lineSep,
    paddingVertical: 5
  },
  fdCheckbox: {
    backgroundColor: '#FFF',
    color: Colors.primary2,
    borderRadius: 10,
    borderColor: '#D0D1D3',
  },
  itemText: {
    paddingVertical: 5
  }
})
// const PaymentMethod = ({ changeDDAccount, fromAcc, renewMatter }) => {
const SelectFDCollatComponent = ({ data, onSubmit }) => {
  const [isVisible, setVisible] = React.useState(false)
  const [total, setTotal] = React.useState(0)
  const [totalConfirmed, setTotalConfirmed] = React.useState(0)
  const [odLimit, setOdLimit] = React.useState(0)
  // const dispatch = useDispatch()

  React.useEffect(() => {
    // console.log('data',data,onSubmit);
  }, [])

  const onChoiceCheckbox = (name, ischecked) => {
    // console.log('ischecked',name,ischecked);
    var fdList = data.FDList
    let totalTSBD = 0
    let odLimit = 0;
    const { tyLeDamBao } = data
    const { tyLeDamBaoFSRN } = data
    const { odLimitAmountOnline } = data
    const { odLimitAmountMax } = data
    fdList.forEach(fd => {
      if (fd.receiptNo == name) {
          fd.isSelected = ischecked
      }

      if (fd.isSelected) {
        totalTSBD += fd.principal;
        let rate = tyLeDamBao;
					if (fd.category == 'FSRN') {
						rate = tyLeDamBaoFSRN;
					}
					var hanMucTC = fd.principal * (rate / 100);
					hanMucTC = Math.floor(hanMucTC);
          odLimit += hanMucTC;
          var amountTC = 0;
          if (odLimitAmountOnline != '0') {
            amountTC = odLimitAmountMax - odLimitAmountOnline;
            if (amountTC <= odLimit) {
              odLimit = amountTC
            }
          }
          if (amountTC != null) {
            if (odLimitAmountMax <= odLimit) {
              odLimit = odLimitAmountMax
            }
          }
      }
    });
    setOdLimit(odLimit)
    setTotal(totalTSBD)
    // calTSD()
  }

  // function calTSD(){
  //   let totalTSBD = 0
  //   var fdList = data.FDList
  //   fdList.forEach(fd => {
  //     if (fd.isSelected) {
  //       totalTSBD += fd.principal;
  //     }
  //   });
  //   setTotal(totalTSBD)
  // }

  function handleSubmit() {
    setTotalConfirmed(total)
    onSubmit(data, total, odLimit)
    setVisible(false)
  }

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={() => setVisible(true)}>
        <Text style={styles.title}>{I18n.t('overdraft.fromOnlineSaving.collateral')}</Text>
        <View style={styles.selectCollatView}>
          {totalConfirmed ?
            <AmountLabel style={{ color: '#15181B' }} value={totalConfirmed} currency="VND" />
          :
            <Text style={styles.select}>{I18n.t('overdraft.fromOnlineSaving.selectCollateralPlaceHolder')}</Text>
          }

          <Icon name="icon-detail" size={20} color={Colors.check} style={styles.icon} />
        </View>
      </TouchableOpacity>
      <ModalSelect
        title={I18n.t('overdraft.fromOnlineSaving.collateral')}
        visible={isVisible}
        maxHeight={350}
        handleModal={() => setVisible(false)}
      >
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
          <View style={{ flex: 1, marginHorizontal: 16 }}>
            {data?.FDList?.map((fd, index) => (
              <TouchableOpacity key={fd.receiptNo} style={styles.fdRowView} onPress={() => onChoiceCheckbox(fd.receiptNo, !fd.isSelected)}>
                <CheckBox
                  style={styles.fdCheckbox}
                  color={Colors.primary2}
                  onChange={onChoiceCheckbox}
                  name={fd.receiptNo}
                  checked={fd.isSelected}
                />
                <View style={{ paddingHorizontal: 16, flexDirection: 'row', flex: 1 }}>
                  <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <Text style={[styles.itemText, { color: Colors.primary2, fontWeight: 'bold' }]}>{fd.alias}</Text>
                    <Text style={[styles.itemText, { fontSize: 15, fontWeight: 'bold' }]}>{fd.receiptNoInString}</Text>
                  </View>
                  <View>
                    <Text style={[styles.itemText, { color: Colors.gray1, textAlign: 'right' }]}>{fd.settlementDate}</Text>
                    <AmountLabel style={[styles.itemText, { fontSize: 15 }]} value={fd.principal} currency="VND" />
                  </View>
                </View>
              </TouchableOpacity>
              ))}
          </View>
        </ScrollView>
        <View style={styles.tsbdTotalView}>
          <Text style={styles.tsbdTotalLabel}>{I18n.t('overdraft.fromOnlineSaving.totalCollat')}</Text>
          <AmountLabel style={styles.tsbdTotalAmount} value={total} currency="VND" />
        </View>
        <ConfirmButton
          onPress={() => handleSubmit()}
          style={{
              paddingHorizontal: Metrics.small,
              paddingBottom: Metrics.small,
              paddingTop: Metrics.small
            }}
          color={Colors.primary2}
          styleButton={{ width: '100%' }}
          text={I18n.t('action.action_done').toUpperCase()}
          styleText={{
              fontSize: 14,
            }}
        />
      </ModalSelect>
    </>
  )
}
export default SelectFDCollatComponent
