/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/require-default-props */
import React from 'react'
import { Image, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import PropTypes from 'prop-types'
import Modal from 'react-native-modal'
import Animated, { Easing } from 'react-native-reanimated'
import Icon from './MsbIcon'
import { Colors, Images, Metrics } from '../theme'
import { Config } from '../config'
import { Utils } from '../utilities'
import Text from './MsbText'
import I18n from '../translations'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarDefault: {
    color: Colors.white,
  },
  content: {
    backgroundColor: Colors.white,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Metrics.medium,
  },
  layoutSelect: {
    width: '100%',
    minHeight: Metrics.medium,
  },
  item: {
    padding: Utils.getRatioDimension(25),
    borderBottomColor: Colors.line,
    borderBottomWidth: 1,
    alignItems: 'center',
    width: '100%',
  },
})

class Avatar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isVisible: false,
      height: new Animated.Value(Utils.getRatioDimension(215)),
    }
  }

  componentDidUpdate(_prevProps, _prevState) {
    console.log('this.state.height:', this.state.height, this.state.isVisible);
    if (this.state.isVisible !== _prevState.isVisible) {
      if (!this.state.isVisible) {
        Animated.timing(this.state.height, {
          toValue: 0,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
        }).start()
      } else {
        Animated.timing(this.state.height, {
          toValue: Utils.getRatioDimension(215),
          duration: 300,
          easing: Easing.inOut(Easing.ease),
        }).start()
      }
    }
  }

  onPressInfo() {
    this.setState({
      isVisible: false,
    })
    if (this.props.onPressInfo) {
      this.props.onPressInfo()
    }
  }

  onPressGalery() {
    if (this.props.onPressGalery) {
      this.props.onPressGalery()
    }
  }

  onPressCamera() {
    if (this.props.onPressCamera) {
      this.props.onPressCamera()
    }
  }

  onClose() {
    console.log('asssss')
    this.setState({
      isVisible: false,
    })
  }

  render() {
    const { size, user, readOnly } = this.props
    const style = {
      width: Utils.getRatioDimension(size),
      height: Utils.getRatioDimension(size),
      borderRadius: Utils.getRatioDimension(size) / 2,
    }
    const uriProfile = user
      ? user.localProfilePicture
        ? user.localProfilePicture
        : `${Config.API_URL}servlet/CmsImageServlet?attachmentId=${user.profilePicture}`
      : null
    return (
      <TouchableWithoutFeedback
        disabled={readOnly}
        onPress={() =>
          this.setState({
            isVisible: true,
          })
        }
      >
        <View style={[styles.container, style]}>
          {uriProfile ? (
            <Image source={{ uri: uriProfile }} style={style} />
          ) : (
            <Icon name="icon-avatar" size={size / 2} style={styles.avatarDefault} />
          )}
          <Modal
            style={{
              margin: 0,
              justifyContent: 'flex-end',
            }}
            isVisible={this.state.isVisible}
            onBackdropPress={() => this.setState({
              isVisible: false,
            })}
            backdropTransitionOutTiming={0}
          >
            <View style={styles.layoutSelect}>
              <Animated.View style={[styles.content, { height: this.state.height }]}>
                <TouchableOpacity onPress={this.onPressInfo.bind(this)} style={styles.item}>
                  <Text>{I18n.t('setting.info_user')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.onPressGalery.bind(this)} style={styles.item}>
                  <Text>{I18n.t('setting.upload_galery')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.onPressCamera.bind(this)}
                  style={[styles.item, { borderBottomWidth: 0 }]}
                >
                  <Text>{I18n.t('setting.upload_camera')}</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

Avatar.defaultProps = {
  size: 48,
  style: {},
  readOnly: true,
}

Avatar.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
  size: PropTypes.number,
  readOnly: PropTypes.bool,
  onPressInfo: PropTypes.func,
  onPressGalery: PropTypes.func,
  onPressCamera: PropTypes.func,
}

export default Avatar
