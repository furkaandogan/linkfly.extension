export class AppConfig {
  private static LOCAL_STORAGE_KEY = "linkfly-settings";

  RedirectStatus: boolean;
  ContextMenuStatus: boolean;

  constructor() {
    this.RedirectStatus = true;
    this.ContextMenuStatus = true;
  }

  SaveChanges() {
    localStorage.setItem(AppConfig.LOCAL_STORAGE_KEY, JSON.stringify(this));
  }

  ChangeRedirectStatus() {
    this.RedirectStatus = !this.RedirectStatus;
    this.SaveChanges();
    return this.RedirectStatus;
  }

  ChangeContextMenuStatus() {
    this.ContextMenuStatus = !this.ContextMenuStatus;
    this.SaveChanges();
    return this.ContextMenuStatus;
  }

  static Load(): AppConfig {
    var localSettings = localStorage.getItem(AppConfig.LOCAL_STORAGE_KEY);
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
