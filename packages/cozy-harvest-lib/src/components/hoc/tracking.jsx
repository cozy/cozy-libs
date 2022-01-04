import React, { createContext, useContext, useEffect } from 'react'

// When the tracking context is not available, this object is passed
// so that downstream components do not have to check for existence
// of the tracker
export const trackerShim = {
  trackPage: () => {},
  trackEvent: () => {}
}

// This should be used by apps wanting to track actions inside
// harvest
export const TrackingContext = createContext(trackerShim)

export const useTracker = () => useContext(TrackingContext)

export const useTrackPage = pageName => {
  const tracker = useTracker()
  useEffect(() => {
    tracker.trackPage(pageName)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}

export const withTracker = Component => {
  const Wrapped = props => (
    <TrackingContext.Consumer>
      {({ trackPage, trackEvent }) => (
        <Component {...props} trackPage={trackPage} trackEvent={trackEvent} />
      )}
    </TrackingContext.Consumer>
  )
  Wrapped.displayName = `withTracker(${
    Component.name || Component.displayName
  })`
  return Wrapped
}
