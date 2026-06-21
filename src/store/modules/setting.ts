//小仓库:layout组件相关配置仓库
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useDark } from '@vueuse/core'
import { SET_THEME_COLOR, GET_THEME_COLOR } from '@/utils/token'

const useLayOutSettingStore = defineStore('SettingStore', () => {
  // 用户控制菜单折叠还是收起控制
  const fold = ref(false)
  // 仓库这个属性用于控制刷新效果
  const refsh = ref(false)
  // 主题颜色（从 localStorage 恢复，无值则使用 Element Plus 默认色）
  const themeColor = ref<string>(GET_THEME_COLOR())
  // 暗黑模式：useDark 自动处理 localStorage 持久化 + <html> class 切换 + 系统偏好检测
  const isDark = useDark({ storageKey: 'DARK_MODE' })

  // 设置主题颜色
  const setThemeColor = (color: string) => {
    themeColor.value = color
    SET_THEME_COLOR(color)
    document.documentElement.style.setProperty('--el-color-primary', color)
  }

  // 初始化时同步主题颜色到 DOM
  if (themeColor.value !== '#409EFF') {
    document.documentElement.style.setProperty(
      '--el-color-primary',
      themeColor.value,
    )
  }

  return { fold, refsh, themeColor, isDark, setThemeColor }
})

export default useLayOutSettingStore
