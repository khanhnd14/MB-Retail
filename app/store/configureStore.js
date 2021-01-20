import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
// import { createLogger } from 'redux-logger'
import AsyncStorage from '@react-native-community/async-storage'
import { ensureCompatibility } from './compatibility'
import * as reducers from '../state'
import { apiService, createLogger } from '../services'

const storage = AsyncStorage

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'application', 'softtoken'],
}

// function @onComplete
async function configureStore(onComplete) {
  const rootReducer = combineReducers(reducers)
  const didReset = await ensureCompatibility()

  const persistedReducer = persistReducer(persistConfig, rootReducer)

  const store = createStore(
    persistedReducer,
    {},
    applyMiddleware(apiService, thunk, createLogger(true)),
  )
  // eslint-disable-next-line no-unused-vars
  persistStore(store, storage, (_) => onComplete(didReset))
  return store
}

module.exports = configureStore
