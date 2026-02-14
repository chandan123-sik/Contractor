import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId) => {
    const expiresIn = process.env.JWT_EXPIRE || '7d';
    
    // Log only on first token generation
    if (!generateAccessToken.logged) {
        console.log('🔐 JWT Configuration:');
        console.log('   JWT_SECRET exists:', !!process.env.JWT_SECRET);
        console.log('   JWT_EXPIRE:', expiresIn);
        generateAccessToken.logged = true;
    }
    
    console.log(`🔑 Generating access token for user ${userId} with expiry: ${expiresIn}`);
    
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn }
    );
};

export const generateRefreshToken = (userId) => {
    const expiresIn = process.env.JWT_REFRESH_EXPIRE || '30d';
    console.log(`🔑 Generating refresh token for user ${userId} with expiry: ${expiresIn}`);
    
    return jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn }
    );
};

export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};
