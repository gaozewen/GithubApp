export default (promise) => {
  let hasCanceled = false
  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then((val) => {
      hasCanceled ? reject({ isCanceled: true }) : resolve(val) // eslint-disable-line
    })
    promise.catch((error) => {
      hasCanceled ? reject({ isCanceled: true }) : resolve(error) // eslint-disable-line
    })
  })
  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled = true
    },
  }
}
