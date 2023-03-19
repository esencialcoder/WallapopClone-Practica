import { SignUpModel } from "../../models/signUp.model";
import { LoginModel } from "../../models/login.model";
import { setAlertViewType, saveTokenToLocalstorage } from "../../functions";

export class SignUpController {
  constructor(username, password, passwordConfirm, messageView) {
    this.messageView = messageView;
    this.userCredentials = {
      username,
      password,
      passwordConfirm,
    };
  }
  async createUser() {
    try {
      const { username, password, passwordConfirm } = this.userCredentials;
      if ([username, password, passwordConfirm].includes("")) {
        setAlertViewType(this.messageView, "All fields are required!", "error");
        return;
      }
      if (password !== passwordConfirm) {
        setAlertViewType(
          this.messageView,
          "The passwords don't match!",
          "error"
        );
        return;
      }
      const signUpModel = new SignUpModel(username, password);
      const loginModel = new LoginModel(username, password);

      setAlertViewType(this.messageView, "Creating user...!", "loading");
      await signUpModel.signUp();
      if (signUpModel.error) {
        setAlertViewType(
          this.messageView,
          signUpModel.serverResponse.message,
          "error"
        );
        return;
      }
      setAlertViewType(
        this.messageView,
        "User created successfully!",
        "success"
      );

      await loginModel.logIn();
      const token = loginModel.serverResponse;
      saveTokenToLocalstorage(token);
      window.location.href = "/index.html";
    } catch (error) {
      console.log(error);
    }
  }
}
