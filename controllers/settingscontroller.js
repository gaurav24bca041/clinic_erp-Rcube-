const Setting = require("../models/setting");

exports.getSettings = async (req, res) => {
  if (!req.session.userId) return res.redirect('/'); // login check
  try {
    // ✅ userId ke saath query
    let setting = await Setting.findOne({ userId: req.session.userId });
    if (!setting) {
      setting = await Setting.create({ 
        clinicName: "My Clinic ERP",
        userId: req.session.userId  // 👈 user-specific
      });
    }
    res.render("settings", { setting, message: null });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.updateSettings = async (req, res) => {
  if (!req.session.userId) return res.redirect('/'); // login check
  try {
    const { clinicName, address, phone, email, open, close, slotDuration, maxPatientsPerDay,
            currency, taxPercent, invoicePrefix, enableSMS, enableEmail, reminderBefore,
            darkMode, language } = req.body;

    // ✅ userId ke saath find
    let setting = await Setting.findOne({ userId: req.session.userId }) || 
                  new Setting({ userId: req.session.userId });

    setting.clinicName = clinicName;
    setting.address = address;
    setting.phone = phone;
    setting.email = email;
    setting.workingHours = { open, close };
    setting.appointment = { slotDuration, maxPatientsPerDay };
    setting.billing = { currency, taxPercent, invoicePrefix };
    setting.notification = { enableSMS: !!enableSMS, enableEmail: !!enableEmail, reminderBefore };
    setting.theme = { darkMode: !!darkMode, language };
    setting.updatedAt = Date.now();

    await setting.save();

    res.render("settings", { setting, message: "Settings updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating settings");
  }
};
