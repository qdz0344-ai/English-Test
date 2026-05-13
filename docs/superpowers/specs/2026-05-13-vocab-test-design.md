# 英语单词测试网站 — 设计文档

## 概述

面向考研/四六级的英语单词测试网站，内置标准词库，支持多种测试模式，具备用户系统记录学习进度。

- **域名**：`llybb.ggff.net`
- **技术栈**：Next.js + Supabase + Vercel

## 架构

```
llybb.ggff.net → Vercel (Deploy)
  └─ Next.js (全栈)
       ├─ 前端页面 (React, Tailwind CSS)
       ├─ API Routes (后端接口)
       └─ 内置词库 JSON (打包在项目中)
  └─ Supabase
       ├─ Auth (用户注册/登录)
       └─ PostgreSQL (用户数据)
```

- Next.js 处理所有前端页面和少量 API（保存测试记录等）
- Supabase 处理用户认证和数据持久化
- 词库为静态 JSON 文件，不占数据库，读取快

## 数据模型

### 内置词库（前端 JSON 文件）

```
data/vocab/
  cet4.json     — 四级 (~4500词)
  cet6.json     — 六级 (~6000词)
  kaoyan.json   — 考研 (~5500词)
```

每个单词结构：
```ts
{
  id: string,
  word: string,        // 英文单词
  phonetic: string,    // 音标
  meanings: string[],  // 中文释义列表
  example?: string     // 例句（可选）
}
```

### Supabase 数据库

| 表 | 字段 | 说明 |
|---|---|---|
| `profiles` | id, user_id(FK→auth.users), nickname, created_at | 用户资料 |
| `test_records` | id, user_id, mode, word_bank, total, correct, time_sec, created_at | 测试记录 |
| `mistake_words` | id, user_id, word_id, word, error_count, last_error_at | 错词本 |

## 页面路由

| 路由 | 页面 | 说明 |
|---|---|---|
| `/` | 首页 | 词库选择 + 模式选择 |
| `/test` | 测试页 | 核心答题交互 |
| `/result` | 结果页 | 得分、错题回顾 |
| `/auth` | 登录/注册 | Supabase Auth UI |
| `/profile` | 个人中心 | 统计、历史、错词本 |

### 核心用户流程

```
首页 → 选词库(CET-4/6/考研) → 选模式(选择/拼写/听音) → 测试 → 结果 → 错题回顾
```

## 测试模式

### 选择题
- 显示英文单词 + 音标
- 4 个中文选项（1 正确 + 3 随机干扰项）
- 点击选项即时判定

### 拼写模式
- 显示中文释义 + 可选音标提示
- 用户输入英文单词
- 忽略大小写，容忍常见拼写变体

### 听音模式
- 播放单词发音（浏览器 TTS API）
- 用户输入英文拼写 + 中文释义

### 公共交互
- 顶部进度条（当前题号/总题数）
- "跳过"和"下一题"按钮
- 每题即时反馈

## 测试逻辑

1. 根据词库范围和题数随机抽取单词
2. 选择题从同词库取 3 个其他词释义作为干扰项
3. 每题作答后即时显示正确/错误 + 正确答案
4. 全部完成后写入 `test_records`，错词写入 `mistake_words`
5. 默认 20 题/轮，用户可选择 10/20/50 题

## 用户系统

- Supabase Auth 提供注册/登录/密码重置
- 邮箱 + 密码注册
- 未登录也可使用（数据存本地），但进度不跨设备同步
- 登录后所有记录关联 user_id

## 部署

在 ggff.net 的 DNS 管理后台添加 CNAME 记录：

```
类型: CNAME
主机: llybb
值:   cname.vercel-dns.com
```

Vercel 自动 HTTPS，后续 `git push` 自动部署。

## 范围外（本期不做）

- 单词导入功能
- 自定义词库
- 排行榜/社交功能
- 移动端 App
- 间隔重复算法
