export default class StorageService {
  static async loadJSON(database) {
    const res = await fetch(`../db/${database}.json`);
    const data = await res.json();
    localStorage.setItem(database, JSON.stringify(data));
  }

  static get(database) {
    return JSON.parse(localStorage.getItem(database)) || [];
  }

  static set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
