# Week 12 - Authentication & Registration System

這是一個包含前後端分離的 Week 12 專案，實作了使用者註冊、登入驗證（JWT）以及報名系統的 CRUD 功能。

## 專案結構

- `client/`: 前端程式碼 (HTML, CSS, JavaScript)
- `server/`: 後端 API 伺服器 (Node.js, Express, MongoDB)

## 功能特色

### 前端 (Client)
- **登入/註冊介面**：支援學生與管理員角色切換（註冊時）。
- **報名系統儀表板**：
  - 顯示使用者資訊。
  - 新增報名資料 (姓名, Email, 電話)。
  - 瀏覽報名列表（支援分頁）。
  - JWT Token 儲存與自動帶入請求 Header。

### 後端 (Server)
- **RESTful API**：
  - `POST /api/signup`: 使用者註冊。
  - `POST /auth/login`: 使用者登入。
  - 報名資料的 CRUD API (需驗證 Token)。
- **安全性**：
  - 使用 `bcrypt` 加密密碼。
  - 使用 `jsonwebtoken` (JWT) 進行身份驗證。
  - 使用 `helmet` 與 `cors` 增強安全性。
- **資料庫**：MongoDB。

## 安裝與執行

### 1. 後端設定 (Server)

確保已安裝 `Node.js` 與 `MongoDB`。

```bash
cd server
npm install
```

設定環境變數：
請在 `server` 目錄下建立 `.env` 檔案，並填入以下設定（範例）：
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/week12
JWT_SECRET=your_secret_key_here
```

啟動伺服器：
```bash
npm start
# 或
node app.js
```
伺服器預設執行於 `http://localhost:3001`。

### 2. 前端執行 (Client)

不需要安裝依賴，前端為靜態檔案。

1. 進入 `client` 資料夾。
2. 使用瀏覽器開啟 `index.html`，建議配合 VS Code 的 **Live Server** 擴充套件以獲得完整的 API 連線體驗 (避免 CORS 問題)。

## 注意事項

- 前端 `app.js` 預設連線至 `http://localhost:3001`，請確保後端伺服器已啟動並監聽該埠口。
