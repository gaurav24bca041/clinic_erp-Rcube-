const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  clinicName: String,
  address: String,
  contactEmail: String,
  password: String  
});

module.exports = mongoose.model('Setting', settingSchema);
