/**
 * 图片 URL 规范化
 * 后端返回 /api/static/img/xxx 格式的相对路径，需补上代理前缀 /dev-api
 * 在 dev 环境通过 Vite 代理转发；production 环境同理（nginx 等反向代理）
 */
export const normalizeImageUrl = (url: string): string => {
  if (!url) return ''
  if (url.startsWith('/api/')) {
    // 去掉 /api 前缀，补上 /dev-api 代理前缀
    // /api/static/xxx → /dev-api/static/xxx → proxy → backend /static/xxx
    return (import.meta.env.VITE_APP_BASE_API as string) + url.slice(4)
  }
  return url
}
