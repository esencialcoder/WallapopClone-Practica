export class LoginModel {
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.apiUrl = "http://127.0.0.1:8000/auth/login";
    this.error = false;
    this.serverResponse = null;
  }

  async logIn() {
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
        if (this.error) {
          this.serverResponse = data;
          return;
        }
        this.serverResponse = data.accessToken;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
