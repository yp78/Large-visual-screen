import request from '../utils/request'
import type { ParkResponseType } from '../types/ParkType'

//获取数据园数据
export const getParkInfo = () => {
  return request<ParkResponseType>('/park/statistics/info', 'GET')
}
