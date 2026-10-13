# StyleAI

可本地运行的 AI 私人造型师前端 Demo，包含用户端和后台管理端。

## 启动

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

## 路由

- `/` 首页
- `/profile` 风格测试入口
- `/profile/test` 测试交互
- `/profile/test/result` AI 风格结果
- `/closet` 智能衣橱
- `/closet/upload` AI 衣物识别模拟
- `/stylist` AI 造型生成
- `/stylist/result` 造型结果
- `/style-personality` AI 风格人格测试
- `/closet/score` AI 衣橱评分
- `/beauty-plan` 今天变美计划
- `/calendar` 穿搭日历
- `/travel` 旅行胶囊衣橱
- `/try-on` 虚拟试穿
- `/looks` 收藏造型
- `/admin` 后台看板
- `/admin/users` 用户管理
- `/admin/templates` 造型模板

AI 分析和生成采用前端等待态模拟，后续可将 `setTimeout` 替换成真实 API 请求。
