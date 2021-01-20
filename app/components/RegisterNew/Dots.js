import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Metrics, Colors } from '../../theme'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: Metrics.tiny * 2,
    justifyContent: 'center',
  },
  dot: {
    width: Metrics.tiny * 2,
    height: Metrics.tiny * 2,
    borderRadius: Metrics.tiny,
    backgroundColor: Colors.gray10,
    marginHorizontal: Metrics.tiny,
  },
  dotActive: {
    width: Metrics.tiny * 4,
    height: Metrics.tiny * 2,
    borderRadius: Metrics.tiny,
    backgroundColor: Colors.buttonPrimary[0],
    marginHorizontal: Metrics.tiny,
  }
})

const Dots = ({ isActive, dots, onChoiceDot }) => (
  <View style={styles.container}>
    {dots.map((value, index) => {
      switch (index) {
        case 6: case 1:
          return null
        default:
          break;
      }
      if (isActive === value.index) {
        return <TouchableOpacity key={index} style={styles.dotActive} />
      }
        return <TouchableOpacity key={index} onPress={() => onChoiceDot(value.index, value.subTitle)} style={styles.dot} />
    })}
  </View>
  )

export default Dots
