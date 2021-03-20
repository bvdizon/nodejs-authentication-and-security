// express server setup
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// db connection and models
require('./db/mongoose');

// importing custom routes
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

/**
 * expresss.js app customization
 */
app.use(express.json()); // converts incoming json to object
app.use(userRouter); // user new Router for users
app.use(taskRouter); // user new Router for tasks

// listening for changes at port specified
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
