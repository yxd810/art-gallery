# 艺术空间 - 个人摄影绘画作品展示平台

个人摄影绘画作品展示网站，采用纯 HTML + CSS + JavaScript 开发。

## 📦 快速开始

### 1. 克隆或下载项目

```bash
git clone <repository-url>
cd art-gallery
```

### 2. 启动本地服务器

```bash
# 使用 Python HTTP 服务器
python3 -m http.server 5000
```

然后在浏览器中访问：`http://localhost:5000`  你应该看到这个作品展示网站的首页面。
![网站首页](./src/屏幕截图_1_localhost.jpeg "网站首页")
不过此时它只展示了一些样例图片和一个假设站长的个人信息。

如何使它成为您的个人作品展示平台，其实非常简单，请按照以下配置步骤执行。

## 配置流程

### 1. 配置个人信息

个人信息保存在 `art-gallery/data/profile.json` 文件中， 你可以用任何文本编辑器编辑它。下面以Ubuntu系统下的文本编辑器为例。如果你使用 windows 系统， 就用 `notepad.exe  profile.json` 命令。 

```bash
cd art-gallery/data/
nano profile.json
```

打开profile.json模板文件，并用您个人信息修改它。

```nano
{
  "name": "艺术家",
  "title": "摄影师 & 画家",
  "avatar": "./images/avatar.jpg",
  "description": "热爱摄影与绘画，用镜头捕捉瞬间的美好，用画笔描绘心中的世界。每一幅作品都承载着我对生活的热爱和对美的追求。我相信艺术是连接心灵的桥梁，希望通过我的作品，让更多人感受到生活中的美好与温暖。",
  "email": "your@your_email.com",
  "phone": "+86 123 4567 8888",
  "website": "www.sina.com",
  "emailjs": {
    "serviceId": "your_emailjs_serviceID",
    "adminTemplateId": "template_ID",
    "publicKey": "your_emailjs_publicKey"
  },
  "social": {
    "wechat": {
      "enabled": true,
      "qrcode": "/images/your_wechat_qrcode.png"
    },
    "qq": {
      "enabled": true,
      "qrcode": "/images/your_qq_qrcode.png"
    },
    "weibo": {
      "enabled": true,
      "url": "https://weibo.com/your_weibo_account"
    }
  }
}
```

 你可以通过修改上边文件中的内容，来达到配置您个性化的个人网站。这里需要说明的是emailjs段落的配置，它是实现浏览你网站的客户与您进行联系的邮件配置信息，关于如何获得这些邮件的配置信息，请参阅[EmailJS](EMAILJS_SETUP.MD).

### 2. 添加作品

你的作品是网站的灵魂，请删除 art-gallery/images/路径下的所有文件，并在其中放置您的作品文件。有两种方式可以做这件事。

#### 方法一：使用预处理脚本

1. **放入原始图片**
   
   ```bash
   # 将图片放入 src/ 目录
   cp your-photo.jpg src/
   ```

2. **运行预处理脚本**
   
   ```bash
   python3 preprocess.py
   ```

3. **选择处理模式**
   
   - 模式 1：逐张处理（交互式输入每张图片的信息）
   - 模式 2：批量处理（使用默认信息）
   - 模式 3：重新处理所有（覆盖已存在的图片）

4. **查看结果**
   
   - 压缩后的图片：`images/`
   - 元数据文件：`data/works.json`

> tips: 
> 
> 这种方法有一个前提：你必须安装了python 。如果你的系统没有安装过 python，可以参照[安装Python] （[Welcome to Python.org](https://www.python.org/)）。
> 
> 另外，预处理脚本需要 Pillow 库, 你需要安装它：
> 
> ```bash
> pip install Pillow
> ```

## 

#### 方法二：手动管理

1. 将图片放入 `images/` 目录
2. 编辑 `data/works.json` 添加作品信息：

```json
{
  "works": [
    {
      "filename": "my-work.jpg",
      "title": "作品标题",
      "category": "photography",
      "description": "作品描述",
      "price": 5000,
      "date": "2024-01"
    }
  ]
}
```

### 🖼️ 预处理脚本功能

### 图片压缩参数

- **最大尺寸**：1920 × 1080 像素
- **输出格式**：JPEG
- **压缩质量**：85%
- **预期效果**：减少 60-80% 的文件大小

### 支持的输入格式

- JPG、JPEG
- PNG
- GIF
- BMP
- WEBP

### 处理模式

1. **逐张处理**：为每张图片交互式输入详细信息
2. **批量处理**：为所有图片使用相同的默认信息
3. **重新处理**：覆盖已存在的图片

## 🎨 设计规范

### 色彩系统

- 主背景：`#1a1a1a`（深灰色）
- 次要背景：`#252525`
- 强调色：`#d4af37`（金色）
- 文本：`#f5f5f5`（浅色）

### 作品类别

- `photography`：摄影作品
- `painting`：绘画作品

### 价格显示

- 价格为 0 或空：显示"价格面议"
- 有价格：显示 `¥5000` 格式

## ✨ 项目技术特点

- **纯静态网站**：无后端依赖，可部署到任何静态托管平台（GitHub Pages、Netlify、Vercel 等）
- **自动化预处理**：一键压缩图片并生成元数据
- **响应式设计**：完美适配桌面、平板和移动设备
- **优雅的界面**：深色主题 + 金色强调色，突出艺术作品
- **高性能**：图片自动压缩，加载速度快

### 3. 📁 项目结构

```
.
├── index.html              # 首页
├── gallery.html            # 作品展示页
├── about.html              # 个人介绍页
├── contact.html            # 联系方式页
├── preprocess.py           # 图片预处理脚本 ⭐
├── css/
│   └── style.css           # 样式文件
├── js/
│   └── main.js             # 交互脚本
├── images/                 # 压缩后的图片（部署用）
│   ├── work1.jpg
│   └── work2.jpg
├── src/                    # 原始图片目录（预处理用）
│   └── README.md           # 使用说明
├── data/                   # 数据目录
│    ├── profile.json         # 管理员信息配置文件（站长信息）
│   └── works.json          # 作品元数据
└── README.md               # 项目说明
```



## 🚀 部署到静态托管平台

### GitHub Pages

1. 将项目推送到 GitHub
2. 在仓库设置中启用 GitHub Pages
3. 选择分支为 main/master
4. 访问 `https://username.github.io/repo-name`

### Netlify

1. 登录 Netlify
2. 将项目文件夹拖拽到 Netlify
3. 部署完成

### Vercel

1. 安装 Vercel CLI：`npm install -g vercel`
2. 运行：`vercel`
3. 按照提示完成部署

## 📝 数据格式

### works.json 格式

```json
{
  "works": [
    {
      "filename": "work1.jpg",
      "title": "作品标题",
      "category": "photography",
      "description": "作品描述",
      "price": 5000,
      "date": "2024-01"
    }
  ]
}
```

### 字段说明

| 字段          | 类型     | 必填  | 说明                        |
| ----------- | ------ | --- | ------------------------- |
| filename    | string | 是   | 图片文件名（相对于 images/ 目录）     |
| title       | string | 是   | 作品标题                      |
| category    | string | 是   | 类别：photography 或 painting |
| description | string | 否   | 作品描述                      |
| price       | number | 否   | 价格（元），0 表示面议              |
| date        | string | 是   | 日期，格式：YYYY-MM             |

## 🛠️ 配置修改

### 修改压缩参数

编辑 `preprocess.py` 文件的 `CONFIG` 字典：

```python
CONFIG = {
    'max_width': 1920,      # 修改最大宽度
    'max_height': 1080,     # 修改最大高度
    'quality': 85,          # 修改压缩质量（1-100）
}
```

### 修改端口

编辑 `.coze` 文件：

```toml
run = ["python3", "-m", "http.server", "8080"]  # 改为 8080
```

## ❓ 常见问题

### Q: 预处理脚本报错找不到 Pillow？

A: 运行 `pip install Pillow` 安装依赖。

### Q: 图片上传后不显示？

A: 检查以下几点：

1. 图片是否正确放入 `images/` 目录
2. `data/works.json` 中的 filename 是否正确
3. 图片文件名大小写是否匹配

### Q: 如何批量修改作品信息？

A: 直接编辑 `data/works.json` 文件，修改后刷新页面即可。

### Q: 如何备份作品数据？

A: 备份以下内容：

- `images/` 目录（所有图片）
- `data/works.json`（元数据）

### Q: 可以支持其他图片格式吗？

A: 预处理脚本会将所有图片转换为 JPEG 格式。如需其他格式，请修改 `preprocess.py` 中的 `output_format` 参数。

## 📄 许可证

MIT License

## 🙏 致谢

本项目采用纯前端技术栈，专注于提供简洁优雅的作品展示体验。


