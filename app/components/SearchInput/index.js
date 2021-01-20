import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Colors, Metrics, Helpers } from '../../theme'
import TextInput from '../MsbTextInput'
import Icon from '../MsbIcon'
import I18n from '../../translations'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Metrics.medium,
    paddingVertical: Metrics.normal,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
    alignItems: 'center',
  },
})

const SearchInput = (props) => (
  <View style={styles.container}>
    <Icon size={20} color={Colors.primary2} name="icon-search" />
    <View style={[Helpers.fill, { paddingLeft: Metrics.normal }]}>
      <TextInput
        autoCorrect={false}
        autoCapitalize="characters"
        blurOnSubmit={false}
        maxLength={30}
        placeholder={I18n.t('application.holder_search')}
        placeholderTextColor="#D0D1D3"
        disableFullscreenUI
        clearButtonMode="never"
        spellCheck={false}
        returnKeyType="done"
        underlineColorAndroid="transparent"
        {...props}
      />
    </View>
  </View>
  )

export default SearchInput
