import * as React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import I18n from 'i18n-js'
import { Colors, Metrics } from '../../theme'
import Checkbox from '../Checkbox'
import PaymentAccount from './PaymentAccount'
import { Text } from '..'

const styles = StyleSheet.create({
  container: {
    borderBottomColor: Colors.gray5,
    borderBottomWidth: 1,
    paddingHorizontal: Metrics.tiny,
    paddingVertical: Metrics.small,
  },
  title: {
    color: Colors.primary2,
    fontSize: 14,
    fontWeight: 'bold',
  },
  input: {
    color: Colors.gray1,
    fontSize: 16,
    height: 24,

    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  subValue: {
    color: Colors.gray1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxButton: {
    flexDirection: 'row',
     marginLeft: Metrics.normal * 5,
     paddingVertical: Metrics.tiny
  },
  txtCheckbox: {
    marginLeft: Metrics.normal
  },
  accNumberContainer: {
    flexDirection: 'row',
     alignItems: 'center'
  },
  accNumber: {
    marginLeft: Metrics.normal,
    fontWeight: 'bold',
    marginHorizontal: Metrics.tiny * 3,
    marginVertical: Metrics.tiny * 2,
    fontSize: 15
  }
})

const PaymentMethod = ({ changeDDAccount, fromAcc, renewMatter }) => {
  const [mapRef, setMapRef] = React.useState(0)
  const [accChoosed, setAccChoosed] = React.useState(undefined)
  const accounts = useSelector((state) => state.save.account)

  const onChoiceCheckbox = (name,ischecked) => {
    // debugger
    console.log('ischecked',name,ischecked,fromAcc);
    setMapRef(name)
    console.log('mapRef',mapRef);
    if (name === I18n.t('account.add_to_payment')) {
      changeDDAccount(fromAcc,'Y')
    } else {
      changeDDAccount(fromAcc,'N')
      setAccChoosed(fromAcc)
    }
  }

  React.useEffect(() => {
    onChoiceCheckbox(I18n.t('account.add_to_payment'))
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{I18n.t('account.type_interest_rate')}</Text>
      <View>
        <Text style={styles.subValue} />
        <TouchableOpacity onPress={() => onChoiceCheckbox(I18n.t('account.add_to_payment'))} style={styles.checkboxButton}>
          <Checkbox
            name={I18n.t('account.add_to_payment')}
            checked={mapRef === I18n.t('account.add_to_payment')}
            autoChangeSelected={false}
            style={{
              backgroundColor: '#FFF',
              color: Colors.primary2,
              borderRadius: 10,
              borderColor: '#D0D1D3',
            }}
            onChange={onChoiceCheckbox}
            size={20}
            color={Colors.primary2}
          />
          <View>
            <Text style={styles.txtCheckbox}>{I18n.t('account.add_to_payment')}</Text>
            {mapRef == I18n.t('account.add_to_payment')
            ? accounts.map((value, index) => (
              <PaymentAccount
                key={index}
                index={index}
                value={value}
                changeDDAccount={(val) => {
                  changeDDAccount(val,'Y')
                  setAccChoosed(val)
                }}
                accChoosed={accChoosed}
                fromAcc={fromAcc}
              />
            ))
            : null}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onChoiceCheckbox(I18n.t('account.add_to_root'))} style={styles.checkboxButton}>
          <Checkbox
            name={I18n.t('account.add_to_root')}
            checked={mapRef === I18n.t('account.add_to_root')}
            autoChangeSelected={false}
            style={{
              backgroundColor: '#FFF',
              color: Colors.primary2,
              borderRadius: 10,
              borderColor: '#D0D1D3',
            }}
            onChange={onChoiceCheckbox}
            size={20}
            color={Colors.primary2}
          />
          <Text style={styles.txtCheckbox}>{I18n.t('account.add_to_root')}</Text>
        </TouchableOpacity>

      </View>

    </View>
    )
}

export default PaymentMethod
