import React, { useEffect, useRef, useState } from 'react'
import _ from 'lodash'
import { ApproximatedLocations } from './ApproximatedLocations'

function AppoxiLoca({
  initCoord,
  selectedBranch,
  lstBranch,
  map,
  setFilterMaker,
  sheetRef,
  setLstBranches,
  lstBranches,
  setIsChosen
}) {
  const animateToLocation = (rowData) => {
    setIsChosen(false)
    try {
      const latitudeDelta = initCoord.latitudeDelta * 0.5
      map?.animateToRegion(
        {
          latitude: parseFloat(rowData.latitude),
          longitude: parseFloat(rowData.longitude),
          latitudeDelta,
          longitudeDelta: latitudeDelta,
        },
        300
      )
    } catch (error) {
      console.log('====================================')
      console.log('e', error)
      console.log('====================================')
    }
  }

  const onClose = () => {
    sheetRef?.current?.close()
  }

  const setFilterMakers = (markers) => {
    setFilterMaker(markers)
  }

  useEffect(() => {
    if (lstBranch.length > 0) {
      setLstBranches(_.compact(lstBranch).splice(0, 300))
    }
  }, [lstBranch])

  return (
    <ApproximatedLocations
      ref={sheetRef}
      filterBranch={lstBranches}
      currentLatitude={selectedBranch.currLatitude || 0}
      currentLongitude={selectedBranch.currLongitude || 0}
      animateToLocation={animateToLocation}
      sheetRef={sheetRef}
      setFilterMakers={setFilterMakers}
      onClose={onClose}
    />
  )
}

export default AppoxiLoca
