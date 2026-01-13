import jwt from 'jsonwebtoken';

const EXPIRES_IN = '2h';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export function generateToken(user) {
    return jwt.sign(
        {
            id: user._id?.toString?.() ?? user.id, // User logic might expect 'id' or 'sub' in token payload, let's keep it simple or match Week12. Week12 used 'sub'. Auth middleware sets req.user = payload.
            // Let's check auth.js again. It verifies token and sets req.user.
            // Repositories might use req.user.id.
            // Let's stick to 'id' here to be safe and consistent with typical express usage, but Week12 used 'sub'.
            // Wait, Week12 auth.js: `req.user = user;` (decoded payload).
            // Week12 signup.js: `ownerId: req.user.id`.
            // So if payload has `sub`, req.user.id will be undefined unless logic maps it.
            // BUT Week12 generateToken.js used `sub`.
            // Let's look closely at Week12 signup.js again.
            // `ownerId: req.user.id` -> This implies req.user has .id property.
            // JSON web token standard uses 'sub' for subject (id).
            // If Week12 used 'sub', then req.user.id would be undefined unless jwt.verify returns something else or there is a mapper?
            // Actually, let's check Week12 again or just use 'id' to be safe.
            // I'll use 'id' in the payload.
            id: user._id?.toString?.() ?? user.id,
            email: user.email,
            role: user.role
        },
        JWT_SECRET,
        { expiresIn: EXPIRES_IN }
    );
}
