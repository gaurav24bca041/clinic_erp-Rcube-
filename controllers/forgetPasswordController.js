const User = require("../models/user");

exports.getForgetPassword = (req, res) => {
  res.render("forgetPassword", { message: null });
};

exports.postForgetPassword = async (req, res) => {
  const { username, newPassword, confirmPassword } = req.body;

  try {
    // check username exist
    const user = await User.findOne({ username });
    if (!user) {
      return res.render("forgetPassword", { message: "❌ Username not found." });
    }

    // check passwords match
    if (newPassword !== confirmPassword) {
      return res.render("forgetPassword", { message: "❌ Passwords do not match." });
    }

    // update password (raw password, pre-save hook will hash)
    user.password = newPassword;
    await user.save();

    return res.redirect("/"); // success, back to login
  } catch (err) {
    console.error("Error resetting password:", err);
    res.render("forgetPassword", { message: "⚠️ Error resetting password." });
  }
};
