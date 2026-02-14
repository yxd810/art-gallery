# EmailJS 配置指南

本文档指导您如何配置 EmailJS 以实现联系页面的表单提交功能。

## 功能说明

本系统采用**单方向邮件发送**机制：

- **管理员通知邮件**：发送给您，包含用户留言、IP地址、浏览器信息等

## 什么是 EmailJS？

EmailJS 是一个允许从客户端 JavaScript 代码发送电子邮件的服务，无需后端服务器。

## 配置步骤

### 第一步：注册 EmailJS 账号

1. 访问 [EmailJS 官网](https://www.emailjs.com/)
2. 点击 "Sign Up Free" 注册账号
3. 完成邮箱验证

### 第二步：添加邮件服务

1. 登录 EmailJS 控制台
2. 点击左侧菜单的 "Email Services"
3. 点击 "Add New Service"
4. 选择邮件提供商（推荐：Gmail 或 Personal SMTP）

#### 选项 A：使用 Gmail（推荐）

1. 选择 "Gmail" 服务
2. 使用您的 Google 账号授权
3. 设置服务名称（例如：`gmail_service`）
4. 点击 "Create Service"
5. 复制生成的 **Service ID**

#### 选项 B：使用 Personal SMTP

1. 选择 "Personal SMTP" 服务
2. 填写您的 SMTP 服务器信息：
   - Host: SMTP 服务器地址（如 `smtp.gmail.com`）
   - Port: 端口号（通常为 `465` 或 `587`）
   - Username: 邮箱地址
   - Password: 邮箱密码或应用专用密码
3. 点击 "Create Service"
4. 复制生成的 **Service ID**

### 第三步：创建管理员通知邮件模板

**用途**：发送给管理员，包含用户留言、IP地址、浏览器信息

**创建步骤**：

1. 点击左侧菜单的 "Email Templates"

2. 点击 "Create New Template"

3. 填写模板信息：
   **Template Name**: `admin_notification`
   **Subject**: 
   
   ```
   📧 新的网站留言 - 来自 {{name}}
   ```
   
   **To Email**: 设置为您的邮箱地址（例如：`your-email@example.com`）
   **HTML Content**:
   
   ```html
   <html>
   <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
       <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
           <h2 style="color: #d4af37;">新的网站留言</h2>
   
           <p>您收到了来自网站的联系消息，详情如下：</p>
   
           <hr style="border: 1px solid #eee; margin: 20px 0;">
   
           <table style="width: 100%; border-collapse: collapse;">
               <tr>
                   <td style="padding: 10px; background: #f9f9f9; font-weight: bold; width: 140px;">发送者姓名：</td>
                   <td style="padding: 10px;">{{name}}</td>
               </tr>
               <tr>
                   <td style="padding: 10px; background: #f9f9f9; font-weight: bold;">发送者邮箱：</td>
                   <td style="padding: 10px;">{{email}}</td>
               </tr>
               <tr>
                   <td style="padding: 10px; background: #f9f9f9; font-weight: bold;">留言主题：</td>
                   <td style="padding: 10px;">{{subject}}</td>
               </tr>
               <tr>
                   <td style="padding: 10px; background: #f9f9f9; font-weight: bold;">IP地址：</td>
                   <td style="padding: 10px;">{{user_ip}}</td>
               </tr>
               <tr>
                   <td style="padding: 10px; background: #f9f9f9; font-weight: bold;">浏览器信息：</td>
                   <td style="padding: 10px;">{{browser_info}}</td>
               </tr>
               <tr>
                   <td style="padding: 10px; background: #f9f9f9; font-weight: bold;">发送时间：</td>
                   <td style="padding: 10px;">{{send_time}}</td>
               </tr>
               <tr>
                   <td style="padding: 10px; background: #f9f9f9; font-weight: bold; valign: top;">留言内容：</td>
                   <td style="padding: 10px;">{{message}}</td>
               </tr>
           </table>
   
           <hr style="border: 1px solid #eee; margin: 20px 0;">
   
           <p style="color: #666; font-size: 14px;">
               此消息来自艺术空间联系页面。<br>
               您可以直接回复此邮件与发送者联系。
           </p>
       </div>
   </body>
   </html>
   ```

4. 点击 "Save"

5. 复制生成的 **Template ID**

### 第四步：获取 Public Key

1. 点击左侧菜单的 "Account"
2. 在 "General" 标签页中找到 "Public Key"
3. 复制您的 **Public Key**

### 第五步：配置 profile.json

打开 `data/profile.json` 文件，将 EmailJS 配置添加到文件中：

```json
{
  "name": "艺术家",
  "title": "摄影师 & 画家",
  "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop",
  "description": "您的个人介绍",
  "email": "your-email@example.com",
  "phone": "+86 138 0013 8000",
  "website": "www.artistspace.com",
  "emailjs": {
    "serviceId": "YOUR_SERVICE_ID",
    "adminTemplateId": "YOUR_ADMIN_TEMPLATE_ID",
    "publicKey": "YOUR_PUBLIC_KEY"
  },
  "social": {
    "wechat": {
      "enabled": true,
      "qrcode": "/images/wechat_qrcode.png"
    },
    "qq": {
      "enabled": true,
      "qrcode": "/images/qq_qrcode.png"
    },
    "weibo": {
      "enabled": true,
      "url": "https://weibo.com/your_weibo_account"
    }
  }
}
```

**重要**：

- 将 `YOUR_SERVICE_ID` 替换为您的 Service ID
- 将 `YOUR_ADMIN_TEMPLATE_ID` 替换为您的模板 ID
- 将 `YOUR_PUBLIC_KEY` 替换为您的 Public Key
- 确保 `email` 字段填写的是您的管理员邮箱（用于接收留言）

### 第六步：配置社交媒体（可选）

#### 微信二维码

1. 准备您的微信二维码图片
2. 将图片上传到 `images/` 目录，命名为 `wechat_qrcode.png`
3. 确认 `profile.json` 中的路径正确

#### QQ二维码

1. 准备您的QQ二维码图片
2. 将图片上传到 `images/` 目录，命名为 `qq_qrcode.png`
3. 确认 `profile.json` 中的路径正确

#### 新浪微博

1. 将您的微博主页链接填入 `profile.json` 的 `social.weibo.url` 字段
2. 用户点击微博图标将跳转到您的微博主页

### 第七步：测试功能

1. 保存所有文件
2. 在浏览器中打开联系页面
3. 填写表单并提交
4. 检查您的邮箱是否收到管理员通知邮件
5. 测试社交媒体功能：
   - 点击微信图标 → 应显示微信二维码弹窗
   - 点击QQ图标 → 应显示QQ二维码弹窗
   - 点击微博图标 → 应跳转到微博主页

## 模板变量说明

### 管理员通知邮件变量

| 变量名              | 说明     | 示例值                  |
| ---------------- | ------ | -------------------- |
| {{name}}         | 发送者姓名  | 张三                   |
| {{email}}        | 发送者邮箱  | zhangsan@example.com |
| {{subject}}      | 留言主题   | 咨询摄影作品               |
| {{message}}      | 留言内容   | 您好，我想了解...           |
| {{user_ip}}      | 用户IP地址 | 192.168.1.1          |
| {{browser_info}} | 浏览器信息  | Chrome (Windows)     |
| {{send_time}}    | 发送时间   | 2024/01/15 14:30:25  |

## 社交媒体配置说明

### profile.json 中的 social 配置

```json
{
  "social": {
    "wechat": {
      "enabled": true,
      "qrcode": "/images/wechat_qrcode.png"
    },
    "qq": {
      "enabled": true,
      "qrcode": "/images/qq_qrcode.png"
    },
    "weibo": {
      "enabled": true,
      "url": "https://weibo.com/your_account"
    }
  }
}
```

### 交互行为

- **微信**：点击图标 → 弹出二维码模态框
- **QQ**：点击图标 → 弹出二维码模态框
- **微博**：点击图标 → 在新标签页打开微博主页

## 常见问题

### Q1: 提交时提示 "请在 data/profile.json 中配置 EmailJS 参数"

**原因**：profile.json 中的 emailjs 配置未填写或填写了占位符

**解决**：

1. 打开 `data/profile.json`
2. 确认 `emailjs` 字段下的三个参数都已填写
3. 确认没有保留 `YOUR_` 开头的占位符

### Q2: 提交时提示 "EmailJS SDK 未加载"

**原因**：EmailJS CDN 加载失败

**解决**：检查网络连接，确保可以访问 jsdelivr.net

### Q3: 邮件中没有显示IP地址或浏览器信息

**原因**：模板中未使用 {{user_ip}} 或 {{browser_info}} 变量

**解决**：检查管理员邮件模板是否包含了这两个变量

### Q4: 获取IP地址失败

**原因**：第三方IP服务不可用

**影响**：IP地址会显示为"未知IP"，不影响其他功能

### Q5: 社交媒体图标不显示

**原因**：profile.json 中该平台的 `enabled` 设置为 false 或配置缺失

**解决**：

1. 打开 `data/profile.json`
2. 确认对应平台的 `enabled` 为 `true`
3. 确认配置结构正确

### Q6: 二维码显示失败

**原因**：二维码图片路径不正确或图片不存在

**解决**：

1. 确认二维码图片已上传到 `images/` 目录
2. 确认 `profile.json` 中的路径正确
3. 检查图片文件名是否正确

### Q7: 免费额度用完了怎么办？

EmailJS 免费版每月提供 200 封邮件。

**说明**：每次表单提交发送 1 封邮件，所以支持 200 次表单提交。

**解决**：

- 查看控制台 "Usage" 标签页查看使用情况
- 升级到付费套餐（$9/月起）
- 或等待下个月额度重置

## 浏览器信息说明

系统会自动检测并显示以下信息：

**支持的浏览器**：Chrome、Firefox、Safari、Edge、Opera

**支持的操作系统**：Windows、macOS、Linux、Android、iOS

**示例输出**：`Chrome (Windows)`、`Safari (macOS)`、`Firefox (Linux)`

## 安全建议

⚠️ **重要提示**：

1. **Public Key 安全**：Public Key 可以暴露在前端代码中，这是正常的设计
2. **不要暴露敏感信息**：不要将 API Key 或 Private Key 写在前端代码中
3. **添加验证**：EmailJS 提供了额外的验证层，可以在 Account -> Security 中配置
4. **限制发送频率**：可在模板或服务中设置发送频率限制

## 文件修改说明

### 已移除的功能

- ✅ `admin.html` 管理页面已删除
- ✅ `AdminPage` JavaScript 代码已删除
- ✅ `contact.html` 中的 EmailJS 配置已移除
- ✅ `contact.html` 中的重复邮箱已删除

### 已新增的功能

- ✅ EmailJS 配置统一在 `data/profile.json` 中管理
- ✅ 社交媒体配置在 `data/profile.json` 中管理
- ✅ 新增微信、QQ二维码弹窗功能
- ✅ 新增微博跳转功能
- ✅ 社交媒体图标更新为：微信、QQ、新浪微博

## 获取帮助

如果遇到问题，可以：

1. 查看 [EmailJS 官方文档](https://www.emailjs.com/docs/)
2. 检查浏览器控制台错误信息（F12）
3. 查看 EmailJS 控制台的 History 记录

---

**配置完成后，您的联系页面就可以发送留言到管理员邮箱了！**
