const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// Middleware to parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Constants
const authCookieName = 'auth_token';

// In-memory data structures
let users = [];
let scores = [];

// Helper Functions
async function findUser(field, value) {
  if (!value) return null;
  return users.find((user) => user[field] === value);
}

async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { email, password: passwordHash, token: uuid.v4() };
  users.push(user);
  return user;
}

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    // Remove `secure: true` if testing locally over HTTP
    httpOnly: true,
    sameSite: 'strict',
  });
}

function updateScores(newScore) {
  let found = false;
  for (const [i, prevScore] of scores.entries()) {
    if (newScore.score > prevScore.score) {
      scores.splice(i, 0, newScore); // Insert the new score at the correct position
      found = true;
      break;
    }
  }
  if (!found) scores.push(newScore); // Add to the end if it's not higher than any existing scores
  if (scores.length > 10) scores.length = 10; // Trim the scores list to the top 10
  return scores;
}

// Middleware to verify that the user is authorized to call an endpoint
const verifyAuth = async (req, res, next) => {
  console.log('Cookies received:', req.cookies); // Debugging cookies
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    console.log('Authenticated user:', user.email); // Debugging user identification
    next(); // User is authenticated, proceed to the next middleware or endpoint handler
  } else {
    console.log('Authentication failed'); // Debugging authentication issues
    res.status(401).send({ msg: 'Unauthorized' }); // Respond with 401 if authentication fails
  }
};

// Set up the API router
let apiRouter = express.Router();
app.use('/api', apiRouter);

// Endpoints
apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('email', req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.email, req.body.password);
    setAuthCookie(res, user.token);
    console.log('Auth cookie set on create:', user.token); // Debugging token generation
    res.send({ email: user.email });
  }
});

apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('email', req.body.email);
  if (user && await bcrypt.compare(req.body.password, user.password)) {
    user.token = uuid.v4();
    setAuthCookie(res, user.token);
    console.log('Auth cookie set on login:', user.token); // Debugging token generation
    res.send({ email: user.email });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Protecting endpoints with verifyAuth middleware
apiRouter.get('/scores', verifyAuth, (_req, res) => {
  res.send(scores);
});

apiRouter.post('/score', verifyAuth, (req, res) => {
  scores = updateScores(req.body);
  res.send(scores);
});

// Default error handler
app.use((err, req, res, next) => {
  console.error(err); // Log the error for debugging
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the default page for unknown paths
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
