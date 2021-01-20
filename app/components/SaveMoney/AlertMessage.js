import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import * as Animatable from 'react-native-animatable';
import { Colors, Metrics } from '../../theme'
import { Utils } from '../../utilities'
import { Text } from '..';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gray1Opacity,
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
    paddingVertical: Metrics.medium
  },
  title: {
    color: Colors.buttonPrimary[0],
    paddingVertical: Metrics.normal,
    fontWeight: 'bold'
  },
  txtContent: {
    textAlign: 'center',
    // lineHeight: Metrics.small * 2
  },
  buttonActive: {
    backgroundColor: Colors.buttonPrimary[0],
    marginHorizontal: Metrics.tiny,
    paddingVertical: Metrics.normal,
    borderRadius: Metrics.normal * 2,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: Colors.gray9,
    marginHorizontal: Metrics.normal * 4,
    paddingVertical: Metrics.tiny,
    borderRadius: Metrics.normal * 2,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  txtButton: {
    color: Colors.white,
    fontWeight: 'bold'
  },
  txtButtonActive: {
    color: Colors.buttonPrimary[0],
    fontWeight: 'bold'
  }
})

const AlertMessage = ({ title, content, isDouble, showAlert }) => {
  const onAccept = () => {
    showAlert(false, '', '')
  }
  return (
    <View style={styles.container}>
      <Animatable.View animation="bounceIn" style={styles.content}>
        <View style={styles.heading}>
          <Text style={[styles.txtContent, { fontWeight: 'bold' }]}>{title}</Text>
          <Text style={styles.txtContent}>{content}</Text>
        </View>
        <View style={{
          flexDirection: 'row',
          marginTop: Metrics.normal,
        }}
        >
          <TouchableOpacity onPress={onAccept} style={[styles.button]}>
            <Text style={styles.txtButton}>{'Huỷ bỏ'.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
    )
}

export default AlertMessage
