export class AppConfig {
  RedirectStatus: boolean;

  constructor() {
    this.RedirectStatus = true;
  }

  SaveChanges() {
    localStorage.setItem("linkfly-settings", JSON.stringify(this));
  }

  ChangeRedirectStatus() {
    this.RedirectStatus = !this.RedirectStatus;
    this.SaveChanges();
    return this.RedirectStatus;
  }

  static Load(): AppConfig {
    var localSettings = localStorage.getItem("linkfly-settings");
    let appConfig = new AppConfig();
    if (localSettings) {
      appConfig = Object.setPrototypeOf(
        JSON.parse(localSettings),
        AppConfig.prototype
      );
    }
    return appConfig;
  }
}
let APP_CONFIG = AppConfig.Load();
export default APP_CONFIG;
