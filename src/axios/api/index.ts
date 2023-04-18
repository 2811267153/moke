import Axios from '../request/axios';
// 在组件中发送请求
export const getUnikey = async (timestamp: string | number) => {
  try {
    const { data } = await Axios.get(`/login/qr/key?timestamp=${timestamp}`);
    return data
  } catch (error) {
    console.log('请求失败：', error);
  }
}
export const qrImage = async (key: string) => {
  try {
    const { data } = await Axios.get(`/login/qr/create?key=${key}&qrimg=true&timestamp=${Date.now()}`);
    return data
  } catch (error) {
    console.log('请求失败：', error);
  }
}
export const checkStatus = async (key: string) => {
  try {
    return await Axios.get(`/login/qr/check?key=${key}&timestamp=${Date.now()}`);
    // console.log("data",data);
    // return data
  } catch (error) {
    console.log('请求失败：', error);
  }
}
export const getLoginStatus = async (cookie: string = "") => {
  try {
    return await Axios.post(`/login/status?timestamp=${Date.now()}`, cookie)
  } catch (error) {
    console.log('请求失败：', error);
  }
}
export const getSearchWords = async () => {
  try {
    return await Axios.post(`/search/default`)
  } catch (error) {
    console.log('请求失败：', error);
  }
}
export const getNewSongToShelves = async (area: string = "", type: string = "", year: string = "", month: string = "") => {
  try {
    return await Axios.get(`/top/album?area=${area}&type=${type}&year=${year}&mouth=${month}`)
  } catch (error) {
    console.log('请求失败：', error);
  }
}
//推荐专辑
export const getPlayListToShelves = async () => {
  try {
    return await Axios.get(`/personalized`)
  } catch (error) {
    console.log('请求失败：', error);
  }
}