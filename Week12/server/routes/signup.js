// server/routes/signup.js
import express from 'express';
import { ObjectId } from 'mongodb';
import {
  createParticipant,
  listParticipants,
  updateParticipant,
  deleteParticipant,
  getParticipantById,
} from '../repositories/participants.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: '缺少必要欄位（name、email、phone）' });
    }

    const id = await createParticipant({
      name,
      email,
      phone,
      ownerId: req.user.id
    });

    return res.status(201).json({
      message: '報名成功',
      _id: id, 
      id: id.toString(), 
    });
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(400).json({
        error: '這個 email 已經報名過了，請不要重複報名。',
      });
    }
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limitRaw = parseInt(req.query.limit, 10) || 10;
    const limit = Math.max(1, Math.min(limitRaw, 100));

    const filter = {};
    if (req.user.role !== 'admin') {
      filter.ownerId = req.user.id;
    }

    const { items, total } = await listParticipants({ page, limit, filter });
    const totalPages = Math.ceil(total / limit);

    res.json({
      total, 
      list: items, 
      page, 
      limit,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: '不合法的 id 格式' });
    }

    const { phone, status } = req.body;
    const patch = {};
    if (phone !== undefined) patch.phone = phone;
    if (status !== undefined) patch.status = status;

    if (Object.keys(patch).length === 0) {
      return res
        .status(400)
        .json({ error: '沒有可更新欄位，只允許更新 phone 或 status' });
    }

    const result = await updateParticipant(id, patch);

    if (!result.matchedCount) {
      return res.status(404).json({ error: '找不到資料' });
    }

    res.json({
      message: 'signup updated',
      modified: result.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: '不合法的 id 格式' });
    }

    const participant = await getParticipantById(id);
    if (!participant) {
      return res.status(404).json({ error: '找不到資料' });
    }

    if (req.user.role !== 'admin' && participant.ownerId?.toString() !== req.user.id) {
      return res.status(403).json({ error: '沒有權限刪除此資料' });
    }

    const result = await deleteParticipant(id);

    if (!result.deletedCount) {
      return res.status(404).json({ error: '找不到資料' });
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
