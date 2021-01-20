import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { Metrics, Colors } from '../../theme'
import MsbRadio from '../MsbRadio'
import Icon from '../MsbIcon'
import I18n from '../../translations'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10
  },
  checked: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconItem: {
    color: Colors.white, fontSize: 40, marginLeft: 5,
  },
})

const ConfirmTermsChecked = () => {
  const [isNow, setNow] = React.useState(false)
  return (
    <View style={styles.container}>
      <MsbRadio
        textStyle={{ paddingRight: Metrics.tiny }}
        text={I18n.t('product.confirm_content_policy')}
        checked={isNow}
        onPress={() => setNow(!isNow)}
      />
      <Icon name="icon-lichsu" styles={styles.iconItem} size={28} color={Colors.primary2} />
    </View>
  )
}
export default ConfirmTermsChecked
