# 日英简历对照与翻译差异说明

对照文件：

- `public/resume/resume.html`
- `public/resume/resume-en.html`

## 1. 总体结论

英文版在结构上与日文版是对齐的，没有出现 section 缺失或项目遗漏。

结构核对结果：

| 项目 | 日文版 | 英文版 | 结论 |
| --- | ---: | ---: | --- |
| 顶层数据块 | 10 | 10 | 一致 |
| 联系方式 | 5 | 5 | 一致 |
| 技能项 | 6 | 6 | 一致 |
| 语言项 | 2 | 2 | 一致 |
| 证书项 | 4 | 4 | 一致 |
| 强项项数 | 3 | 3 | 一致 |
| 公司经历 | 2 | 2 | 一致 |
| 项目总数 | 6 | 6 | 一致 |
| 教育经历 | 1 | 1 | 一致 |

整体判断：

- 英文版大部分内容属于“自然英文意译”，不是逐句直译。
- 大多数改写没有丢失核心事实，但有少量地方出现了词义偏移、额外推断或招聘语境下的强化表达。
- 如果目标是“和日文版完全对照”，英文版还需要做几处收敛，让它更贴近日文原意。

## 2. 最值得注意的差异

以下几处不是普通的语言本地化，而是会影响“与日文版完全一致”的重点差异：

| 位置 | 日文版 | 英文版 | 差异判断 |
| --- | --- | --- | --- |
| 姓名 | `劉 洋` | `Yang Liu` | 英文版做了罗马字化并改成英文姓名顺序，不是逐字对应 |
| Key Point 1 | `13年システム設計・開発` | `13 years in system design & delivery` | `開発` 被改成了 `delivery`，语义变宽，不是直译 |
| Key Point 5 | `AI活用` | `AI-enabled development` | 英文版强调“AI 驱动开发”，比原文更具体 |
| Skill 6 | `Python / AI活用` | `Python / AI Tooling` | `AI活用` 被改成了 `AI Tooling`，偏向“AI 工具”而非“AI 활용/应用” |
| 教育背景 | `日本語` | `B.A. in Japanese` | 英文版新增了学位推断，原文并没有明确写 `B.A.` |
| 公司英文名 | `株式会社キーサイエンス` / `スナオ株式会社` / `中国第一自動車集団` | `Keyscience Co., Ltd.` / `Sunao Co., Ltd.` / `FAW Group` | 英文版使用了英文/推定英文名，但这些官方写法并未在源文件中明示 |
| 阶段标签 | `運用保守` | `Operations` | `保守` 的含义丢失，更准确应接近 `Operations & Maintenance` |
| Portfolio purpose | `継続開発` | 未明确写 `continuous development` | 英文版弱化了“持续开发”这个动作 |
| Strength 3 | `技術検証を継続している` | `validate emerging technologies in practice` | 英文版加入了 `emerging technologies`，原文没有“新兴技术”限定 |

## 3. 逐项对照

### 3.1 个人信息 / Profile

| 项目 | 日文版 | 英文版 | 判断 |
| --- | --- | --- | --- |
| 姓名 | `劉 洋` | `Yang Liu` | 意译，本地化处理 |
| 标题 | `Technical Lead \| Systems Architecture / Java / AWS` | `Technical Lead \| Systems Architecture / Java / AWS` | 一致 |

Key Points 对照：

| 日文版 | 英文版 | 判断 |
| --- | --- | --- |
| `13年システム設計・開発` | `13 years in system design & delivery` | 有偏移，`開発` 更接近 `development` |
| `既存解析→本番化` | `Legacy analysis to production` | 基本一致 |
| `0→1 単独推進` | `0-to-1 independent execution` | 基本一致 |
| `AWS認定4資格` | `4 AWS certifications` | 基本一致 |
| `AI活用` | `AI-enabled development` | 有偏移，英文更具体 |

Summary 对照：

- 第 1 段：
  - 日文版强调“复杂既存基干系统的限制”“可实施可运维的重构方针”“落到系统架构”“从既存解析到运用定着的全流程负责”。
  - 英文版基本保留了这些要点，但把 `再構築方針` 强化成了 `modernization strategies`，语气更偏国际招聘文案。
- 第 2 段：
  - 日文版强调“Java / Spring 为轴”“API / Batch / 数据联携 / DB / Cloud 的横向能力”“在复杂约束下以小团队自走推动 0→1 和持续改善”。
  - 英文版整体意思对齐，但把 `業務システム` 译成了 `business-critical systems`，语气更强一些。

### 3.2 联系方式 / Contact

| 日文版 | 英文版 | 判断 |
| --- | --- | --- |
| `東京都江東区南砂` | `Minamisuna, Koto-ku, Tokyo` | 正常本地化 |
| `在留資格：永住者（就労制限なし）` | `Permanent Resident (no work restrictions)` | 基本一致，但省略了 `Status:` 前缀 |
| 电话 / 邮箱 / 网站 | 一致 | 一致 |

### 3.3 技能 / Skills

| 日文版 | 英文版 | 判断 |
| --- | --- | --- |
| `Java / Spring Ecosystem` | `Java / Spring Ecosystem` | 一致 |
| `API / Batch / External Integration` | `API / Batch / External Integration` | 一致 |
| `AWS Cloud（認定4資格）` | `AWS Cloud (4 certifications)` | 一致 |
| `RDB設計・SQL最適化` | `RDB Design / SQL Optimization` | 基本一致 |
| `React / Next.js / TypeScript` | `React / Next.js / TypeScript` | 一致 |
| `Python / AI活用` | `Python / AI Tooling` | 有偏移，建议改成更接近“AI 活用/应用”的表达 |

### 3.4 语言 / Languages

| 日文版 | 英文版 | 判断 |
| --- | --- | --- |
| `日本語能力試験 N1（2012.7）` | `JLPT N1 (Jul 2012)` | 一致 |
| `TOEIC 785（2024.11）` | `TOEIC 785 (Nov 2024)` | 一致 |

### 3.5 证书 / Certifications

证书名称和数量一致，仅日期格式由 `2025.2` 改为 `Feb 2025` 这类英文写法，属于正常本地化。

### 3.6 代表项目 / Featured Project

| 项目 | 日文版 | 英文版 | 判断 |
| --- | --- | --- | --- |
| 名称 | `個人サイト / 代表作ポートフォリオ` | `Personal Website / Flagship Portfolio` | 基本一致 |
| Purpose | `個人サイト上で履歴書・技術Blog・個人開発物を公開し、代表作としてNBA予測Webアプリを継続開発` | `Publishes my resume, technical blog, and personal products through my website, with an NBA prediction web app as the flagship project.` | 有轻微缺失，`継続開発` 没有明确译出 |
| Desc | `個人サイトを作品導線として運用し...補足資料として活用` | `Operates my personal site as a portfolio hub...supporting material...` | 基本一致 |
| Note | `Appendix参照` | `See appendix...` | 一致 |

### 3.7 强项 / Strengths

| 日文版 | 英文版 | 判断 |
| --- | --- | --- |
| `複雑な既存業務・システム制約を整理し...` | `Translate complex legacy business and system constraints...` | 基本一致 |
| `単独または少人数体制でも...` | `Independently drive 0-to-1 delivery through production...` | 基本一致 |
| `生成AI×Cloudの個人プロダクトを継続開発・公開し、技術検証を継続している` | `Continuously build and publish GenAI x Cloud personal products to validate emerging technologies in practice.` | 有偏移，英文新增了 `emerging technologies` |

## 4. 工作经历对照

### 4.1 公司层级

| 日文版 | 英文版 | 判断 |
| --- | --- | --- |
| `株式会社キーサイエンス／日本` | `Keyscience Co., Ltd. / Japan` | 英文公司名为推定写法，建议确认官方英文名 |
| `スナオ株式会社／中国` | `Sunao Co., Ltd. / China` | 同上，建议确认 |
| `2017.8 ~ 現在` / `2013.6 ~ 2017.5` | `Aug 2017 - Present` / `Jun 2013 - May 2017` | 正常本地化 |
| `テクニカルアーキテクト` / `システムエンジニア` | `Technical Architect` / `Systems Engineer` | 基本一致 |

### 4.2 项目 1: JAL

整体评价：

- 核心事实一致。
- 英文版属于招聘导向的自然英文改写，没有明显漏项。

需要注意的差异：

| 位置 | 日文版 | 英文版 | 判断 |
| --- | --- | --- | --- |
| Team Size | `構築期15名→現在6名` | `15 build -> 6 now` | 意思一致，但英文表达不够自然 |
| Phases | `運用保守` | `Operations` | `保守` 丢失 |
| Summary | `本番定着化` | `production stabilization` | 基本一致 |
| Highlight 2 | `複数施策の並行審査を安定化` | `stabilized parallel review workflows` | 更概括，不算错误 |
| Highlight 5 | `体制づくりに貢献` | `to sustain delivery with a smaller team` | 基本一致，但英文更结果导向 |

### 4.3 项目 2: YAMATO

整体评价：

- 内容基本对齐，没有明显事实偏移。
- 主要是表达风格从日文项目说明改成了更自然的英文简历文案。

可注意点：

| 位置 | 日文版 | 英文版 | 判断 |
| --- | --- | --- | --- |
| Team Size | `全体15名` | `15` | 轻微简化，`overall` 含义省略 |
| Task | `外部IFの組み込み` | `integrating external interfaces` | 一致 |
| Mentoring | `自社新人の技術指導` | `mentoring junior engineers` | 基本一致，但未保留“自社” |

### 4.4 项目 3: AEON

整体评价：

- 核心意思一致。
- 技术亮点和结果都保留得比较完整。

可注意点：

| 位置 | 日文版 | 英文版 | 判断 |
| --- | --- | --- | --- |
| Summary | `Backend基盤の立ち上げを担当` | `including the async messaging foundation` | 英文保留重点，但没有完整保留“backend foundation launch”语感 |
| Highlight 2 | `Pad端末` | `staff iPads` | 正常本地化 |
| Phases | `運用保守` | `Operations` | 同样少了 `Maintenance` |

### 4.5 项目 4: 欧亜E購

整体评价：

- 对齐度较高。
- 术语翻译自然，亮点保留完整。

可注意点：

| 位置 | 日文版 | 英文版 | 判断 |
| --- | --- | --- | --- |
| Client Name | `欧亜E購` | `Ouya E-Gou` | 拼音化/英文名化，建议确认是否是你想要的对外写法 |
| Role | `TL` | `Team Lead` | 一致 |
| Task | `開発推進` | `delivery management` | 基本一致，但英文更偏管理描述 |

### 4.6 项目 5: 中国第一自動車集団

整体评价：

- 内容整体一致。
- 主要差异在于客户名称英文化。

可注意点：

| 位置 | 日文版 | 英文版 | 判断 |
| --- | --- | --- | --- |
| Client Name | `中国第一自動車集団（中国一汽）` | `FAW Group` | 这是英文版主动采用的官方/通用英文简称，源文件中未直接出现 |
| Role | `PG→SE` | `Programmer -> SE` | 基本一致，但 `SE` 没有完全英文展开 |

### 4.7 项目 6: 政府系

整体评价：

- 对齐度高。
- 英文版处理比较稳，没有明显多写或少写。

可注意点：

| 位置 | 日文版 | 英文版 | 判断 |
| --- | --- | --- | --- |
| Client Name | `政府系` | `Government-Affiliated Client` | 基本一致 |
| Short Desc | `新人開発段階、詳細略` | `Early-career project; details omitted.` | 一致 |

## 5. 教育背景

| 日文版 | 英文版 | 判断 |
| --- | --- | --- |
| `2009.9 ~ 2013.6` | `Sep 2009 - Jun 2013` | 一致 |
| `日本語` | `B.A. in Japanese` | 有新增推断，原文只写了专业，不保证必须是 `B.A.` |
| `東北師範大学人文学部` | `School of Humanities, Northeast Normal University` | 基本一致 |

这里是最建议修正的一处之一。

如果你要完全贴近日文原文，可以考虑把英文改成更保守的写法，例如：

- `Major: Japanese`
- `Japanese Studies`

## 6. 页面标签 / UI 文案差异

这些不是事实差异，而是标签层面的翻译选择：

| 日文版 | 英文版 | 判断 |
| --- | --- | --- |
| `職務経歴 詳細` | `Professional Experience` | 自然英文，不是直译 |
| `位置づけ` | `Overview` | 有意译，更直一点可用 `Positioning` 或 `Role in Portfolio` |
| `使用技術` | `Tech Stack` | 自然英文 |
| `今後の展望` | `Future Direction` | 自然英文 |
| `担当` | `Responsibilities` | 自然英文 |
| `成果・ポイント` | `Key Outcomes` | 略偏“结果”，若贴近原文可用 `Highlights` |
| `概要` | `Overview` | 一致 |
| `技術スタック` | `Tech Stack` | 一致 |

## 7. 建议优先修正的项目

如果目标是“英文版与日文版尽量完全对照”，建议优先修正以下内容：

1. `13 years in system design & delivery`  
   建议改为更贴近日文的 `13 years in system design and development`

2. `AI-enabled development`  
   建议改为更中性的 `AI utilization`、`Applied AI` 或 `AI usage in development`

3. `Python / AI Tooling`  
   建议改为 `Python / AI Utilization` 或 `Python / Applied AI`

4. `Operations`  
   建议凡是对应 `運用保守` 的地方统一改为 `Operations & Maintenance`

5. `B.A. in Japanese`  
   建议改为更保守的 `Japanese` / `Major in Japanese`，除非你确定要明确写学位

6. `Keyscience Co., Ltd.` / `Sunao Co., Ltd.` / `FAW Group`  
   建议确认是否为你希望对外展示的正式英文名称；如果不确定，可以保留原名或改成更保守的音译/注释写法

7. `15 build -> 6 now`  
   建议改为更自然的 `15 during build phase -> 6 currently`

8. `Key Outcomes`  
   如果你想更贴近日文 `成果・ポイント`，建议改成 `Highlights`

## 8. 最终判断

这份英文版目前可以用于对外展示，整体专业度没有问题，结构也完整。

但如果你的目标是：

- “和日文版完全对应”
- “尽量减少招聘语境下的再创作”
- “避免任何额外推断”

那么最需要收敛的就是这三类问题：

- 把偏招聘化的措辞改回更直译的表达
- 把可能带推断的公司名 / 学位名改成更保守的写法
- 把 `運用保守`、`AI活用`、`開発` 这类关键词翻译得更贴近原文

