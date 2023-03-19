export class SignUpModel {
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.apiUrl = "http://127.0.0.1:8000/auth/register";
    this.error = false;
    this.serverResponse = null;
  }

  async signUp() {
    let data = {
      username: this.username,
      password: this.password,
    };

    let options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    await fetch(this.apiUrl, options)
      .then((response) => {
        if (!response.ok) {
          this.error = true;
        }
        return response.json();
      })
      .then((data) => {
        this.serverResponse = data;
      })
      .catch((error) => {
        this.serverResponse = error;
        console.log(error);
      });
  }
}
