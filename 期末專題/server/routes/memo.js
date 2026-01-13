// server/routes/memo.js
import express from 'express';
import { ObjectId } from 'mongodb';
import {
    createMemo,
    listMemos,
    updateMemo,
    deleteMemo,
    getMemoById,
} from '../repositories/memo.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', async (req, res, next) => {
    try {
        const { title, content, category, tags, isPinned, isCompleted, imageUrl } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const id = await createMemo({
            title,
            content: content || '',
            category: category || 'General',
            tags: tags || [],
            isPinned: !!isPinned,
            isCompleted: !!isCompleted,
            imageUrl: imageUrl || null,
            ownerId: req.user.id // Taken from token payload (set in auth middleware)
        });

        return res.status(201).json({
            message: 'Memo created',
            _id: id,
            id: id.toString(),
        });
    } catch (error) {
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

        if (req.query.search) filter.search = req.query.search;
        if (req.query.tag) filter.tag = req.query.tag;

        const { items, total } = await listMemos({ page, limit, filter });
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

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const memo = await getMemoById(id);
        if (!memo) {
            return res.status(404).json({ error: 'Memo not found' });
        }

        if (req.user.role !== 'admin' && memo.ownerId?.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Permission denied: You do not own this memo' });
        }

        const result = await deleteMemo(id);

        if (!result.deletedCount) {
            return res.status(404).json({ error: 'Memo not found' });
        }

        res.json({ message: 'Memo deleted successfully' });
    } catch (error) {
        next(error);
    }
});

export default router;
