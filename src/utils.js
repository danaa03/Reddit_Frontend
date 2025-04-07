import { jwtDecode } from "jwt-decode";

export default function getUserFromToken(token) {
  try {
    const decodedToken = jwtDecode(token);
    const email = decodedToken?.sub || null; 
    const role = decodedToken?.role || null;  
    return { email, role };
  } catch (error) {
    console.error("Invalid token:", error);
    return { email: null, role: null };
  }
};
