import * as React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Colors, Metrics } from '../../theme'
import { Switch, Text } from '..'
import MsbRadio from '../MsbRadio'
import Icon from '../MsbIcon'
import I18n from '../../translations'
import { setIsNow } from '../../state/product/actions'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  checked: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconItem: {
    color: Colors.white,
    fontSize: 40,
    marginLeft: 5,
  },
})

const RegisAutoPayAndConfirm = ({ onShowPolicy, onIsSchedule, register, setValue, unregister }) => {
  const [switchStatus, setSwitchStatus] = React.useState(false)
  const [isNow, setNow] = React.useState(false)
  React.useEffect(() => {
    onIsSchedule(isNow)
    setValue('agree', isNow)
  }, [isNow])

  React.useEffect(() => {
    if (switchStatus) {
      register('agree', {
        required: {
          value: true,
          message: I18n.t('product.service_list.error_accept_term')
        }
      })
    } else {
      unregister('agree')
      setNow(false)
    }
  }, [switchStatus])

  return (
    <View
      style={{
        paddingHorizontal: Metrics.tiny,
        paddingVertical: Metrics.small * 2,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ color: Colors.primary2, fontSize: 14, fontWeight: 'bold' }}>
          {I18n.t('product.service_list.auto_payment')}
        </Text>
        <Switch
          isOn={switchStatus}
          onColor={Colors.primary}
          offColor={Colors.gray}
          size="small"
          onToggle={(val) => {
            setSwitchStatus(val)
          }}
        />
      </View>
      {switchStatus ? (
        <View style={styles.container}>
          <MsbRadio
            textStyle={{ paddingRight: Metrics.medium * 3, marginLeft: Metrics.tiny * 2 }}
            text={I18n.t('product.confirm_content_policy')}
            checked={isNow}
            onPress={() => setNow(!isNow)}
          />
          <TouchableOpacity onPress={onShowPolicy}>
            <Icon name="icon-lichsu" styles={styles.iconItem} size={28} color={Colors.primary2} />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  )
}

export default RegisAutoPayAndConfirm
