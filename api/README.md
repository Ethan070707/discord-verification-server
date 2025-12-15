# Discord Verification Server

Discord Interactions verification proxy for n8n.

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Ethan070707/discord-verification-server)

## Configuration

Update `api/discord-interactions.js`:
- `PUBLIC_KEY`: Your Discord Application Public Key
- `N8N_WEBHOOK_URL`: Your n8n webhook URL
```

---

## 🎯 快速修复步骤

### 立即执行：

1. **打开 `vercel-discord-verification` 文件夹**
   - 查看里面的文件

2. **逐个创建文件到根目录**
   - 使用 "Add file" → "Create new file"
   - 按照上面的内容创建 4 个文件

3. **删除 `vercel-discord-verification` 文件夹**

4. **删除其他不需要的文件**
   - `DEPLOYMENT_GUIDE.md`（已经不需要在仓库里）
   - `Discord_Interaction_Handler_Verified.json`（这是给 n8n 用的）

---

## ✅ 修复后的正确结构

**你应该看到：**
```
discord-verification-server/
├── api/
│   └── discord-interactions.js  ← ✅
├── package.json                  ← ✅
├── vercel.json                   ← ✅
└── README.md                     ← ✅ (可选)
