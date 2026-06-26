# 硅谷甄选运营平台

基于 Vue 3 + TypeScript + Vite 构建的后台管理系统，采用 RBAC 权限模型，支持动态路由、按钮级权限控制，并包含数据大屏可视化展示。

## 技术栈

| 分类        | 技术                                                |
| ----------- | --------------------------------------------------- |
| 框架        | Vue 3.5 + TypeScript 6.0                            |
| 构建        | Vite 8                                              |
| 路由        | Vue Router 5                                        |
| 状态管理    | Pinia 2                                             |
| UI 组件库   | Element Plus 2.13                                   |
| 图表        | ECharts 5.6 + echarts-liquidfill                    |
| HTTP 客户端 | Axios                                               |
| CSS 预处理  | Sass                                                |
| 工具库      | Lodash / Moment / NProgress                         |
| 代码规范    | ESLint + Prettier + Husky + Commitlint + Commitizen |
| Node 版本   | `^20.19.0 \|\| >=22.12.0`                           |

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产环境
pnpm build:pro

# 构建测试环境
pnpm build:test

# 预览构建产物
pnpm preview

# 代码检查与格式化
pnpm lint
pnpm format
```

## 环境变量

| 变量                | 说明         | 开发环境                       | 生产环境         |
| ------------------- | ------------ | ------------------------------ | ---------------- |
| `VITE_APP_TITLE`    | 应用标题     | 硅谷甄选运营平台               | 硅谷甄选运营平台 |
| `VITE_APP_BASE_API` | API 前缀     | `/dev-api`                     | `/prod-api`      |
| `VITE_SERVE`        | 后端接口地址 | `http://117.72.157.194:10086/` | 同上             |

## 目录结构

```
src/
├── api/                    # 接口层
│   ├── acl/                #   权限管理（用户/角色/菜单）
│   ├── product/            #   商品管理（品牌/属性/SPU/SKU）
│   └── user/               #   登录/用户信息
├── components/             # 公共组件
│   ├── BaseDialog/         #   通用对话框
│   ├── BaseDrawer/         #   通用抽屉
│   ├── Category/           #   商品分类选择器
│   └── SearchForm/         #   搜索表单
├── directive/              # 自定义指令
│   └── has.ts              #   v-has 按钮权限指令
├── layout/                 # 布局组件
│   ├── index.vue           #   主布局（侧边栏 + 顶部 + 内容区）
│   ├── logo/               #   Logo 组件
│   ├── menu/               #   侧边栏菜单
│   ├── tabbar/             #   顶部导航栏
│   └── main/               #   内容区
├── router/                 # 路由
│   ├── index.ts            #   路由实例 + 守卫
│   └── routes.ts           #   常量路由 + 异步路由
├── store/                  # 状态管理
│   ├── modules/
│   │   ├── user.ts         #   用户状态（登录/权限/路由）
│   │   └── setting.ts      #   设置（折叠/刷新）
│   └── index.ts
├── utils/                  # 工具函数
│   ├── request.ts          #   Axios 封装（拦截器/请求取消）
│   └── token.ts            #   Token 本地存储
├── views/                  # 页面
│   ├── acl/                #   权限管理
│   │   ├── user/           #     用户管理
│   │   ├── role/           #     角色管理
│   │   └── permission/     #     菜单管理
│   ├── product/            #   商品管理
│   │   ├── trademark/      #     品牌管理
│   │   ├── attr/           #     属性管理
│   │   ├── spu/            #     SPU 管理
│   │   └── sku/            #     SKU 管理
│   ├── screen/             #   数据大屏
│   │   ├── components/     #     大屏子组件（地图/图表/水球图等）
│   │   └── images/         #     大屏静态资源
│   ├── home/               #   首页
│   ├── login/              #   登录
│   └── 404/                #   404 页面
└── styles/                 # 全局样式
    └── variable.scss       #   SCSS 全局变量
```

## 功能模块

### 权限管理

基于 RBAC 模型，实现用户 → 角色 → 权限 三级关联控制：

- **用户管理** — 用户 CRUD、角色分配、批量删除
- **角色管理** — 角色 CRUD、菜单权限分配（树形勾选）
- **菜单管理** — 四级权限树维护（模块 / 菜单 / 页面 / 按钮）

### 权限控制流程

```
登录 → 获取用户信息 → 返回 routes[] + buttons[]
  │
  ├─ routes[] → filterAsyncRoute() → router.addRoute() → 动态路由注册
  ├─ routes[] → getUserRoutes() → menuRoutes → 侧边栏菜单渲染
  └─ buttons[] → v-has 指令 → 按钮级显隐控制
```

### 商品管理

- **品牌管理** — 品牌 CRUD + 上传 Logo
- **属性管理** — 三级分类属性维护
- **SPU 管理** — 标准化产品单元管理，包含销售属性与图片
- **SKU 管理** — 库存量单位管理，SPU 下的具体规格

### 数据大屏

智慧旅游可视化大数据平台，包含：

- 自适应缩放（1920×1080 设计稿，等比适配任意分辨率）
- 中国地图 + 飞线动画（ECharts + GeoJSON）
- 水球图、饼图、柱状图、折线图、散点图、雷达图
- 实时时钟、数字滚动展示

## 项目特性

- **TypeScript 严格模式** — 全量类型定义，API 层类型安全
- **自动按需引入** — `unplugin-auto-import` + `unplugin-vue-components` 自动导入 Element Plus
- **SCSS 全局变量** — `@/styles/variable.scss` 自动注入所有组件
- **路径别名** — `@` 映射到 `src/`
- **代理跨域** — 开发环境自动代理 `/dev-api` 到后端服务
- **Git 提交规范** — Husky + Commitlint + Commitizen 约束提交信息格式
- **ESLint + Prettier** — 统一的代码风格与自动修复

## 代理配置

开发环境下，Vite 开发服务器将 `/dev-api` 开头的请求代理到后端：

```
请求: /dev-api/admin/acl/user/1/10
  ↓
代理到: http://117.72.157.194:10086/admin/acl/user/1/10
```

配置位于 `vite.config.ts` 的 `server.proxy`。
