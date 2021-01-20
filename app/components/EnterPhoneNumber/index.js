import * as React from 'react'
import { StyleSheet, View, PermissionsAndroid, Platform } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { selectContactPhone } from 'react-native-select-contact';
import { Colors, Metrics } from '../../theme'
import I18n from '../../translations'
import { Icon, TextInput, Text } from '..'
import { Utils } from '../../utilities';

const styles = StyleSheet.create({
  container: {
    borderBottomColor: Colors.gray5,
    borderBottomWidth: 1,
    paddingHorizontal: Metrics.tiny,
    paddingTop: Metrics.normal
  },
  title: {
    color: Colors.primary2,
    fontSize: 14,
    fontWeight: 'bold',
  },
  input: {
    color: Colors.gray1,
    fontSize: 14,
    flex: 1,
    paddingBottom: Metrics.normal
  },
  subValue: {
    color: Colors.gray2,
    fontSize: 14,
    marginTop: Metrics.small,
  },
})

const EnterPhoneNumber = ({ onChangePhoneNumber, phoneNumberFill, setIsShowSelectSupplies }) => {
  const [value, setValue] = React.useState('')
  const [phoneSelected, setPhoneSelected] = React.useState('')

  const getPhoneNumber = () => {
    onChangePhoneNumber(null)
    setIsShowSelectSupplies && setIsShowSelectSupplies(false)
    return selectContactPhone().then(select => {
      Utils.hideLoading()
      if (!select) {
        return null;
      }
      const { contact, selectedPhone } = select;
      setPhoneSelected(selectedPhone?.number)
      console.log(`Selected ${selectedPhone.type} phone number ${selectedPhone.number} from ${contact.name}`);
      onChangePhoneNumber(selectedPhone.number.trim())
      return selectedPhone.number;
    }).catch((e) => {
      Utils.hideLoading()
      console.log('====================================');
      console.log(e);
      console.log('====================================');
    })
  }

  React.useEffect(() => {
    if (phoneNumberFill) {
      setPhoneSelected(phoneNumberFill)
    }
  }, [phoneNumberFill])

  const requestContactPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Allow Access Contact?',
          message:
            'allow this app to read contact information',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('granted');
        setPhoneSelected(getPhoneNumber());
      } else {
        Utils.hideLoading()
        console.log('denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  const onGetPhoneNumber = () => {
    Utils.showLoading()
    setTimeout(() => {
      Platform.OS === 'android' ?
      requestContactPermission()
      : setPhoneSelected(getPhoneNumber())
    }, 500);
  }

  const onBlur = () => {
    if (value) {
      onChangePhoneNumber(value)
    }
  }
  React.useEffect(() => {
    setValue(phoneSelected)
    Utils.hideLoading()
  }, [phoneSelected])
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{I18n.t('employee.phoneNumber')}</Text>
      <View
        style={{
          marginTop: Metrics.small,
          flexDirection: 'row'
        }}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(val) => {
            setValue(val)
          }}
          onBlur={onBlur}
          placeholder={I18n.t('product.service_list.error_phone')}
          placeholderTextColor={Colors.gray}
          keyboardType="number-pad"
          returnKeyType="done"
          onSubmitEditing={onBlur}
        />
        <TouchableOpacity onPress={onGetPhoneNumber}>
          <Icon name="icon-contact" size={Metrics.normal * 1.2} color={Colors.primary2} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default EnterPhoneNumber
