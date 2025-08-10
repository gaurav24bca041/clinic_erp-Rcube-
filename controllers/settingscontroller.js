const Setting = require('../models/setting');

exports.getSettings = (req, res) => {
  res.render('settings');
};

exports.postSettings = async (req, res) => {
  try {
    const { clinicName, address, contactEmail } = req.body;

    let settings = await Setting.findOne();
    if (!settings) settings = new Setting();

    settings.clinicName = clinicName;
    settings.address = address;
    settings.contactEmail = contactEmail;

    await settings.save();
    res.redirect('/settings');
  } catch (error) {
    console.error('Error saving settings:', error);
    res.send('Error saving settings');
  }
};
