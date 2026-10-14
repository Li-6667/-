# 随意搭 · 本地穿搭 Demo

18 条原有页面地址保留。这个版本可在浏览器里建档、测试风格、整理衣橱、生成和收藏搭配、安排日历，并管理本地演示模板。人物和衣物是原创复古漫画风插画；首页提供轻量动效，并尊重系统的“减少动态效果”设置。

## 启动与检查

```bash
npm install
npm run dev
```

打开 <http://127.0.0.1:3000>。质量检查：`npm test`、`npm run typecheck`、`npm run lint`、`npm run build`。

## 数据与能力边界

- 档案、测试答案、衣物图片、搭配、收藏、日历、计划和本地模板存于当前浏览器 IndexedDB。首次打开载入标明为“示例”的衣物；可在 `/admin/users` 清空或重新载入。
- 图片上传只接受 JPEG、PNG、WebP，单张不超过 10 MB；在浏览器里压缩后存储，不上传服务器。浏览器存储不可用时页面会提示仅本次会话有效。
- 风格结果和搭配来自可复核的本地规则，不是真实 AI。页面不提供真实登录、多用户管理、云端同步或虚拟上身试穿。`/try-on` 是衣物并排预览。
- 分享优先调系统分享；不可用时复制纯文字搭配清单。
- 数据属于此浏览器，清除网站数据后不可恢复。不要把敏感私人照片当作正式云服务上传；本 Demo 没有备份机制。

## 页面地址

`/`、`/profile`、`/profile/test`、`/profile/test/result`、`/style-personality`、`/closet`、`/closet/upload`、`/closet/score`、`/stylist`、`/stylist/result`、`/looks`、`/calendar`、`/beauty-plan`、`/travel`、`/try-on`、`/admin`、`/admin/templates`、`/admin/users`。

推荐主路径：`/profile` → `/profile/test` → `/closet/upload` → `/stylist` → `/stylist/result` → `/looks` → `/calendar`。结果页支持 `?look=<搭配 ID>`；不带 ID 时显示最近一次搭配，没有结果则提供明确入口。
