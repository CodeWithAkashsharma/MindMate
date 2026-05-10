const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Check if the token was sent in the headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Extract the token from the header (It looks like "Bearer eyJhbGciOi...")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using your secret key from the .env file
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find the user in the database using the ID hidden inside the token
      // We use .select('-password') to ensure the password is NOT attached to the request
      req.user = await User.findById(decoded.id).select('-password');

      // 5. The user is verified! Move on to the controller.
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  // 6. If no token was found at all
  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };