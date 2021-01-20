import React, { Fragment, useEffect, useState } from 'react'
import { View, StyleSheet, Linking, ScrollView } from 'react-native'
import HTML from 'react-native-render-html'
import { useDispatch, useSelector } from 'react-redux'
import { Metrics, Colors, Helpers } from '../../theme'
import { Topbar, Text, ConfirmButton } from '../../components'
import * as Navigation from '../../navigation'
import I18n from '../../translations'
import { Utils } from '../../utilities'
import { notificationOperations } from '../../state/notification'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBg,
    paddingHorizontal: Metrics.small * 1.8,
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    color: Colors.textBlack,
    marginBottom: Metrics.small,
  },
  time: {
    color: Colors.textBlack,
    marginBottom: Metrics.small,
    fontSize: 12
  },
  content: {
    fontSize: 13,
  },
  htmlText: {
    fontSize: Utils.getFontSize(14),
    fontFamily: 'HelveticaNeue',
  },
})

const NotificationDetail = ({ route }) => {
  const { notification } = route.params
  const { messageId, title, content, notifyType, typeCode } = notification || {}
  const { activeCode } = useSelector((state) => state.user)
  const { dataDetail } = useSelector((state) => state.notification)
  const [link, setLink] = useState(null)
  const [type, setType] = useState(null)
  const [contentHtml, setContent] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(notificationOperations.getDetail({ messageId, activeCode }))
  }, [])

  useEffect(() => {
    if (dataDetail) {
      setLink(dataDetail.linkDetail)
      setType(dataDetail.notiType)
      setContent(dataDetail.htmlContent)
      if (dataDetail.status === 'NEWR') {
        dispatch(notificationOperations.readNotification({ messageId, activeCode }))
      }
    }
  }, [dataDetail])

  const onDetail = () => {
    if (notifyType === 'A') {
      if (type === 'PC') {
        Navigation.push('ScanQrScreen')
        return
      }
      if (link) {
        if (link.indexOf('http') < 0) {
          let detailLink = link
          detailLink = `http://${detailLink}`
          Linking.openURL(detailLink)
        } else {
          Linking.openURL(link)
        }
        return
      }
    }
    if (typeCode === 'BP') {
      Navigation.push('BillPaymentScreen')
      return
    }
    if (typeCode === 'TR') {
      Navigation.push('TransferScreen')
    }
  }

  const renderButton = () => {
    if (notifyType === 'A') {
      if (type === 'PC') {
        return <ConfirmButton text={I18n.t('notification.button_use')} onPress={onDetail} />
      }
      if (link) {
        return <ConfirmButton text={I18n.t('notification.button_detail')} onPress={onDetail} />
      }
    }
    if (typeCode === 'BP') {
      return <ConfirmButton text={I18n.t('notification.button_billpayment')} onPress={onDetail} />
    }
    if (typeCode === 'TR') {
      return <ConfirmButton text={I18n.t('notification.button_transfer')} onPress={onDetail} />
    }
    return null
  }

  let htmlcont = contentHtml
  if (htmlcont) {
    htmlcont = htmlcont.replace('<img', '<img style="width:100%;"')
  }

  return (
    <Fragment>
      <Topbar
        title={I18n.t('notification.title_detail')}
        isBottomSubLayout
        background={Colors.white}
      />
      <View style={styles.container}>
        <View style={Helpers.fill}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>{title.toUpperCase()}</Text>
            <Text style={styles.time}>{notification.date} {notification.time}</Text>
            <Text style={styles.content}>{content}</Text>
            {htmlcont && (
              <HTML
                onLinkPress={(event, href) => {
                  Linking.openURL(href)
                }}
                ignoredStyles={['font-family', 'text-align']}
                baseFontStyle={styles.htmlText}
                html={htmlcont}
                imagesMaxWidth={Utils.getWindowWidth() - Metrics.small * 4}
              />
            )}
          </ScrollView>
        </View>

        {renderButton()}
      </View>
    </Fragment>
  )
}
export default NotificationDetail
