// controllers/settingsController.js
const Setting = require("../models/setting");

// Show settings page
exports.getSettings = async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      // if no settings exist, create default
      setting = await Setting.create({
        clinicName: "My Clinic ERP"
      });
    }
    res.render("settings", { setting, message: null });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Update settings
exports.updateSettings = async (req, res) => {
  try {
    const {
      clinicName,
      address,
      phone,
      email,
      open,
      close,
      slotDuration,
      maxPatientsPerDay,
      currency,
      taxPercent,
      invoicePrefix,
      enableSMS,
      enableEmail,
      reminderBefore,
      darkMode,
      language
    } = req.body;

    let setting = await Setting.findOne();
    if (!setting) {
      setting = new Setting();
    }

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
