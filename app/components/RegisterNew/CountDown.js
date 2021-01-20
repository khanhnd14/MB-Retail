import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { StyleSheet, View } from 'react-native'
import BackgroundTimer from 'react-native-background-timer';
import { Utils } from '../../utilities'
import { toHHMMSS } from '../../utilities/common'
import { Text } from '..'

const TOTAL = 180
const styles = StyleSheet.create({})
let interval
let total = TOTAL
function areEqual(prevProps, nextProps) {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
 return false
}
const CountDown = React.memo(forwardRef(({ endCountDown }, ref) => {
  const [time, setTime] = useState('')

  const clearCountDown = () => {
    total = TOTAL
    setTime(toHHMMSS(total))
    interval && BackgroundTimer.clearInterval(interval)
  }

  const onCountDown = () => {
    total = total > 0 ? total : TOTAL
    interval && BackgroundTimer.clearInterval(interval)
    // total--
    interval = BackgroundTimer.setInterval(() => {
      setTime(toHHMMSS(--total))
      // total--
      console.log(total);

      if (total === 0) {
        endCountDown()
        clearCountDown()
      }
    }, 1000)
  }

  useImperativeHandle(ref, () => ({

    clearCountDown,
    onCountDown

  }));
  useEffect(() => {
    onCountDown()
  }, [])
  return (
    <Text style={styles.text}>
      {time || toHHMMSS(total)}
    </Text>
  )
}), areEqual)

export default CountDown
