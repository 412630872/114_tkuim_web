// server/repositories/memo.js
import { ObjectId } from 'mongodb';
import { getDB } from '../db.js';

const collection = () => getDB().collection('memos');

export async function createMemo(data) {
    const result = await collection().insertOne({
        ...data,
        tags: Array.isArray(data.tags) ? data.tags : [],
        isPinned: !!data.isPinned,
        isCompleted: !!data.isCompleted,
        imageUrl: data.imageUrl || null,
        ownerId: data.ownerId ? new ObjectId(data.ownerId) : null,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    return result.insertedId;
}

export async function listMemos({ page = 1, limit = 10, filter = {} } = {}) {
    const col = collection();

    const query = {};
    if (filter.ownerId) {
        query.ownerId = new ObjectId(filter.ownerId);
    }

    if (filter.tag) {
        query.tags = filter.tag;
    }

    if (filter.search) {
        const regex = new RegExp(filter.search, 'i');
        query.$or = [
            { title: regex },
            { content: regex }
        ];
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
        col
            .find(query)
            .sort({ isPinned: -1, createdAt: -1 }) // Pinned first, then newest
            .skip(skip)
            .limit(limit)
            .toArray(),
        col.countDocuments(query)
    ]);

    return { items, total };
}

export async function updateMemo(id, patch) {
    return collection().updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...patch, updatedAt: new Date() } }
    );
}

export function deleteMemo(id) {
    return collection().deleteOne({ _id: new ObjectId(id) });
}

export function getMemoById(id) {
    return collection().findOne({ _id: new ObjectId(id) });
}
