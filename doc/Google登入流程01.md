# 多媒體英語教學平台 - Google Login 整合

這個專案整合了 FastAPI + Nuxt3 + Google OAuth 的完整認證系統。

## 🚀 功能特色

- ✅ Google OAuth 2.0 登入
- ✅ JWT Token 認證
- ✅ 自動登入狀態管理
- ✅ 響應式設計
- ✅ TypeScript 支援
- ✅ 安全的認證流程

## 📋 環境需求

### 後端 (FastAPI)

- Python 3.8+
- PostgreSQL 13+
- pip 或 pipenv

### 前端 (Nuxt3)

- Node.js 18+
- npm 或 yarn

## 🛠️ 安裝步驟

### 1. 克隆專案

```bash
git clone <your-repo-url>
cd multimedia-english-platform
```

### 2. 後端設置

```bash
# 進入後端目錄
cd backend

# 創建虛擬環境
python -m venv venv

# 啟動虛擬環境
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 安裝依賴
pip install -r requirements.txt

# 複製環境變數檔案
cp .env.example .env
```

### 3. Google OAuth 設置

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 創建新專案或選擇現有專案
3. 啟用 Google+ API
4. 創建 OAuth 2.0 憑證：

   - 應用程式類型：網頁應用程式
   - 授權的 JavaScript 來源：`http://localhost:3000`
   - 授權的重新導向 URI：
     - `http://localhost:3000/auth/callback`
     - `http://localhost:8000/auth/google/callback`

5. 複製 Client ID 和 Client Secret 到 `.env` 檔案

### 4. 資料庫設置

```bash
# 創建 PostgreSQL 資料庫
createdb multimedia_english

# 執行資料庫遷移
alembic upgrade head
```

### 5. 前端設置

```bash
# 進入前端目錄
cd frontend

# 安裝依賴
npm install

# 複製環境變數檔案
cp .env.example .env
```

### 6. 設置環境變數

#### 後端 `.env`

```env
DATABASE_URL=postgresql://username:password@localhost:5432/multimedia_english
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=http://localhost:3000
```

#### 前端 `.env`

```env
API_BASE_URL=http://localhost:8000
GOOGLE_CLIENT_ID=your-google-client-id
FRONTEND_URL=http://localhost:3000
```

## 🚀 執行專案

### 1. 啟動後端

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. 啟動前端

```bash
cd frontend
npm run dev
```

## 📱 使用方式

1. 開啟瀏覽器前往 `http://localhost:3000`
2. 點擊登入頁面
3. 選擇「使用 Google 繼續」
4. 完成 Google 認證流程
5. 自動跳轉到儀表板

## 🔐 安全考量

- JWT Token 儲存在 HTTP-only cookies 中
- 所有 API 請求都需要驗證
- Google OAuth 流程使用 PKCE
- 敏感資訊都存在環境變數中

## 📂 專案結構

```
multimedia-english-platform/
├── backend/
│   ├── auth.py                 # 認證路由
│   ├── lib_auth/
│   │   └── jwt_utils.py       # JWT 工具
│   ├── lib_db/
│   │   ├── models/
│   │   └── schemas/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── pages/
│   │   ├── login.vue          # 登入頁面
│   │   └── auth/
│   │       ├── callback.vue   # OAuth 回調
│   │       └── success.vue    # 登入成功
│   ├── middleware/
│   │   ├── auth.ts           # 認證中介軟體
│   │   └── guest.ts          # 訪客中介軟體
│   ├── composables/
│   │   └── useAuth.ts        # 認證 Composable
│   ├── package.json
│   └── nuxt.config.ts
└── README.md
```

## 🧪 測試

### 後端測試

```bash
cd backend
pytest
```

### 前端測試

```bash
cd frontend
npm run test
```

## 🚀 部署

### 使用 Docker

```bash
# 建置並執行
docker-compose up --build
```

### 手動部署

1. 設置生產環境的環境變數
2. 建置前端：`npm run build`
3. 啟動後端：`gunicorn main:app`
4. 使用 Nginx 作為反向代理

## 📝 API 文件

啟動後端後，可以前往以下 URL 查看 API 文件：

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🤝 貢獻

1. Fork 這個專案
2. 創建功能分支：`git checkout -b feature/new-feature`
3. 提交變更：`git commit -am 'Add new feature'`
4. 推送到分支：`git push origin feature/new-feature`
5. 提交 Pull Request

## 📄 授權

MIT License

## ❓ 常見問題

### Q: Google 登入失敗怎麼辦？

A: 請確認：

1. Google Client ID 設置正確
2. 授權網域已添加到 Google Console
3. 網路連接正常

### Q: JWT Token 過期怎麼處理？

A: 系統會自動重定向到登入頁面，請重新登入。

### Q: 如何添加其他第三方登入？

A: 可以參考 Google 登入的實作方式，添加 Facebook、GitHub 等提供商。

## 📞 聯絡我們

如有問題，請在 GitHub Issues 中提出或聯絡開發團隊。
