// server/db.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

let client;
let db;

export async function connectDB() {
    if (db) return db;

    const currentURI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017";

    const maskURI = currentURI.replace(/:([^:@]+)@/, ":****@");
    console.log("[DB] Attempting to connect to:", maskURI);

    if (!client) {
        client = new MongoClient(currentURI);
    }

    await client.connect();
    db = client.db();
    console.log("[DB] Connected to MongoDB");
    return db;
}

export function getDB() {
    if (!db) throw new Error("Database not initialized");
    return db;
}

export async function getCollection(name) {
    const database = db ?? (await connectDB());
    return database.collection(name);
}

process.on("SIGINT", async () => {
    await client.close();
    console.log("\n[DB] Connection closed");
    process.exit(0);
});
