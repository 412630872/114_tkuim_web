db = db.getSiblingDB('cloud_memo');

db.createUser({
    user: 'memo-admin',
    pwd: 'memo-password',
    roles: [{ role: 'readWrite', db: 'cloud_memo' }]
});

db.createCollection('memos');
db.memos.createIndex({ ownerId: 1 });

db.createCollection('users');
db.users.createIndex({ email: 1 }, { unique: true });


