//SKU模块接口管理
import request from '@/utils/request'
import type {
  SkuResponseData,
  SkuInfoData,
  SpuImageListResponse,
  SpuSaleAttrListResponse,
} from './type'

const API = {
  //获取已有的商品的数据-SKU
  SKU_URL: '/admin/product/list/',
  //上架
  SALE_URL: '/admin/product/onSale/',
  //下架的接口
  CANCELSALE_URL: '/admin/product/cancelSale/',
  //获取商品详情的接口
  SKUINFO_URL: '/admin/product/getSkuInfo/',
  //删除已有的商品
  DELETESKU_URL: '/admin/product/deleteSku/',
  //获取SPU图片列表
  SPUIMAGE_URL: '/admin/product/spuImageList/',
  //获取SPU销售属性列表
  SPUSALEATTR_URL: '/admin/product/spuSaleAttrList/',
}

//获取商品SKU的接口
export const reqSkuList = (page: number, limit: number) =>
  request.get<unknown, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)

//已有商品上架的请求
export const reqSaleSku = async (skuId: number) => {
  const res: any = await request.post<unknown, any>(API.SALE_URL + skuId)
  // 部分后端可能使用 GET 方式，上报 209 表示路径不存在，尝试回退到 GET
  if (res && res.code === 209) {
    return request.get<unknown, any>(API.SALE_URL + skuId)
  }
  return res
}

//下架的请求（兼容 POST / GET）
export const reqCancelSale = async (skuId: number) => {
  const res: any = await request.post<unknown, any>(API.CANCELSALE_URL + skuId)
  if (res && res.code === 209) {
    return request.get<unknown, any>(API.CANCELSALE_URL + skuId)
  }
  return res
}

//获取商品详情的接口
export const reqSkuInfo = (skuId: number) =>
  request.get<unknown, SkuInfoData>(API.SKUINFO_URL + skuId)

//删除某一个已有的商品
import type { ResponseData } from './type'

export const reqRemoveSku = (skuId: number) =>
  request.delete(API.DELETESKU_URL + skuId) as unknown as Promise<ResponseData>

//获取SPU图片列表
export const reqSpuImageList = (spuId: number) =>
  request.get<unknown, SpuImageListResponse>(API.SPUIMAGE_URL + spuId)

//获取SPU销售属性列表
export const reqSpuSaleAttrList = (spuId: number) =>
  request.get<unknown, SpuSaleAttrListResponse>(API.SPUSALEATTR_URL + spuId)
