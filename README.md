# Bulk Mockup — Photoshop 批量 Mockup 生成工具

> 一人公司项目 | Solo Founder | $0 启动成本

帮助 Print-on-Demand、Etsy/Shopify 卖家**批量替换 Photoshop Smart Object 图层**，把做几百张 mockup 从几小时压到几分钟。

## 快速开始

1. 下载 `src/bulk-mockup.jsx`
2. Photoshop → File → Scripts → Browse → 选择脚本
3. 选择 Mockup Template (PSD) + Design Images Folder + Output Folder
4. 点击 Run

## 功能

- **批量替换**：一个模板 × N 张设计图 = N 张 mockup
- **Smart Object 自动检测**：自动识别 PSD 中的 Smart Object 图层
- **PNG/JPEG 导出**：自动命名 `design_name_mockup.png`
- **UI 对话框**：文件选择 + 格式选择 + 运行按钮

## 项目结构

```
bulk-mockup/
├── README.md
├── src/
│   └── bulk-mockup.jsx      # 核心 Photoshop 脚本
├── scripts/
│   ├── install.jsx           # 一键安装脚本
│   └── package.json
├── web/
│   └── index.html            # 落地页
├── docs/
│   └── usage.md              # 使用说明
├── .gitignore
└── LICENSE
```

## 安装

### 方法 1：自动安装
1. 下载 `src/bulk-mockup.jsx` 和 `scripts/install.jsx`
2. 放在同一文件夹
3. Photoshop → File → Scripts → Browse → 选择 `install.jsx`
4. 重启 Photoshop

### 方法 2：手动安装
1. 打开 Photoshop 安装目录 → `Presets/Scripts`
2. 复制 `bulk-mockup.jsx` 到该文件夹
3. 重启 Photoshop

## 定价

$49 一次性买断 — 无限 mockup 生成

## 系统要求

- Adobe Photoshop CC 2020+
- Windows 或 macOS
- 8GB+ RAM

## 来源

- Indie Hackers 案例: https://www.indiehackers.com/post/tech/turning-a-freelance-gig-into-a-150k-yr-product-tDdZGZyiyNTztPfI2wkY

## License

MIT