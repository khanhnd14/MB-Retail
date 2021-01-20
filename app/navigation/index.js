/* eslint-disable no-empty */
/* eslint-disable no-unused-expressions */
import * as React from 'react'
import { StackActions } from '@react-navigation/native'
import { map } from '../routes/map'
import { storeService } from '../services'

export const navigationRef = React.createRef()

export function navigate(name, params = {}) {
  navigationRef && navigationRef.current?.navigate(name, params)
}

export function push(name, params = {}) {
  try {
    if (map[name]) {
      const module = storeService.getListModule()[map[name].moduleId]
      if (module) {
        const action = StackActions.push(name, params)
        navigationRef && navigationRef.current?.dispatch(action)
      }
    } else {
      const action = StackActions.push(name, params)
      navigationRef && navigationRef.current?.dispatch(action)
    }
  } catch (error) {}
}

export function pop() {
  const action = StackActions.pop(1)
  navigationRef && navigationRef.current?.dispatch(action)
}

export function replace(name, params = {}) {
  try {
    if (map[name]) {
      const module = storeService.getListModule()[map[name].moduleId]
      if (module) {
        const action = StackActions.replace(name, params)
        navigationRef && navigationRef.current?.dispatch(action)
      }
    } else {
      const action = StackActions.replace(name, params)
      navigationRef && navigationRef.current?.dispatch(action)
    }
  } catch (error) {}
}

export function resetTo(name) {
  navigationRef &&
    navigationRef.current?.reset({
      index: 0,
      routes: [{ name }],
    })
}

export function popToPop() {
  const action = StackActions.popToTop()
  navigationRef && navigationRef.current?.dispatch(action)
}

export function popN(n = 1) {
  const action = StackActions.pop(n)
  navigationRef && navigationRef.current?.dispatch(action)
}
