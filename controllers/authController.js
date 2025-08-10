const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.getLogin = (req, res) => {
  res.render('login');
};

exports.getRegister = (req, res) => {
  res.render('register');
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.send('No such user found.');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.send('Incorrect password.');

    req.session.user = user.username;
    res.redirect('/index');
  } catch (err) {
    console.error(err);
    res.send('Login error.');
  }
};

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    req.session.user = username;
    res.redirect('/index');
  } catch (err) {
    console.error(err);
    res.send('Registration failed. Username might already exist.');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) console.log(err);
    res.redirect('/');
  });
};
