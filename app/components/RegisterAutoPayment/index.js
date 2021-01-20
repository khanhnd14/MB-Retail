import React from 'react'
import { View } from 'react-native'
import { Colors, Metrics } from '../../theme'
import { Switch, Text } from '..'

const RegisterAutoPayment = () => {
  const [switchStatus, setSwitchStatus] = React.useState(false)
  return (
    <View
      style={{
        paddingHorizontal: Metrics.tiny,
        paddingVertical: Metrics.small,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ color: Colors.primary2, fontSize: 14, fontWeight: 'bold' }}>
          Đăng ký thanh toán tự động
        </Text>
        <Switch
          isOn={switchStatus}
          onColor={Colors.primary}
          offColor={Colors.gray}
          size="small"
          onToggle={(val) => setSwitchStatus(val)}
        />
      </View>
    </View>
  )
}

export default RegisterAutoPayment
