# 峡谷竞技场 CANYON ARENA

王者荣耀官方站（pvp.qq.com）功能参考的粉丝向静态演示站：英雄图鉴 · 皮肤鉴赏 · 铭文出装 · 赛事赛程 · 版本资讯。

## 设计语言

底座取自 [design-system-extraction-2026-10] 的 **03-zcode 站提取规范**（Tailwind v4 暗色体系），
按王者荣耀视觉覆写品牌层：

| Token | 值 | 来源 |
|---|---|---|
| 画布 | `#161616` | ZCode 提取 + pvp.qq.com 官网底色一致 |
| 面板 | `#1C1C1C` / Raised `#262626` | ZCode Surface/Raised |
| 墨色 | `#FFF` / `rgba(235,235,235,.62)` | ZCode 提取 |
| 主强调 | 王者金 `#F0B35C`（渐变至 `#F59E0B`） | amber-500 高亮位 × 王者官网金 `#BCA676` |
| 次强调 | `#0EA5E9` sky-500 | ZCode 提取 |
| 字阶 | H1 60/700 · H2 36/600 · H3 24/600 · UI 13/500 · 数字 mono | ZCode 提取 |
| 形状 | r10 / r16 / 胶囊 CTA，卡片无阴影、ring 1px white/8 | ZCode 提取 |
| 滚动条 | 金色滑块 `#BCA676` × `#292929` 轨道 | pvp.qq.com 官网签名 |

## 功能

- **英雄图鉴** `heroes.html` — 133 位英雄全量数据，职业/分路筛选 + 搜索；卡片点击弹窗：皮肤大图画廊（可切缩略图）、技能图标、推荐出装、铭文推荐、召唤师技能建议；深链 `heroes.html#h-131` 直开详情
- **版本资讯** `news.html` — S45「月照长安」条目分类 Tab + 展开详情
- **赛事中心** `match.html` — 赛程卡 + S/A 组积分榜（**示例数据**，页面有标注）
- **攻略数据** `strategy.html` — 93 枚五级铭文全量图鉴（红/蓝/绿筛选 + 搜索）、官方通用出装模板、分路打法口诀
- 首页聚合：版本 Banner、英雄精选、情报、赛程、攻略入口、热度榜（示例）

## 数据与素材

- 英雄/皮肤/铭文数据快照自官方公开接口 `pvp.qq.com/web201605/js/herolist.json`、`ming.json`（生成于 2026-10-02，见 `js/data.js`）
- 所有图片实时热链官方 CDN `game.gtimg.cn`，缺图自动降级为字牌占位
- **本站为学习用途演示站，与腾讯官方无关联；素材版权归腾讯及天美工作室所有。**

## 本地验证

```
cd tools && NODE_PATH=$(npm root -g) node verify.js   # Playwright 7 场景截图 + 控制台错误采集
```

## 部署

纯静态，任意静态托管直传根目录即可（Netlify / GitHub Pages 均无构建步骤）。
