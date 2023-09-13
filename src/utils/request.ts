import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse, Method } from 'axios'
import type { Data } from '@/types/request'
import { getToken } from './cookie'

const instance = axios.create({
  baseURL: 'https://api-hmzs.itheima.net/v1',
  timeout: 10000
})

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (res: AxiosResponse) => {
    return res.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

const request = <T>(url: string, method: Method, submitData?: object) => {
  return instance.request<T, Data<T>>({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}

export default request
