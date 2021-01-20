import * as Navigation from '../../../navigation'
import * as React from 'react'
import { ScrollView, View, Alert, StyleSheet, Keyboard } from 'react-native'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import I18n from 'i18n-js'
import { TabView, TabBar } from 'react-native-tab-view'
import { TouchableOpacity } from 'react-native-gesture-handler'
import _ from 'lodash'
import { Helpers, Colors, Metrics } from '../../../theme'
import {
  Topbar, ConfirmButton, TextInput, Text
} from '../../../components'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
    height: '100%',
  },
  input: {
    ...Helpers.contentWidth,
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    height: Metrics.tiny * 10,
    marginTop: Metrics.tiny,
    paddingHorizontal: Metrics.normal * 2,
  },
  inputText: {
    fontWeight: 'bold',
    flex: 1,
  },
})

const CardPINChangeScreen = ({ route }) => {
  console.log('CardPINChangeScreen');
  
  return(
    <View style={styles.container}>
      <Topbar
        isBottomSubLayout background={Colors.white}
        title={I18n.t('account.title_change_pin')}
      />
      <View style={[Helpers.fillColCross, styles.container]}>
        <View style={Helpers.fillColCross}>
          <View style={[styles.input]}>
            <TextInput
              style={styles.inputText}
              autoCorrect={false}
              placeholderTextColor={Colors.primary2}
              placeholder={I18n.t('setting.curr_pass')}
              // value={oldPin}
              // onChangeText={(val) => setOldPin(val)}
              onSubmitEditing={() => {}}
              secureTextEntry
              returnKeyType="next"
              underlineColorAndroid="transparent"
            />
          </View>
        </View>
      </View>
    </View>
  )
}

export default CardPINChangeScreen
