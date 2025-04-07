const API_URL = "http://127.0.0.1:8000/"

const loginUser = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append("username", email)
    formData.append("password", password)
    try {
        const response = await fetch (API_URL + "auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData
        });
        if(!response.ok) {
            const errorData = await response.json();
            const firstError = errorData.detail?.[0]?.msg || "Login failed";
            throw new Error(firstError);
        }
        const data = await response.json()
        const token = data.access_token;

        const decodedToken = JSON.parse(atob(token.split('.')[1])); 

        console.log("Decoded Token:", decodedToken);

        localStorage.setItem('userRole', decodedToken.role);
        localStorage.setItem('token', token);

        console.log('Login successful!');
    }
    catch (error) {
        console.error("Login Error: " , error);
        throw error;
    }
};
    
const signupUser = async (username, email, password, confirmPassword) => {
    try {
        console.log(username, email, password, confirmPassword)
        const response = await fetch (API_URL + "auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password, confirmPassword })
        });
        if(!response.ok) {
            const errorData = await response.json();
            const firstError = errorData.detail?.[0]?.msg || "Signup failed";
            throw new Error(firstError);
        }
        const data = await response.json()
        return data;
    }
    catch (error) {
        console.error("Signup Error: " , error);
        throw error;
    }
};
export {loginUser, signupUser};
    
