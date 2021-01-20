import React from 'react'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'
import AppIntroSlider from './AppIntroSlider'
import { Images } from '../../theme'
import * as Navigation from '../../navigation'
import { appOperations } from '../../state/application'

const slides = [
  {
    key: 'somethun',
    title: '',
    text: '',
    image: Images.intro2,
    backgroundColor: '#fff',
  },
  {
    key: 'somethun-dos',
    title: '',
    text: '',
    image: Images.intro1,
    backgroundColor: '#fff',
  },
  {
    key: 'somethun1',
    title: '',
    text: '',
    image: Images.intro3,
    backgroundColor: '#fff',
  },
]

const IntroScreen = () => {
  const dispatch = useDispatch()

  const onComplete = () => {
    dispatch(appOperations.introComplete())
    Navigation.replace('Welcome')
  }

  return (
    <View style={{ flex: 1 }}>
      <AppIntroSlider
        bottomButton
        slides={slides}
        showSkipButton
        onDone={() => {
          onComplete()
        }}
        onSignup={() => {
          onComplete()
        }}
      />
    </View>
  )
}

export default IntroScreen
