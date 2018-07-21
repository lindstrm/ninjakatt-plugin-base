const fs = require('fs-extra');
module.exports = class Base {
  constructor(path) {
    this.path = path;
    this.name = path ? path.split('\\').pop() : '';
    this.checkRequiredProperties();
    this.settings = null;
    this.loadSettings();
  }

  checkRequiredProperties() {
    if (typeof this.setup !== 'function') {
      throw `Missing setup function in ${this.path}.`;
    }
  }

  loadSettings() {
    try {
      const userSettingsFile = `${global.appRoot}/plugins.json`;
      const user = fs.readJsonSync(userSettingsFile);
      const defaults = fs.readJsonSync(`${this.path}/settings.default.json`);

      if (user.hasOwnProperty(this.name)) {
        this.settings = Object.assign(defaults, user[this.name]);
      } else {
        this.settings = defaults;
      }
      this.saveSettings(this.settings);
    } catch (error) {}
  }

  saveSettings(settings) {
    const path = `${global.appRoot}/plugins.json`;
    const settingsContent = fs.readJsonSync(path);
    settingsContent[this.name] = settings;
    fs.writeJsonSync(path, settingsContent, { spaces: 2 });
  }

  get installable() {
    let installable = true;
    if (!fs.existsSync(`${this.path}/settings.default.json`) && this.path) {
      installable = false;
    }
    return installable;
  }
};
