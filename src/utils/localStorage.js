const storage = window.localStorage;

export function getStoredValue(key, fallbackValue = null) {
  try {
    const value = storage.getItem(key);
    return value === null ? fallbackValue : JSON.parse(value);
  } catch {
    return fallbackValue;
  }
}

export function setStoredValue(key, value) {
  storage.setItem(key, JSON.stringify(value));
}

export function removeStoredValue(key) {
  storage.removeItem(key);
}

export function clearStoredValues() {
  storage.clear();
}
