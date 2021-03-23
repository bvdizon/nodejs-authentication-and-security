const bcrypt = require('bcryptjs');

const pass = async () => {
  const password = 'Bvd021584';
  const enteredPW = 'Bvd021584';
  const hashedPW = await bcrypt.hash(password, 8);

  console.log(password, hashedPW);

  const isMatch = await bcrypt.compare(enteredPW, hashedPW);
  console.log(isMatch);
};

pass();
