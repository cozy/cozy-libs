import { createContext, useContext } from 'react'

// When the tracking context is not available, this object is passed
// so that downstream components do not have to check for existence
// of the tracker
export const trackerShim = {
  trackPage: pageName => {},
  trackEvent: event => {}
}

// This should be used by apps wanting to track actions inside
// harvest
export const TrackingContext = createContext(trackerShim)

export const useTracker = () => useContext(TrackingContext)

export const withTracker = Component => props => {
  return (
    <TrackingContext.Consumer>
      {({ trackPage, trackEvent }) => (
        <Component {...props} trackPage={trackPage} trackEvent={trackEvent} />
      )}
    </TrackingContext.Consumer>
  )
}
