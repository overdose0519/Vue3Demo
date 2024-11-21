export default {
  getItem(key) {
    try {
      return JSON.parse(sessionStorage.getItem(key));
    } catch (err) {
      return null;
    }
  },
  setItem(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  removeItem(key) {
    sessionStorage.removeItem(key);
  },
  clear() {
    sessionStorage.clear();
  }
}
