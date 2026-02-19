export default function jsonParser(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    return parsed;
  } catch (_err) {
    return {};
  }
}
