

export default class DataRepository {
  fetchNetRepository = async (url) => {
    const resp = await fetch(url)
    const ret = resp.json()
    return ret
  }
}
