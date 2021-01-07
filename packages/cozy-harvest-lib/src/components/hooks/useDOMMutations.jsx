import { useEffect } from 'react'

const useDOMMutations = (node, config, cb) => {
  useEffect(() => {
    let observer
    if (!window.MutationObserver) {
      return
    }
    if (node) {
      observer = new MutationObserver(cb)
      observer.observe(node, config)
    }
    return () => {
      observer && observer.disconnect()
    }
  }, [node, config, cb])
}

export default useDOMMutations
