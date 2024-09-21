import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token) => {
  if (!token) return true;
  const decodedToken = jwtDecode(token);
  return decodedToken.exp * 1000 < Date.now();
};
