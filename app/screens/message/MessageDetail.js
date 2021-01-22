import React, { Fragment, useEffect, useState } from 'react'
import { View, StyleSheet, Linking, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import { Metrics, Colors, Helpers } from '../../theme'
import { Topbar, Text, ConfirmButton } from '../../components'
import * as Navigation from '../../navigation'
import I18n from '../../translations'
import { Utils } from '../../utilities'
import { messageOperations } from '../../state/message'

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
    fontSize: 12,
  },
  content: {
    fontSize: 13,
  },
  htmlText: {
    fontSize: Utils.getFontSize(14),
    fontFamily: 'HelveticaNeue',
  },
})

const MessageDetail = ({ route }) => {
  const { notification } = route.params
  const { serviceType, acceptContent, content, messageId, typeCode } = notification || {}
  const { activeCode } = useSelector((state) => state.user)
  const { dataDetail, delet, deletError } = useSelector((state) => state.message)
  const [service, setService] = useState(I18n.t('investigate.infoNotification'))
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(messageOperations.getDetail())
  }, [])

  useEffect(() => {
    if (dataDetail) {
      const services = _.filter(dataDetail, (item) => item.code === serviceType)
      if (!_.isEmpty(services)) {
        setService(services[0].discription)
      }
    }
  }, [dataDetail])
  useEffect(() => {
    if (loading) {
      setLoading(false)
      Navigation.pop()
    }
  }, [delet])
  useEffect(() => {
    if (loading) {
      setLoading(false)
    }
  }, [deletError])

  const onDelete = () => {
    setLoading(true)
    dispatch(messageOperations.deleteMess({
      messageId
    }))
  }

  return (
    <Fragment>
      <Topbar
        title={I18n.t('investigate.infoNotification')}
        isBottomSubLayout
        background={Colors.white}
      />
      <View style={styles.container}>
        <View style={Helpers.fill}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>{service.toUpperCase()}</Text>
            <Text style={styles.time}>
              {notification.date} {notification.time}
            </Text>
            <Text style={styles.content}>{content}</Text>
            <Text style={[styles.content, { color: Colors.gray2 }]}>{acceptContent}</Text>
          </ScrollView>
        </View>

        <ConfirmButton text={I18n.t('action.action_delete')} onPress={onDelete} loading={loading} />
      </View>
    </Fragment>
  )
}
export default MessageDetail
