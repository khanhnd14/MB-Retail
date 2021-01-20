import React from 'react'
import { Keyboard, View } from 'react-native'
import MapView, { Callout, Marker } from 'react-native-maps'
import { useSelector } from 'react-redux'
import { Text } from '../../components'
import { Images } from '../../theme'
import { Utils } from '../../utilities'
import CustomMaker from './CustomMaker'
import styles from './style'

const Map = ({ filterMaker, setMap, currLocation, initCoord }) => {
  const currentLatitudeDelta = initCoord.latitudeDelta * 2.5
  const currentLongitudeDelta = initCoord.longitudeDelta * 2.5
  const { selectedBranch } = useSelector((state) => state.atm)
  return (

    <MapView
      region={{
      latitude: selectedBranch.currLatitude || 0,
      longitude: selectedBranch.currLongitude || 0,
      latitudeDelta: currentLatitudeDelta,
      longitudeDelta: currentLongitudeDelta,
    }}
      ref={(mapView) => {
      setMap(mapView)
    }}
      style={{
      width: Utils.getWindowWidth(),
      height: Utils.getWindowHeight(),
    }}
      onPress={() => {
      Keyboard.dismiss()
    }}
    >
      <Marker
        coordinate={{
        latitude: Number(selectedBranch.currLatitude || 0),
        longitude: Number(selectedBranch.currLongitude || 0),
      }}
        image={Images.marker}
        icon={Images.marker}
        style={{ width: 20, height: 20 }}
      >
        <Callout tooltip>
          <View style={styles.bubble}>
            <Text style={{ textAlign: 'center' }}>{currLocation.trim()}</Text>
          </View>
        </Callout>
      </Marker>
      {filterMaker.length > 0 &&
      filterMaker.map((value, index) => <CustomMaker key={index} value={value} />)}
    </MapView>
  )
}

export default Map
