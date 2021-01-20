import React, { useEffect, useState, useCallback } from 'react'
import { View, ImageBackground, TouchableOpacity, Image, StatusBar } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'
import { Helpers, Images, Colors, Metrics } from '../../theme'
import { Text, Icon } from '../../components'
import MenuItem from './MenuItem'
import styles from './HomeScreenStyle'
import * as Navigation from '../../navigation'
import { appOperations } from '../../state/application'
import { notificationOperations } from '../../state/notification'
import I18n from '../../translations'
import { softTokenOperations } from '../../state/softtoken'
import HomeNotification from './HomeNotification'
import { getAcountList, getCardList, getCardListFull, getListSaveAcount } from '../../state/account/actions'

const HomeScreen = () => {
  const dispatch = useDispatch()
  const { activeCode, fullName } = useSelector((state) => state.user)
  const { countNotification } = useSelector((state) => state.application)
  const { dataAdvance } = useSelector((state) => state.notification)
  const [showNotification, setShowNoti] = useState(false)

  const flatMenu = [
    {
      moduleId: 210202,
      title: I18n.t('transfer.internal_transfer'),
      icon: 'home_chuyenkhoan',
      component: 'InternalTransfer',
    },
    {
      moduleId: 210202,
      title: I18n.t('transfer.transfer_interbank247'),
      icon: 'home_247',
      component: 'InterbankTransfer',
    },
    {
      moduleId: 210202,
      title: I18n.t('product.billing'),
      icon: 'home_thanhtoan',
      component: 'HistoryBillPayment',
    },
    {
      moduleId: 210502,
      title: I18n.t('main.topup'),
      icon: 'home_naptien',
      component: 'RechargeScreen',
    },
    {
      moduleId: 220206,
      title: I18n.t('main.saving'),
      icon: 'home_tietkiem',
      component: 'SaveScreen',
    },
    {
      moduleId: 210601,
      title: I18n.t('main.visa_service'),
      icon: 'home_the',
      component: 'CreditScreen',
    },
    {
      moduleId: 210513,
      title: I18n.t('main.qrcode'),
      icon: 'home_qr',
      component: 'ScanQrScreen',
    },
    {
      moduleId: 210501,
      title: I18n.t('main.softtoken'),
      icon: 'home_softtoken',
      component: 'SoftTokenScreen',
    },
  ]

  useEffect(() => {
    dispatch(
      appOperations.countNotification({
        activeCode,
      })
    )
    dispatch(
      notificationOperations.getDataAdvance({
        activeCode,
      })
    )
    dispatch(
      softTokenOperations.getSoftTokenInfo({
        activeCode,
      })
    )
  }, [])
  useEffect(() => {
    if (dataAdvance) {
      setShowNoti(true)
    }
  }, [dataAdvance])

  const showDetailNotification = () => {
    setShowNoti(false)
    Navigation.push('NotificationDetail', { notification: dataAdvance })
  }

  const onDetail = (module) => {
    Navigation.push(module.component)
  }

  const onNotification = () => {
    Navigation.push('NotificationScreen')
  }

  const renderMenuBoard = () => (
    <View style={[styles.menuBoardInner]}>
      {flatMenu.map((item, index) => (
        <MenuItem
          onPress={() => onDetail(item)}
          title={item.title}
          icon={item.icon}
          moduleId={item.moduleId}
          key={`${index}`}
        />
      ))}
    </View>
  )

  const renderNotification = () => {
    const displayNoti = countNotification > 99 ? '99+' : countNotification

    return (
      <View>
        <Icon name="icon-notification" size={27} style={[{ color: Colors.primary2 }]} />
        {countNotification > 0 && (
        <View style={styles.notificationContainer}>
          <Text
            style={{
              color: '#fff',
              fontSize: 9,
            }}
          >
            {displayNoti}
          </Text>
        </View>
      )}
      </View>
  )
}

  const txtTitle = `${I18n.t('main.welcome')}`
  return (
    <>
      <View style={styles.statusBar}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      </View>
      <View style={[Helpers.fill, Helpers.colCross]}>
        <View
          style={[
            Helpers.mainSpaceBetween,
            Helpers.row,
            Helpers.crossCenter,
            Helpers.fullWidth,
            styles.topbar,
            {
              paddingVertical: Metrics.medium,
            },
          ]}
        >
          <View style={{ width: Metrics.normal * 5.5 }} />
          <Image
            resizeMode="contain"
            source={Images.logo}
            style={[{ width: Metrics.small * 16.7, height: Metrics.medium * 2 }]}
          />
          <TouchableOpacity style={{ paddingHorizontal: Metrics.normal * 2 }} onPress={() => onNotification()}>
            {renderNotification()}
          </TouchableOpacity>
        </View>
        <ImageBackground
          style={[Helpers.fill, { backgroundColor: Colors.white }]}
          resizeMode="cover"
          imageStyle={[styles.bgContainer]}
          source={Images.bgHome}
        >
          <View style={Helpers.fill}>
            <Text
              style={[
                styles.title,
                { fontWeight: 'normal', marginTop: Metrics.normal * 2, marginBottom: Metrics.tiny },
              ]}
            >
              {txtTitle}
            </Text>
            <Text style={styles.title}>{fullName}</Text>
          </View>
          <View style={styles.menuBoardContainer}>{renderMenuBoard()}</View>
        </ImageBackground>
      </View>
      {dataAdvance && (
        <HomeNotification
          show={showNotification}
          onRequestClose={() => setShowNoti(false)}
          item={dataAdvance}
          onRequestDetail={() => showDetailNotification()}
        />
      )}
    </>
  )
}

export default HomeScreen
