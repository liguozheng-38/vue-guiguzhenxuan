<template>
  <div class="skeleton-wrapper">
    <!-- 表格骨架屏 -->
    <template v-if="type === 'table'">
      <div class="skeleton-table">
        <!-- 表格头部 -->
        <div class="skeleton-row skeleton-header">
          <div
            v-for="(col, index) in columns"
            :key="`th-${index}`"
            class="skeleton-cell"
            :style="{ width: col.width || '100px' }"
          ></div>
        </div>
        <!-- 表格内容行 -->
        <div
          v-for="rowIndex in rows"
          :key="`tr-${rowIndex}`"
          class="skeleton-row"
        >
          <div
            v-for="(col, colIndex) in columns"
            :key="`td-${rowIndex}-${colIndex}`"
            class="skeleton-cell"
            :style="{ width: col.width || '100px' }"
          >
            <div v-if="col.type === 'image'" class="skeleton-image"></div>
            <div v-else-if="col.type === 'actions'" class="skeleton-actions">
              <span class="skeleton-btn"></span>
              <span class="skeleton-btn"></span>
            </div>
            <div
              v-else
              class="skeleton-text"
              :style="{ width: col.textWidth || '60%' }"
            ></div>
          </div>
        </div>
      </div>
    </template>

    <!-- 表单/筛选框骨架屏 -->
    <template v-else-if="type === 'form'">
      <div class="skeleton-form">
        <div v-for="i in rows" :key="`form-${i}`" class="skeleton-form-item">
          <div class="skeleton-label"></div>
          <div class="skeleton-input"></div>
        </div>
      </div>
    </template>

    <!-- 卡片骨架屏 -->
    <template v-else-if="type === 'card'">
      <div class="skeleton-card">
        <div class="skeleton-card-image"></div>
        <div class="skeleton-card-content">
          <div class="skeleton-text skeleton-card-title"></div>
          <div class="skeleton-text skeleton-card-desc"></div>
        </div>
      </div>
    </template>

    <!-- 列表骨架屏 -->
    <template v-else-if="type === 'list'">
      <div class="skeleton-list">
        <div v-for="i in rows" :key="`list-${i}`" class="skeleton-list-item">
          <div class="skeleton-avatar"></div>
          <div class="skeleton-list-content">
            <div class="skeleton-text skeleton-list-title"></div>
            <div class="skeleton-text skeleton-list-desc"></div>
          </div>
        </div>
      </div>
    </template>

    <!-- 自定义内容插槽 -->
    <template v-else>
      <slot></slot>
    </template>
  </div>
</template>

<script setup lang="ts">
/**
 * 轻量级骨架屏组件
 * @description 支持表格、表单、卡片、列表四种类型，可自定义列配置
 * @example
 * // 表格骨架屏
 * <Skeleton
 *   type="table"
 *   :rows="3"
 *   :columns="[
 *     { width: '80px' },
 *     { width: '150px', textWidth: '70%' },
 *     { width: '120px', type: 'image' },
 *     { width: '180px', type: 'actions' }
 *   ]"
 * />
 *
 * // 表单骨架屏
 * <Skeleton type="form" :rows="4" />
 *
 * // 卡片骨架屏
 * <Skeleton type="card" />
 *
 * // 列表骨架屏
 * <Skeleton type="list" :rows="5" />
 */

interface ColumnConfig {
  width?: string
  type?: 'text' | 'image' | 'actions'
  textWidth?: string
}

withDefaults(
  defineProps<{
    // 骨架屏类型
    type?: 'table' | 'form' | 'card' | 'list'
    // 行数/项数
    rows?: number
    // 表格列配置（type=table时生效）
    columns?: ColumnConfig[]
  }>(),
  {
    type: 'table',
    rows: 3,
    columns: () => [
      { width: '80px' },
      { width: '150px', textWidth: '70%' },
      { width: '120px', textWidth: '80%' },
      { width: '180px', type: 'actions' },
    ],
  },
)
</script>

<style scoped lang="scss">
.skeleton-wrapper {
  width: 100%;
}

// 动画效果
@keyframes skeleton-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.skeleton-text,
.skeleton-image,
.skeleton-btn,
.skeleton-label,
.skeleton-input,
.skeleton-card-image,
.skeleton-avatar {
  background: var(--el-skeleton-color, #e5e7eb);
  border-radius: 4px;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

// 表格骨架屏
.skeleton-table {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  overflow: hidden;
}

.skeleton-row {
  display: flex;
  padding: 12px 0;

  &.skeleton-header {
    background: var(--el-fill-color-light);
    border-bottom: 1px solid var(--el-border-color-lighter);

    .skeleton-cell {
      background: var(--el-fill-color);
    }
  }

  &:not(.skeleton-header) {
    border-bottom: 1px solid var(--el-border-color-lighter);

    &:last-child {
      border-bottom: none;
    }
  }
}

.skeleton-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
}

.skeleton-text {
  height: 14px;
}

.skeleton-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
}

.skeleton-actions {
  display: flex;
  gap: 8px;
}

.skeleton-btn {
  width: 50px;
  height: 32px;
}

// 表单骨架屏
.skeleton-form {
  padding: 20px;
}

.skeleton-form-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.skeleton-label {
  width: 80px;
  height: 14px;
  margin-right: 12px;
}

.skeleton-input {
  flex: 1;
  height: 40px;
}

// 卡片骨架屏
.skeleton-card {
  padding: 16px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
}

.skeleton-card-image {
  width: 100%;
  height: 150px;
  margin-bottom: 12px;
}

.skeleton-card-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-card-title {
  width: 60%;
  height: 20px;
}

.skeleton-card-desc {
  width: 80%;
  height: 14px;
}

// 列表骨架屏
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-list-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
}

.skeleton-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 12px;
}

.skeleton-list-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-list-title {
  width: 50%;
  height: 16px;
}

.skeleton-list-desc {
  width: 70%;
  height: 12px;
}
</style>
