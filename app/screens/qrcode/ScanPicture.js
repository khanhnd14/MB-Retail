import React, { useEffect, useState } from 'react'
import { StyleSheet, Animated, Easing, Platform, PermissionsAndroid } from 'react-native'
import ImagePicker from 'react-native-image-picker';
import { QRreader } from 'react-native-qr-decode-image-camera';
import { Utils } from '../../utilities';

const styles = StyleSheet.create({})

const ScanPicture = ({ parseQrData, setIndexTab }) => {
  const [path, setPath] = useState('')
  const [fadeInOpacity, setFadeInOpacity] = useState(new Animated.Value(0))

  const showImagePicker = () => {
    try {
      Utils.showLoading()
      ImagePicker.launchImageLibrary({}, (response) => {
        console.log('Response = ', response);
        Utils.hideLoading()
        if (response.didCancel) {
          console.log('User cancelled image picker');
          setIndexTab(0)
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else if (response.uri) {
          const file = Platform.OS === 'android' ? response.path : response.uri
            setPath(Platform.OS === 'android' ? `file:///${response.path}` : response.uri)
            QRreader(file)
              .then(data => {
                console.log(data)
                parseQrData(data)
              })
              .catch(err => {
                console.log(err)
                Utils.alert('Thông báo', err.message)
              });
        }
      });
    } catch (error) {
      console.log('====================================');
      console.log('error', error);
      console.log('====================================');
    }
  }

  const requestContactPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Allow Access Storage',
          message:
            'allow this app to read image library',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('granted');
        showImagePicker()
      } else {
        console.log('denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  useEffect(() => {
    Platform.OS === 'android' ? requestContactPermission() : showImagePicker()
  }, [])

  useEffect(() => {
    Animated.sequence([
      Animated.delay(1000),
      Animated.timing(fadeInOpacity, {
        toValue: 1,
        easing: Easing.inOut(Easing.quad),
        duration: 3000
      }),
    ]).start()
  }, [path])

  return (
    <Animated.View style={{
      width: '100%',
      opacity: fadeInOpacity,
      backgroundColor: 'transparent',
    }}
    >
      {path ? <Animated.Image style={{ width: '100%', height: '100%', resizeMode: 'contain' }} source={{ uri: path }} /> : null}
    </Animated.View>
  )
}

export default ScanPicture
