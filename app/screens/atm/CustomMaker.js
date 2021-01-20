import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Text, View } from 'react-native'
import { Callout, Marker } from 'react-native-maps'
import { useSelector } from 'react-redux'
import { Images } from '../../theme'
import styles from './style'

const CustomMaker = forwardRef(({ value }, ref) => {
  const [marker, setMarker] = useState(null)
  const { selectedBranch } = useSelector(state => state.atm)

  const showCallOut = () => {
    marker?.showCallout()
  }

  useImperativeHandle(ref, () => ({

    showCallOut,

  }));

  useEffect(() => {
    // nếu branch đã đc chọn trùng với marker trên bản đồ
    if (selectedBranch.latitude?.toString() === value.latitude && selectedBranch.longitude?.toString() === value.longitude) {
      setTimeout(() => {
        showCallOut()
      }, 500);
    }
  }, [selectedBranch])

  return (
    <Marker
      ref={_marker => {
        setMarker(_marker)
      }}
      coordinate={{
        latitude: Number(value.latitude),
        longitude: Number(value.longitude),
      }}
      image={Images.marker}
      icon={Images.marker}
    >
      <Callout tooltip>
        <View style={styles.bubble}>
          <Text selectable style={{ textAlign: 'center' }}>{`${value.name}.\n${value.comments}`}</Text>
        </View>
      </Callout>
    </Marker>
  )
})

export default CustomMaker
