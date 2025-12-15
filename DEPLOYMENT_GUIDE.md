# 🚀 完整部署指南 - Discord Interactions with Vercel + n8n

## 📋 目录

1. [准备工作](#准备工作)
2. [部署 Vercel 验证服务器](#部署-vercel-验证服务器)
3. [更新 n8n 工作流](#更新-n8n-工作流)
4. [配置 Discord](#配置-discord)
5. [测试验证](#测试验证)
6. [故障排除](#故障排除)

---

## 准备工作

### 需要的账号

- ✅ GitHub 账号（免费）
- ✅ Vercel 账号（免费）
- ✅ n8n.cloud 账号（你已有）
- ✅ Discord Developer Portal 访问权限（你已有）

### 需要的信息

1. **Discord Public Key**
   - 位置：Discord Developer Portal → Your App → General Information
   - 格式：64位十六进制字符串
   - 例如：`d2a5d73af62f88dce750fd3903d9c61a6b4df15d9ee1297a00e8ac4f4333b6cd`

2. **n8n Webhook 基础 URL**
   - 你的：`https://ctlee0712.app.n8n.cloud/webhook/`

---

## 部署 Vercel 验证服务器

### Step 1: 创建 GitHub 仓库

1. **访问 GitHub**
   - 打开：https://github.com/new

2. **创建仓库**
   - Repository name: `discord-verification-server`
   - Description: `Discord Interactions verification proxy for n8n`
   - Public（公开）或 Private（私有）都可以
   - ⚠️ **不要**勾选 "Initialize this repository with a README"
   - 点击 "Create repository"

3. **上传文件**
   
   **方法 A：使用 GitHub 网页界面**
   - 点击 "uploading an existing file"
   - 创建以下文件结构：
   
   ```
   discord-verification-server/
   ├── api/
   │   └── discord-interactions.js
   ├── package.json
   ├── vercel.json
   └── README.md
   ```
   
   - 逐个复制粘贴文件内容
   - 每个文件点击 "Commit new file"

   **方法 B：使用 Git 命令行**（如果你熟悉 Git）
   ```bash
   git clone <your-repo-url>
   cd discord-verification-server
   # 复制所有文件到这个目录
   git add .
   git commit -m "Initial commit"
   git push
   ```

### Step 2: 部署到 Vercel

1. **访问 Vercel**
   - 打开：https://vercel.com/new

2. **导入 GitHub 仓库**
   - 如果第一次使用，点击 "Add GitHub Account"
   - 授权 Vercel 访问你的 GitHub
   - 在列表中找到 `discord-verification-server`
   - 点击 "Import"

3. **配置项目**
   - Project Name: 保持默认或自定义
   - Framework Preset: 选择 "Other"
   - Root Directory: `./` (默认)
   - Build and Output Settings: 保持默认
   - **点击 "Deploy"**

4. **等待部署完成**
   - 通常需要 1-2 分钟
   - 成功后会显示 "Congratulations!"

5. **获取 Vercel URL**
   - 部署成功后，你会看到类似：
     ```
     https://discord-verification-server.vercel.app
     ```
   - **记下这个 URL！**

### Step 3: 配置 Vercel 环境变量（可选，推荐）

**为了安全，我们可以将 Public Key 和 n8n URL 设置为环境变量：**

1. **进入项目设置**
   - Vercel Dashboard → 你的项目 → Settings → Environment Variables

2. **添加变量**
   
   | Name | Value |
   |------|-------|
   | `DISCORD_PUBLIC_KEY` | `d2a5d73af62f88dce750fd3903d9c61a6b4df15d9ee1297a00e8ac4f4333b6cd` |
   | `N8N_WEBHOOK_URL` | `https://ctlee0712.app.n8n.cloud/webhook/discord-verified` |

3. **重新部署**
   - Settings → Deployments → 最新的部署 → 三个点 → Redeploy

**⚠️ 如果不设置环境变量，直接在代码中硬编码也可以，但不够安全。**

---

## 更新 n8n 工作流

### Step 1: 导入新的工作流

1. **打开 n8n**
   - 访问：https://ctlee0712.app.n8n.cloud

2. **导入工作流**
   - 点击左上角菜单（☰）
   - 选择 "Import from File"
   - 选择 `Discord_Interaction_Handler_Verified.json`
   - 点击 "Import"

### Step 2: 检查配置

1. **打开新导入的工作流**

2. **检查 Webhook 节点**
   - Path 应该是：`discord-verified`
   - Respond 应该是：`Immediately`
   - Response Headers 包含：`Content-Type: application/json`

3. **检查 Gmail 凭证**
   - "Send Email to Principal" 节点
   - 确认 Gmail OAuth2 凭证已连接

4. **检查 Discord 凭证**
   - "Update Discord Message - Approved" 节点
   - "Update Discord Message - Rejected" 节点
   - 确认 Discord Bot Token 已配置

### Step 3: 激活工作流

1. **点击右上角的开关**
   - Active（绿色）

2. **保存工作流**
   - 点击 "Save"

3. **记下 Webhook URL**
   - 应该是：`https://ctlee0712.app.n8n.cloud/webhook/discord-verified`

---

## 配置 Discord

### Step 1: 更新 Interactions Endpoint URL

1. **打开 Discord Developer Portal**
   - 访问：https://discord.com/developers/applications

2. **选择你的应用**
   - Application: `Automation_Boarding`

3. **进入 General Information**

4. **更新 Interactions Endpoint URL**
   - 填写：
     ```
     https://your-vercel-project.vercel.app/discord-interactions
     ```
   - **替换 `your-vercel-project` 为你的实际 Vercel 项目名**
   
5. **保存**
   - 点击 "Save Changes"
   - **等待验证（3-5秒）**

### Step 2: 验证结果

**成功的话：**
- ✅ 没有红色错误框
- ✅ 可以保存配置
- ✅ 🎉 恭喜！配置成功！

**失败的话：**
- ❌ 显示 "The specified interactions endpoint url could not be verified."
- 👉 查看下面的故障排除部分

---

## 测试验证

### Test 1: 发送测试消息

1. **触发你的 SMS 工作流**
   - 发送一条测试 SMS

2. **查看 Discord 频道**
   - 应该收到带按钮的消息

3. **点击 Approve 按钮**
   - 应该看到：
     - ✅ 消息更新为 "APPROVED by @你的用户名"
     - ✅ 收到邮件
     - ✅ 按钮消失

### Test 2: 查看 Vercel 日志

1. **打开 Vercel Dashboard**
   - 访问：https://vercel.com/dashboard

2. **进入项目**
   - 点击 `discord-verification-server`

3. **查看 Logs**
   - Functions → 查看最新的日志
   - 应该看到：
     ```
     ✅ PING detected - Responding with PONG
     ✅ Signature valid
     ✅ Forwarded to n8n successfully
     ```

### Test 3: 查看 n8n Executions

1. **打开 n8n**
2. **查看 Executions 标签**
3. **应该看到成功的执行记录**

---

## 故障排除

### 问题 1: Discord 验证失败

**症状：**
- "The specified interactions endpoint url could not be verified."

**解决方案：**

1. **检查 Vercel URL**
   - 确认 URL 正确
   - 访问 `https://your-vercel-project.vercel.app/discord-interactions`
   - 应该返回 404 或 Method Not Allowed（正常）

2. **检查 Public Key**
   - 在 `api/discord-interactions.js` 中
   - 确认 PUBLIC_KEY 与 Discord 一致

3. **查看 Vercel 日志**
   - Vercel Dashboard → 你的项目 → Functions
   - 查看是否有错误

4. **重新部署**
   - Vercel Dashboard → Deployments → Redeploy

### 问题 2: n8n 没有收到请求

**症状：**
- Discord 验证成功
- 但点击按钮后 n8n 没有执行

**解决方案：**

1. **检查 N8N_WEBHOOK_URL**
   - 在 `api/discord-interactions.js` 中
   - 应该是：`https://ctlee0712.app.n8n.cloud/webhook/discord-verified`

2. **检查 n8n 工作流**
   - 确认已激活
   - Webhook path 是 `discord-verified`

3. **查看 Vercel 日志**
   - 应该看到 "Forwarding to n8n..."
   - 如果有错误，会显示具体信息

### 问题 3: Vercel 部署失败

**症状：**
- 部署时出错

**解决方案：**

1. **检查文件结构**
   ```
   discord-verification-server/
   ├── api/
   │   └── discord-interactions.js
   ├── package.json
   ├── vercel.json
   └── README.md
   ```

2. **检查 package.json 语法**
   - 使用 JSON 验证器检查

3. **查看 Vercel 构建日志**
   - Deployments → 失败的部署 → Build Logs

### 问题 4: 按钮点击后没有响应

**症状：**
- 点击按钮后没有任何反应

**解决方案：**

1. **查看 n8n Executions**
   - 是否有错误？
   - 哪个节点失败了？

2. **检查 Discord Credentials**
   - Bot Token 是否正确？
   - 权限是否足够？

3. **查看 Vercel 日志**
   - 是否成功转发到 n8n？

---

## 🎉 成功标志

**当一切正常时，你应该看到：**

1. ✅ Discord Developer Portal
   - Interactions Endpoint URL 验证成功
   - 没有红色错误

2. ✅ Vercel Dashboard
   - 部署成功
   - 日志显示正常的请求处理

3. ✅ n8n
   - Webhook 激活
   - 执行记录显示成功

4. ✅ Discord 频道
   - 收到带按钮的消息
   - 点击按钮后消息更新
   - 收到邮件

---

## 📊 架构总结

```
SMS → n8n → Discord 频道（带按钮）
                ↓
          用户点击按钮
                ↓
Discord → Vercel 服务器 → 验证签名 → n8n Webhook
           (签名验证)                    ↓
                                   处理逻辑
                                        ↓
                                  发送邮件 + 更新消息
```

---

## 💰 成本

**完全免费！**

- ✅ Vercel Free Tier: 100GB/月（足够用）
- ✅ n8n.cloud Starter: 已有
- ✅ Discord: 免费
- ✅ GitHub: 免费

---

## 📞 需要帮助？

如果遇到问题：
1. 检查 Vercel 日志
2. 检查 n8n Executions
3. 检查 Discord Developer Portal
4. 提供错误截图和日志

---

**祝部署成功！** 🚀
