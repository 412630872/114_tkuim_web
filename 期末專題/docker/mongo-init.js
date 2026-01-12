db = db.getSiblingDB('cloud_memo');

db.createUser({
    user: 'memo-admin',
    pwd: 'memo-password',
    roles: [{ role: 'readWrite', db: 'cloud_memo' }]
});

// 1. memos collection
db.createCollection('memos');
db.memos.createIndex({ ownerId: 1 });

// 2. users collection + unique email index
db.createCollection('users');
db.users.createIndex({ email: 1 }, { unique: true });

// Optional: Pre-create an admin user (password needs to be hashed with bcrypt)
// I'll skip inserting a user manually to avoid bcrypt complexity here (unless I use a fixed hash).
// Week12 used a fixed hash.
