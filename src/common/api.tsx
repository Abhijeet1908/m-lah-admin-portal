import axios from "axios";

export async function login(userName: string, password: string) {
  const url = `https://mlha-e9f4fydheqbweudd.centralus-01.azurewebsites.net/api/Account/Authenticate?username=${userName}&password=${password}`;

  try {
    const response = await axios.get(url);

    console.log("response data is:", response.data);

    localStorage.setItem("role", response.data.username);
    localStorage.setItem("token", response.data.token);

    console.log("Saved role:", localStorage.getItem("role"));

    return response.data; // Return only after everything is done
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
}
