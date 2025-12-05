# Week 11 HWK
## 啟動指令
1.啟動 MongoDB（Docker）
- cd docker
- docker compose up -d

2.確認 Mongo 正常運作
- docker ps

3.啟動 Server
- cd server
- npm install
- npm run dev

## 環境需求
- Node.js 18+
- Docker / Docker Compose
- VSCode

## 測試方式
- VSCode REST Client（已附上 api.http）
 -  tests/api.http
- Postman
    
    URL: http://localhost:3001/api/signup
    
    Method: POST
    
    Body (JSON):
    
    {
    
      "name": "Bob",
    
      "email": "bob@example.com",
    
      "phone": "0988777666"
    
    }
- curl 指令
- Mongo Shell 測試 DB
  
  mongosh "mongodb://week11-user:week11-pass@localhost:27017/week11? authSource=week11"    


## 常見問題
1.修改 mongo-init.js 卻沒生效？

解決方法：
- docker compose down -v
- docker compose up -d

2.無法套用 .env？

解決方法：
- .env 放在 server 資料夾

## .env 參數說明
| 參數名稱 | 說明 |
| :--- | :--- |
| `PORT` | Node.js 後端啟動的 API Port（預設：3001） | 
| `MONGODB_URI` | MongoDB 連線字串（含帳密 + Auth DB） | 
| `ALLOWED_ORIGIN`| CORS 用於允許前端連線 | 


## MongoDB Compass 截圖
<img src="Screenshot/mongoDB Compass .png" width="600" alt="API 測試結果">