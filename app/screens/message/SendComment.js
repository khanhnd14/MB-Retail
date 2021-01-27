/* eslint-disable no-undef */
import React, { Fragment, useEffect, useState, useRef } from 'react'
import { View, StyleSheet, Linking, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Metrics, Colors, Helpers } from '../../theme'
import { Topbar, TextInput, ConfirmButton, SelectBox, Text } from '../../components'
import * as Navigation from '../../navigation'
import I18n from '../../translations'
import { Utils } from '../../utilities'
import { messageOperations } from '../../state/message'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Metrics.small * 1.8,
    backgroundColor: Colors.white,
    marginHorizontal: Metrics.small * 1.8,
    paddingBottom: Metrics.small,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  title: {
    fontWeight: 'bold',
    color: Colors.primary2,
    fontSize: 12,
    paddingVertical: Utils.getRatioDimension(8),
  },
  time: {
    color: Colors.textBlack,
    marginBottom: Metrics.small,
    fontSize: 12,
  },
  content: {
    fontSize: 13,
    paddingVertical: Utils.getRatioDimension(8),
  },
  htmlText: {
    fontSize: Utils.getFontSize(14),
    fontFamily: 'HelveticaNeue',
  },
})

const SendComment = () => {
  const { dataDetail, comment, commentError } = useSelector((state) => state.message)
  const [loading, setLoading] = useState(false)
  // const [services, setListService] = useState([])
  const [service, setService] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const refDesc = useRef(null)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(messageOperations.getDetail())
  }, [])

  useEffect(() => {
    if (!_.isEmpty(dataDetail)) {
      // const tempList = []
      // dataDetail.forEach((item) => {
      //   tempList.push({ ...item, value: item.discription })
      // })
      // setListService(tempList)
      setService(dataDetail[0])
    }
  }, [dataDetail])

  useEffect(() => {
    if (loading) {
      setLoading(false)
      Navigation.pop()
      Utils.toast(I18n.t('application.success'))
    }
  }, [comment])
  useEffect(() => {
    if (loading) {
      setLoading(false)
    }
  }, [commentError])

  const onSend = () => {
    if (_.isEmpty(description) || _.isEmpty(title)) {
      Utils.toast(I18n.t('investigate.empty'))
    }
    Utils.confirm(
      I18n.t('investigate.confirmTitle'),
      I18n.t('investigate.confirmSendMessage'),
      () => {
        setLoading(true)
        const body = new FormData()
        body.append('title', title)
        body.append('content', description)
        body.append('serviceType', service.value)
        dispatch(
          messageOperations.comment(body)
        )
      }
    )
  }
  const onSelect = (item) => {
    setService(item)
  }

  return (
    <Fragment>
      <Topbar
        title={I18n.t('investigate.infoNotification')}
        isBottomSubLayout
        background={Colors.white}
      />
      <KeyboardAwareScrollView
        style={Helpers.fullWidth}
        showsVerticalScrollIndicator
        extraHeight={300}
        keyboardShouldPersistTaps="handled"
      >
        <View style={Helpers.fill}>
          <View style={[styles.container]}>
            <SelectBox
              title={I18n.t('investigate.serviceType')}
              data={dataDetail}
              defaultValue={service}
              onSelect={onSelect}
              textHolder={I18n.t('investigate.serviceType')}
              keyValue="discription"
            />
            <Text style={[styles.title]}>{I18n.t('investigate.topic')}</Text>

            <TextInput
              style={[styles.content, { borderBottomColor: Colors.line, borderBottomWidth: 1 }]}
              value={title}
              placeholder={I18n.t('investigate.topic')}
              placeholderTextColor="#81838A"
              onChangeText={(val) => {
              setTitle(val)
            }}
              onSubmitEditing={() => {
                refDesc?.current.focus()
            }}
              returnKeyType="next"
            />
            <Text style={[styles.title]}>{I18n.t('investigate.des')}</Text>

            <TextInput
              style={[styles.content]}
              ref={refDesc}
              value={description}
              placeholder={I18n.t('investigate.des')}
              placeholderTextColor="#81838A"
              onChangeText={(val) => {
              setDescription(val)
            }}
              multiline
              maxLength={150}
              returnKeyType="next"
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <ConfirmButton text={I18n.t('action.action_complete')} onPress={onSend} loading={loading} />
    </Fragment>
  )
}
export default SendComment
