import AsyncStorage from '@react-native-community/async-storage'

const LS_VERSIONING = 'MOBILERETAILUPGRADEUI_1.0'
const compatibleStoreVersion = '1.0'

async function updateCompatibility() {
  try {
    await AsyncStorage.setItem(LS_VERSIONING, compatibleStoreVersion)
    return true
  } catch (error) {
    //
  }
  return false
}

async function resetCompatibility() {
  try {
    // const keys = await AsyncStorage.getAllKeys()
    // force clear everything except for versioning (all reduxPersist:x and Parse:x keys)
    // const targets = (keys || []).filter((k) => k !== LS_VERSIONING)
    // if (targets.length) {
    //   await AsyncStorage.multiRemove(targets)
    // }
    // after storage reset, update the compatibility to the current storage version
    return await updateCompatibility()
  } catch (error) {
    //
  }
  return false
}

export async function ensureCompatibility() {
  try {
    const stored = await AsyncStorage.getItem(LS_VERSIONING)
    if (stored && stored === compatibleStoreVersion) {
      return false // no need to update
    }
  } catch (error) {
    //
  }
  const res = await resetCompatibility()
  return res
}
