import React, { Component, Fragment } from 'react'
import { TouchableOpacity, ActivityIndicator, View } from 'react-native'
import { Colors } from '../theme'

class MsbButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      disabled: props.disabled !== undefined ? props.disabled : false,
      loading: props.loading !== undefined ? props.loading : false,
    }
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    this.setState({
      disabled: nextProps.disabled !== undefined ? nextProps.disabled : false,
      loading: nextProps.loading !== undefined ? nextProps.loading : false,
    })
  }

  onPress = () => {
    const { disabled, loading } = this.state
    const { onPress } = this.props
    if (disabled || loading) {
      return
    }
    if (onPress) {
      onPress()
    }
  }

  render() {
    const { loading, disabled } = this.state
    const { color, indicatorStyle = {}, style = {}, children = null } = this.props
    return (
      <Fragment>
        {loading && (
          <View
            style={[
              {
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: color,
              },
              style,
            ]}
          >
            <ActivityIndicator
              style={indicatorStyle}
              animating={loading}
              color="white"
              size="small"
            />
          </View>
        )}
        {!loading && (
          <TouchableOpacity
            onPress={this.onPress}
            disabled={disabled}
            style={[
              {
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: color
              },
              style,
            ]}
          >
            {children}
          </TouchableOpacity>
        )}
      </Fragment>
    )
  }
}

export default MsbButton
