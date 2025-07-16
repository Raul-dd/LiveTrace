export function getAuthUser() {
  const userData = localStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
}
