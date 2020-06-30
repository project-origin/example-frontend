export const environment = {
  production: true,
  apiUrl: window["env"]["apiUrl"] || "http://NOT.DEFINED",
  authUrl: window["env"]["authUrl"] || "http://NOT.DEFINED",
  logoutUrl: window["env"]["logoutUrl"] || "http://NOT.DEFINED",
};
