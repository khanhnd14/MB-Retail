import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import * as Animatable from 'react-native-animatable';
import I18n from 'i18n-js'
import { Colors, Metrics } from '../../theme'
import { Utils } from '../../utilities'
import { Text } from '..';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gray11,
    position: 'absolute',
    left: 0,
    top: 0,
    width: Utils.getWindowWidth(),
    height: Utils.getWindowHeight(),
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    borderRadius: Metrics.medium,
    marginHorizontal: Metrics.medium * 2,
    padding: Metrics.normal
  },
  heading: {
    alignItems: 'center',
    borderBottomWidth: 0.5,
  },
  title: {
    color: Colors.buttonPrimary[0],
    paddingVertical: Metrics.normal,
    fontWeight: 'bold'
  },
  txtContent: {
    textAlign: 'center',
    paddingBottom: Metrics.normal,
    lineHeight: Metrics.small * 2
  },
  buttonActive: {
    backgroundColor: Colors.grayEkyc,
    marginHorizontal: Metrics.tiny,
    paddingVertical: Metrics.normal,
    // marginTop: Metrics.normal,
    // paddingHorizontal: Metrics.medium * 2,
    borderRadius: Metrics.normal * 2,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: Colors.white,
    marginHorizontal: Metrics.tiny,
    paddingVertical: Metrics.normal,
    borderRadius: Metrics.normal * 2,
    // marginTop: Metrics.normal,
    // paddingHorizontal: Metrics.medium * 2,
    // borderRadius: Metrics.normal * 2
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  txtButton: {
    color: Colors.primary2,
    fontWeight: 'bold'
  },
  txtButtonActive: {
    color: Colors.buttonPrimary[0],
    fontWeight: 'bold'
  }
})

const AlertMessage = ({ title, content, isDouble, showAlert, callback }) => {
  const onAccept = () => {
    showAlert(false, '', '')
    callback && callback()
  }
  return (
    <View style={styles.container}>
      <Animatable.View animation="bounceIn" style={styles.content}>
        <View style={styles.heading}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.txtContent}>{content}</Text>
        </View>
        <View style={{
          flexDirection: 'row',
          marginTop: Metrics.normal,
        }}
        >
          {isDouble ? (
            <TouchableOpacity style={styles.button}>
              <Text style={styles.txtButtonActive}>{I18n.t('action.action_done')}</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={onAccept} style={[styles.buttonActive, { marginHorizontal: !isDouble ? Metrics.medium * 2 : Metrics.tiny }]}>
            <Text style={styles.txtButton}>{I18n.t('ekyc.action_close')}</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
    )
}

export default AlertMessage
