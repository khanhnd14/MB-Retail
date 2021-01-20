import React, { forwardRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { Metrics, Colors } from '../../theme'
import { Utils } from '../../utilities'
import { Text, TextInput } from '..'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    marginHorizontal: Metrics.normal * 2,
    paddingVertical: Metrics.normal
  },
  label: {
    color: Colors.buttonPrimary[0],
    fontWeight: 'bold',
    maxWidth: Metrics.medium * 6
  },
  inputIconContainer: {
    borderBottomWidth: 0.5,
    paddingVertical: Metrics.normal,
    marginHorizontal: Metrics.normal,
  },
  inputIcon: {
    flexDirection: 'row',
    paddingTop: Metrics.tiny * 2,

  },
  error: {
    paddingHorizontal: Metrics.normal,
    paddingTop: Metrics.tiny,
    color: Colors.primary
  }
})

const Input = forwardRef(({ style, label, placeholder, value, multiline, inputStyle, isNormal, onChangeText, secureTextEntry, error, disable, defaultValue, onFocus, onBlur, returnKeyType, keyboardType, autoCompleteType }, ref) => isNormal ? (
  <View>
    <View style={styles.inputIconContainer}>
      <Text style={[styles.label, { maxWidth: Utils.getWindowHeight() }]}>{label}</Text>
      <View style={styles.inputIcon}>
        <TextInput
          selectionColor={Colors.primary2}
          multiline={multiline}
          onChangeText={onChangeText}
          style={[{ flex: 1 }, style]}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          ref={ref}
          value={value}
          editable={!disable}
          defaultValue={defaultValue}
          onFocus={onFocus}
          onBlur={onBlur}
          returnKeyType={returnKeyType}
          keyboardType={keyboardType}
          autoCompleteType={autoCompleteType}
        />
      </View>
    </View>
    {error && <Text style={styles.error}>{error}</Text>}
  </View>
  ) : (
    <View style={[styles.container, inputStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        selectionColor={Colors.primary2}
        onChangeText={onChangeText}
        multiline={multiline}
        style={[{ textAlign: 'right', flexWrap: 'wrap', flex: 1, }, style]}
        placeholder={placeholder}
        value={value}
        secureTextEntry={secureTextEntry}
        editable={!disable}
        ref={ref}
        defaultValue={defaultValue}
        onFocus={onFocus}
        onBlur={onBlur}
        returnKeyType={returnKeyType}
        keyboardType={keyboardType}
        autoCompleteType={autoCompleteType}
      />
    </View>
))

export default Input
