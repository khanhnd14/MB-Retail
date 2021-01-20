/* eslint-disable default-case */
import React, { useEffect, useRef, useState } from 'react'
import { Linking, PermissionsAndroid, Platform, View } from 'react-native'
import Geolocation from '@react-native-community/geolocation'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import { Topbar } from '../../components'
import i18n from '../../translations'
import { Utils } from '../../utilities'
import { atmOperations } from '../../state/atm'
import { MapUtils } from '../../services'
import SearchBar from './SearchBar'
import AppoxiLoca from './AppoxiLoca'
import Map from './Map'

const initCoord = {
  latitude: 21.011365000000005,
  longitude: 105.810976,
  latitudeDelta: 0.00922,
  longitudeDelta: 0.00421,
}
const ATMScreen = () => {
  const dispatch = useDispatch()

  const [currLocation] = useState(i18n.t('product.atm.my_location'))
  const [filterMaker, setFilterMaker] = useState([])
  const [lstBranches, setLstBranches] = useState([])
  const [map, setMap] = useState(null)
  const [isChosen, setIsChosen] = useState(false)
  const [isDenied, setIsDenied] = useState(false)
  const sheetRef = useRef(null)
  const { lstBranch, selectedBranch } = useSelector((state) => state.atm)

  useEffect(() => {
    if (lstBranch.length > 0) {
      setFilterMaker(_.compact(lstBranch).splice(0, 300))
    }
  }, [lstBranch])

  useEffect(() => {
    dispatch(atmOperations.clearBank([]))
    Utils.showLoading()
    Promise.all([
      dispatch(atmOperations.getAllBranchesAgencies({ type: 3 })),
      dispatch(atmOperations.getAllBranchesAgencies({ type: 1 })),
    ]).finally(() => {
      Utils.hideLoading()
    })
  }, [])

  const androidPer = async (watchID) => {
    await MapUtils.checkGPS()
    Utils.showLoading()
    Promise.all([
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION),
      // await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
    ])
      .then((result) => {
        console.log('====================================')
        console.log('result', result)
        console.log('====================================')
        if (
          result.includes(PermissionsAndroid.RESULTS.DENIED) ||
          result.includes(PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN)
        ) {
          setIsDenied(true)
          if (result.includes(PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN)) {
            Utils.alert(
              'Cảnh báo',
              'Bạn đã chọn "Never ask again", vui lòng cấp quyền truy cập vị trí trong cài đặt ứng dụng của bạn.',
              () => {
                Linking.openSettings()
              }
            )
          }
          Utils.hideLoading()
          return
        }
        watchID = Geolocation.watchPosition(
          (position) => {
            const currLongitude = position.coords.longitude
            const currLatitude = position.coords.latitude
            dispatch(
              atmOperations.selectBranch({
                currLongitude,
                currLatitude,
              })
            )
          },
          (error) => {
            console.log(error)
          }
        )
        Geolocation.getCurrentPosition(
          (position) => {
            const currLongitude = position.coords.longitude
            const currLatitude = position.coords.latitude
            dispatch(
              atmOperations.selectBranch({
                currLongitude,
                currLatitude,
              })
            )
          },
          (error) => {
            console.log(error)
          },
          {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000,
          }
        )
        return watchID
      })
      .catch((e) => {
        console.log('====================================')
        console.log(e)
        console.log('====================================')
      })
  }

  useEffect(() => {
    if (!isChosen) {
      let watchID
      if (Platform.OS === 'android') {
        try {
          watchID = androidPer(watchID)
        } catch (error) {
          console.log(error)
        }
      } else {
        watchID = Geolocation.watchPosition(
          (position) => {
            const currLongitude = position.coords.longitude
            const currLatitude = position.coords.latitude
            dispatch(
              atmOperations.selectBranch({
                currLongitude,
                currLatitude,
              })
            )
          },
          (error) => {
            setIsDenied(true)
            console.log(error)
          }
        )
        Geolocation.getCurrentPosition(
          (position) => {
            const currLongitude = position.coords.longitude
            const currLatitude = position.coords.latitude
            dispatch(
              atmOperations.selectBranch({
                currLongitude,
                currLatitude,
              })
            )
          },
          (error) => {
            setIsDenied(true)
            console.log(error)
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          }
        )
      }
      if (watchID) {
        Geolocation.clearWatch(watchID)
      }
    }
  }, [])

  return (
    <>
      <Topbar title={i18n.t('product.atm.title')} />
      {!isDenied && <SearchBar {...{ sheetRef }} {...{ setLstBranches }} {...{ lstBranch }} />}
      <View style={{ flex: 1 }}>
        <Map {...{ filterMaker }} {...{ setMap }} {...{ currLocation }} {...{ initCoord }} />
        <AppoxiLoca
          {...{ setIsChosen }}
          {...{ lstBranches }}
          {...{ setLstBranches }}
          {...{ sheetRef }}
          {...{ lstBranch }}
          {...{ initCoord }}
          {...{ selectedBranch }}
          {...{ map }}
          {...{ setFilterMaker }}
        />
      </View>
    </>
  )
}

export default ATMScreen
