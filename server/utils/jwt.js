import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_hackathon_jwt_key_ps65_2026';

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: '7d'
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
