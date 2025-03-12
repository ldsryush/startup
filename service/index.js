const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// In-memory storage for users and scores
let users = [];
let scores = [];
const authCookieName = 'auth_token';

// Helper Functions
async function findUser(field, value) {
  if (!value) return null;
  return users.find((user) => user[field] === value);
}

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

function updateScores(newScore) {
  let found = false;
  for (const [i, prevScore] of scores.entries()) {
    if (newScore.score > prevScore.score) {
      scores.splice(i, 0, newScore);
      found = true;
      break;
    }
  }
  if (!found) {
    scores.push(newScore);
  }
  if (scores.length > 10) {
    scores.length = 10;
  }
  return scores;
}

// Middleware to verify authentication
const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

// Router
let apiRouter = express.Router();
app.use('/api', apiRouter);

// CreateAuth - Register a new user
apiRouter.post('/auth/create', async (req, res) => {
  const { email, password } = req.body;
  if (await findUser('email', email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { email, password: hashedPassword, token: uuidv4() };
    users.push(user);
    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  }
});

// GetAuth - Login
apiRouter.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser('email', email);
  if (user && (await bcrypt.compare(password, user.password))) {
    user.token = uuidv4(); // Regenerate token
    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// DeleteAuth - Logout
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token; // Remove token
  }
  res.clearCookie(authCookieName); // Clear auth cookie
  res.status(204).end();
});

// GetScores - Restricted endpoint
apiRouter.get('/scores', verifyAuth, (_req, res) => {
  res.send(scores);
});

// SubmitScore - Restricted endpoint
apiRouter.post('/score', verifyAuth, (req, res) => {
  scores = updateScores(req.body);
  res.send(scores);
});

// Default error handler
app.use((err, req, res, next) => {
  res.status(500).send({ type: err.name, message: err.message });
});

// Catch-All for Unknown Paths
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
