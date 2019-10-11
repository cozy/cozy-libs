import React, { Component } from 'react'
/**
 * @param {Component} WrappedComponent
 * @return {Component} WrappedComponent with `isOffline` props
 */
const withOffline = WrappedComponent =>
  class OfflineStateHOC extends Component {
    state = {
      isOnline: window.navigator.onLine
    }

    componentDidMount() {
      window.addEventListener('online', this.setOnline)
      window.addEventListener('offline', this.setOffline)
    }

    componentWillUnmount() {
      window.removeEventListener('online', this.setOnline)
      window.removeEventListener('offline', this.setOffline)
    }

    setOnline = () => this.setState({ isOnline: true })

    setOffline = () => this.setState({ isOnline: false })

    render() {
      const { isOnline } = this.state

      return <WrappedComponent isOffline={!isOnline} {...this.props} />
    }
  }

export default withOffline
