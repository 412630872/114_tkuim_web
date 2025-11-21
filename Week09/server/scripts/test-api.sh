curl http://localhost:3001/api/signup

curl -X POST http://localhost:3001/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CLI",
    "email": "cli@example.com",
    "phone": "0911222333",
    "password": "cliPass88",
    "confirmPassword": "cliPass88",
    "interests": ["資料庫"],
    "terms": true
  }'
