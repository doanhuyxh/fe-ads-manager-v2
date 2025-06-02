//libs/web-api

// Clipboard API
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Copy failed:", err);
    return false;
  }
}

export async function readFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    return text;
  } catch (err) {
    console.error("Read clipboard failed:", err);
    return null;
  }
}

// Geolocation API
export function getCurrentLocation(options = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    }
  });
}

// Permissions API
export async function queryPermission(name) {
  try {
    const result = await navigator.permissions.query({ name });
    return result.state; // 'granted' | 'prompt' | 'denied'
  } catch (err) {
    console.error("Permission query failed:", err);
    return null;
  }
}
