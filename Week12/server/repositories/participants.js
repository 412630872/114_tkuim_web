// server/repositories/participants.js
import { ObjectId } from 'mongodb';
import { getDB } from '../db.js';

const collection = () => getDB().collection('participants');

let indexesReady = false;
export async function ensureParticipantIndexes() {
  if (indexesReady) return;

  await collection().createIndex(
    { email: 1 },
    { unique: true, name: 'uniq_email' }
  );

  indexesReady = true;
}

export async function createParticipant(data) {
  const result = await collection().insertOne({
    ...data,
    ownerId: data.ownerId ? new ObjectId(data.ownerId) : null, // Record ownerId
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return result.insertedId;
}

export async function listParticipants({ page = 1, limit = 10, filter = {} } = {}) {
  const col = collection();

  const query = {};
  if (filter.ownerId) {
    query.ownerId = new ObjectId(filter.ownerId);
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    col
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip) 
      .limit(limit) 
      .toArray(),
    col.countDocuments(query)
  ]);

  return { items, total };
}

export async function updateParticipant(id, patch) {
  return collection().updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...patch, updatedAt: new Date() } }
  );
}

export function deleteParticipant(id) {
  return collection().deleteOne({ _id: new ObjectId(id) });
}

export function getParticipantById(id) {
  return collection().findOne({ _id: new ObjectId(id) });
}
