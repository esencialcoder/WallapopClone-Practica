import { LoginModel } from "../../models/login.model";
import { saveTokenToLocalstorage, setAlertViewType } from "../../functions";

export class LoginController {
  constructor(username, password, messageView) {
    this.messageView = messageView;
    this.userCredentials = {
      username,
      password,
    };
  }

  async authenticateUser() {
    try {
      const { username, password } = this.userCredentials;
      if ([username, password].includes("")) {
        setAlertViewType(this.messageView, "All fields are required!", "error");
        return;
      }
      setAlertViewType(this.messageView, "Checking user...!", "loading");
      const loginModel = new LoginModel(username, password);
      await loginModel.logIn();
      if (loginModel.error) {
        setAlertViewType(
          this.messageView,
          loginModel.serverResponse.message,
          "error"
        );
        return;
      }
      saveTokenToLocalstorage(loginModel.serverResponse);
      setAlertViewType(
        this.messageView,
        "User logged successfully!",
        "success"
      );
      setTimeout(() => {
        window.location.href = "/index.html";
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  }
}
