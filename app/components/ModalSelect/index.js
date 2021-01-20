import * as React from 'react'
import { StyleSheet, View, TouchableOpacity, Dimensions, Keyboard, Platform } from 'react-native'
import Modal from 'react-native-modal'
import Animated, { Easing } from 'react-native-reanimated'
import { Colors, Metrics } from '../../theme'
import MsbIcon from '../MsbIcon'
import { Text } from '..'
import { Utils } from '../../utilities'

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  layoutSelect: {
    width: '100%',
    minHeight: Metrics.medium
  },
  header: {
    backgroundColor: Colors.primary2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 37,
    paddingHorizontal: 40,
  },
  headerTitle: {
    fontSize: 14,
    textTransform: 'uppercase',
    color: Colors.white,
    fontWeight: 'bold',
  },
  headerIconClose: {
    marginRight: Metrics.normal,
  },
  content: { backgroundColor: Colors.white },

  iconChecked: {
    color: Colors.white,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  accountContainer: {
    flexDirection: 'row',
    width: '90%'
  },
  accountContainerChild1: {
    width: '25%',
    justifyContent: 'center',
    alignContent: 'center',
  },
  accountContainerChild2: {
    width: '75%',
  },
  accountText: {
    fontSize: 16,
    fontFamily: 'Calibri',
    lineHeight: 20,
    marginBottom: 8,
    marginTop: 8
  },
  accountText2: {
    color: '#878E9C',
    fontSize: 14,
    lineHeight: 17,
    fontFamily: 'Calibri',
    marginBottom: 8
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'lightgray',
    alignSelf: 'flex-end',
    marginRight: Metrics.normal + 1
  },
  hr: {
    width: screenWidth * (90 / 100),
    borderColor: '#EEEEEE',
    borderWidth: 0.5,
    borderStyle: 'solid'
  }
})

const ModalSelect = ({ children, title = '', visible, handleModal, maxHeight }) => {
  const [showKeyboard, setShowKeyboard] = React.useState(false)
  const [height, setHeight] = React.useState(new Animated.Value(maxHeight || 280))
  const _keyboardDidShow = () => {
    Platform.OS === 'ios' && Animated.timing(height, {
      toValue: Utils.getWindowHeight() / 1.5,
      duration: 300,
      easing: Easing.inOut(Easing.ease),

    }).start()
  };

  const _keyboardDidHide = () => {
    // Animated.timing(height, {
    //   toValue: 300,
    //   duration: 300,
    // }).start()
  };
  React.useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, [Keyboard]);

  React.useEffect(() => {
   if (!visible) {
    Animated.timing(height, {
      toValue: 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    }).start()
   } else {
    Animated.timing(height, {
      toValue: maxHeight || 280,
      duration: 300,
      easing: Easing.inOut(Easing.ease),

    }).start()
   }
  }, [visible]);

  return (
    <Modal
      style={{
        margin: 0,
        justifyContent: 'flex-end',
      }}
      isVisible={visible}
      onBackdropPress={() => handleModal(false)}
      backdropTransitionOutTiming={0}
    >
      <View style={styles.layoutSelect}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{title}</Text>
          <TouchableOpacity onPress={() => handleModal(false)}>
            <MsbIcon
              name="icon-close"
              size={16}
              color={Colors.white}
              style={styles.headerIconClose}
            />
          </TouchableOpacity>
        </View>
        <Animated.View style={[styles.content, { maxHeight: height, height }]}>{children}</Animated.View>
      </View>
    </Modal>
  )
}

export default ModalSelect
