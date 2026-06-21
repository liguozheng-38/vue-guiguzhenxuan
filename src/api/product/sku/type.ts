export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//SKU图片对象
export interface SkuImage {
  ID?: number
  id?: number
  imgName?: string
  imgUrl?: string
  isDefault?: string
  skuId?: number
  spuImgId?: number
  createTime?: string
  updateTime?: string
}

//平台属性值对象
export interface SkuAttrValue {
  ID?: number
  id?: number
  attrId: number | string
  attrName?: string
  valueId: number | string
  valueName?: string
  skuId?: number
  createTime?: string
  updateTime?: string
}

//销售属性值对象
export interface SkuSaleAttrValue {
  ID?: number
  id?: number
  saleAttrId: number | string
  saleAttrName?: string
  saleAttrValueId: number | string
  saleAttrValueName?: string
  skuId?: number
  createTime?: string
  updateTime?: string
}

//定义SKU对象的ts类型
export interface SkuData {
  ID?: number
  id?: number
  category3Id?: string | number
  spuID?: number | string
  spuId?: number | string
  tmId?: number | string
  skuName?: string
  price?: number | string
  weight?: number | string
  skuDesc?: string
  skuDefaultImg?: string
  isSale?: number
  skuAttrValueList?: SkuAttrValue[]
  skuSaleAttrValueList?: SkuSaleAttrValue[]
  skuImageList?: SkuImage[]
  createTime?: string
  updateTime?: string
}

//获取SKU接口返回的数据ts类型
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[]
    total: number
    size: number
    current: number
    pages: number
    searchCount: boolean
  }
}

//获取SKU商品详情接口的ts类型
export interface SkuInfoData extends ResponseData {
  data: SkuData
}

//SPU图片列表
export interface SpuImageListResponse extends ResponseData {
  data: SpuImage[]
}

export interface SpuImage {
  ID?: number
  id?: number
  imgName?: string
  imgUrl?: string
  spuId?: number
  createTime?: string
  updateTime?: string
}

//SPU销售属性列表
export interface SpuSaleAttrListResponse extends ResponseData {
  data: SpuSaleAttr[]
}

export interface SpuSaleAttr {
  id?: number
  baseSaleAttrId?: number
  saleAttrName?: string
  spuId?: number
  spuSaleAttrValueList?: SpuSaleAttrValue[]
}

export interface SpuSaleAttrValue {
  ID?: number
  id?: number
  baseSaleAttrId?: number
  saleAttrValueName?: string
  spuId?: number
  createTime?: string
  updateTime?: string
}
