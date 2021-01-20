import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Metrics, Colors } from '../../theme'
import { Utils } from '../../utilities'
import { Text } from '../../components'

const styles = StyleSheet.create({
  viewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Metrics.small,
    borderBottomWidth: 1,
    borderColor: Colors.gray9,
    marginHorizontal: Metrics.small,
  },
  textContent: { fontFamily: 'Helvetica', color: Colors.gray1 },
  textAmount: {
    fontFamily: 'Helvetica',
    color: Colors.amountMinus,
  },
})

const DataCard = ({ infos }) => (
  <View
    style={{
          width: Utils.getWindowWidth() - Metrics.normal * 2,
          backgroundColor: Colors.white,
          borderBottomLeftRadius: Metrics.normal,
          borderBottomRightRadius: Metrics.normal
        }}
  >
    {
          infos.map((value, index) => (
            <View key={index} style={[styles.viewContent, { borderBottomWidth: index === infos.length - 1 ? 0 : 1 }]}>
              <Text style={styles.textContent}>{value.label}</Text>
              <Text style={styles.textAmount}>{value.content}</Text>
            </View>
          ))
        }

  </View>
    )

export default DataCard
