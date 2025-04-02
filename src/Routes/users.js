const API_URL = "http://127.0.0.1:8000/"

const getUsername = async (user_id) => {
    console.log("function called")
    try {
        console.log(user_id)
        const response = await fetch (`${API_URL}user/get-username-by-id/${user_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if(!response.ok) {
            const errorData = await response.json();
            const firstError = errorData.detail?.[0]?.msg || "Username Retrieval Failed";
            throw new Error(firstError);
        }
        const data = await response.json()
        return data.user;
    }
    catch (error) {
        console.error("Failed to get username: " , error);
        throw error;
    }
};
export {getUsername};