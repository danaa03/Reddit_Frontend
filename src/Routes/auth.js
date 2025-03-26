const API_URL = "http://127.0.0.1:8000/"

const loginUser = async (email, password) => {
    try {
        const response = await fetch (API_URL + "auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password })
        });
        if(!response.ok) {
            const errorData = await response.json();
            const firstError = errorData.detail?.[0]?.msg || "Login failed";
            throw new Error(firstError);
        }
        const data = await response.json()
        localStorage.setItem("token", data.token);
        return data;
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
        localStorage.setItem("token", data.token);
        return data;
    }
    catch (error) {
        console.error("Signup Error: " , error);
        throw error;
    }
};
export {loginUser, signupUser};
    
