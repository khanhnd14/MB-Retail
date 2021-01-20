import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Metrics, Colors } from '../../theme'
import { Text } from '..'

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Metrics.normal,
    paddingVertical: Metrics.small,
  },
  title: {
    color: Colors.buttonPrimary[0],
    alignSelf: 'center',
    fontWeight: 'bold',
    paddingVertical: Metrics.normal,
    fontSize: 15
  },
  heading: {
    fontWeight: 'bold',
    paddingBottom: Metrics.medium
  }
})

const Policy = () => (
  <View style={styles.container}>
    <Text style={styles.title}>{'Điều kiện mở tài khoản Online'.toLocaleUpperCase()}</Text>
    <View>
      <Text style={styles.heading}>I. Phạm vi áp dụng</Text>
      <Text>Integer ac neque lacinia, mollis risus sit amet, congue eros. Fusce id odio erat. Proin blandit imperdiet rutrum. Mauris velit justo, pharetra sit amet tellus nec, semper venenatis lacus. Aliquam fringilla dapibus lorem id congue. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla at urna feugiat, condimentum mi in, sollicitudin enim. In eu neque tempor orci placerat placerat in non eros. Cras et elementum urna, a aliquam ex. II. Giải thích từ ngữ Proin neque nisl, pulvinar in mollis et, pellentesque et metus. Mauris neque neque, tincidunt et condimentum sit amet, vulputate non nisi. Donec non malesuada nulla, sagittis porta lorem. Duis sit amet scelerisque nibh, in cursus turpis. Nulla facilisi. Proin congue id sapien nec efficitur. Mauris dictum lacinia libero. Maecenas ut mauris sagittis, blandit nunc vitae, iaculis justo. Nunc feugiat maximus quam quis luctus. Nam placerat vel nibh et aliquam. Etiam in fringilla tellus. Sed non metus ligula. Maecenas pretium ipsum ut dolor aliquet, quis luctus arcu posuere. Nunc vel gravida odio, id pellentesque massa. In condimentum porttitor porta.</Text>
    </View>
  </View>
  )

export default Policy
