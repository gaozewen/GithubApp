

export default class DataRepository {
  fetchNetRepository = async (url) => {
    const resp = await fetch(url)
    return resp.json()
  }
}
