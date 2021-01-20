/* eslint-disable no-use-before-define */
import React, { useState, useEffect, Fragment } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { useSelector } from 'react-redux'
import { Helpers, Colors } from '../../theme'
import { Topbar } from '../../components'
import SoftTokenVerify from './SoftTokenVerify'
import SoftTokenActive from './SoftTokenActive'
import { storeService } from '../../services'
import I18n from '../../translations'

const SoftTokenScreen = () => {
  const { info } = useSelector((state) => state.softtoken)
  const [isActive, setActive] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getInfo()
  }, [])

  const getInfo = () => {
    storeService.getSoftTokenKey().then((key) => {
      setLoading(false)
      if (key) {
        setActive(true)
      } else {
        setActive(false)
      }
    })
  }

  const renderContent = () => {
    if (isActive) {
      if (info.data && info.data.status === 'ACTV') {
        return <SoftTokenVerify />
      }
      return <SoftTokenActive />
    }
    return <SoftTokenActive />
  }

  return (
    <Fragment>
      <Topbar title={I18n.t('main.softtoken')} isBottomSubLayout background={Colors.white} />
      <View style={[Helpers.fill, { backgroundColor: Colors.mainBg }]}>
        {loading ? (
          <View style={Helpers.fillCenter}>
            <ActivityIndicator size="large" color={Colors.primary2} />
          </View>
        ) : (
          renderContent()
        )}
      </View>
    </Fragment>
  )
}

export default SoftTokenScreen
