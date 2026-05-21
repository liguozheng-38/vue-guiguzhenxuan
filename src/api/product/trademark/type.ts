// 通用响应
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 品牌类型
export interface TradeMark {
  id?: number
  tmName: string
  logoUrl: string
  createTime?: { 'time.Time': string }
  updateTime?: { 'time.Time': string }
}

// 获取品牌列表响应 (非分页)
export interface TradeMarkListResponseData extends ResponseData {
  data: TradeMark[]
}

// 分页结果记录
export type Records = TradeMark

// 分页响应
export interface TradeMarkPageResponseData extends ResponseData {
  data: {
    current: number
    pages: number
    records: Records[]
    searchCount: boolean
    size: number
    total: number
  }
}
