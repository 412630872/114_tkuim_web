# Personal Cloud Memo (個人雲端備忘錄)

## 1. 專案主題與目標 (Project Theme & Objectives)

**主題**：打造一個輕量級、功能完整且具備使用者隔離機制的雲端備忘錄系統。

**目標**：
1.  **資料雲端化**：解決傳統紙本或本地記事本資料無法跨裝置存取的問題。
2.  **效率管理**：透過「搜尋」、「標籤」、「置頂」等功能，幫助使用者快速整理與檢索資訊。
3.  **使用者體驗優化**：提供深色模式、響應式設計 (RWD) 與刪除防呆機制，確保在不同裝置上皆有良好的操作體驗。
4.  **技術實踐**：整合前後端分離架構、資料庫管理與 Docker 容器化技術，實踐現代 Web 開發流程。

---

## 2. 技術選擇原因 (Technology Selection)

本專案選擇以下技術堆疊，基於其在現代 Web 開發中的優勢與適用性：

-   **Backend: Node.js + Express.js**
    -   **非阻塞 I/O**：適合處理高併發的 API 請求（如原本的許多讀寫操作）。
    -   **單一語言**：前後端皆使用 JavaScript，降低開發切換成本，且生態系豐富 (NPM)。
    -   **輕量靈活**：Express 框架極簡，易於快速搭建 RESTful API。

-   **Database: MongoDB**
    -   **Schema-less**：NoSQL 文件導向資料庫非常適合儲存結構不固定的備忘錄資料（如：有的有圖，有的沒標籤）。
    -   **JSON 相容**：資料格式與前端 JSON 高度契合，無需複雜的轉換 (ORM)。

-   **Frontend: Native HTML/CSS/JavaScript**
    -   **輕量快載**：無須龐大的框架 (React/Vue) 打包檔，瀏覽器原生執行，載入速度極快。
    -   **掌握基礎**：直接操作 DOM 與 Fetch API，能更深入理解 Web 運作原理。

-   **DevOps: Docker & Docker Compose**
    -   **環境一致性**：解決 "It works on my machine" 問題，確保開發與部署環境一致。
    -   **快速部署**：透過 `docker-compose up` 即可一鍵建立資料庫環境，無需繁瑣的本地安裝設定。

---

## 3. 架構說明 (Architecture)

本專案採用 **Client-Server Architecture (主從式架構)** 與 **RESTful API** 設計風格。

-   **前端 (Client)**：負責 UI 渲染、使用者互動、狀態管理 (Dark Mode/Drafts)。透過 AJAX (Fetch API) 與後端溝通。
-   **後端 (Server)**：負責商業邏輯、JWT 身分驗證、資料驗證。
-   **資料層 (Database)**：MongoDB 儲存使用者帳號與備忘錄文件。


### 目錄結構
```
期末專題/
├── client/              # 前端 (HTML/CSS/JS)
├── server/              # 後端 (Node.js)
│   ├── repositories/    # 資料庫操作層 (Data Access Layer)
│   ├── routes/          # API 路由層 (Controller Layer)
│   ├── app.js           # 程式進入點
│   └── .env             # 環境變數設定
└── docker/              # 容器配置
```

---

## 4. 安裝與執行指引 (Installation & Execution)

### 前置需求
-   安裝 [Docker Desktop](https://www.docker.com/products/docker-desktop/) (推薦)
-   或安裝 Node.js (v14+) 與 MongoDB Server。

### 方法一：Docker 快速啟動 (推薦)

1.  **啟動資料庫**
    開啟終端機，進入 `期末專題/docker` 目錄：
    ```bash
    cd docker
    docker-compose up -d
    ```
    這將啟動 MongoDB 容器 (Port 27017)。

2.  **啟動後端伺服器**
    開啟新終端機，進入 `期末專題/server` 目錄：
    ```bash
    cd ../server
    npm install     
    npm run dev      
    ```
    伺服器將運行於 `http://localhost:3001`。

3.  **使用應用程式**
    直接用瀏覽器開啟 `期末專題/client/index.html` 檔案即可。
    *(建議使用 VS Code 的 Live Server 插件開啟，體驗更佳)*

### 方法二：本地手動安裝

1.  **資料庫**：確保本地 MongoDB 服務正在運行，並建立好 `cloud_memo` 資料庫。
2.  **環境變數**：修改 `server/.env`，將連線字串改為您的本地設定。
    ```env
    MONGODB_URI=mongodb://localhost:27017/cloud_memo
    ```
3.  **啟動伺服器**：同上，執行 `npm run dev`。
4.  **前端**：開啟 `index.html`。

---

