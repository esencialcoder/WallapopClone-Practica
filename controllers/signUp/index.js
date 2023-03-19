import {
  getCurrentPageName,
  renderNavbar,
  renderFooter,
  showAlertMessage,
  swicthAlertMessage,
  getTokenFromLocalstorage,
} from "../../functions";

import { SignUpController } from "./signUp.controller";

const currentUrlName = getCurrentPageName();

const signUpElement = document.querySelector("#signup");

signUpElement.innerHTML = `
  ${renderNavbar(currentUrlName)}
  <h1 class="pageTitle variantSignUpPage">Sign up</h1>
  <form class="form" >
    <div class="formInputs">
      <input type="text" placeholder="User name" id="input_user_name" class="input"/>
      <input type="password" placeholder="Password" id="input_password" class="input"/>
      <input type="password" placeholder="Confirm your password" id="input_confirm_password" class="input"/>
    </div>  
    <div class="formOptions">
      <button type="submit" class="btn_signup">Create account</button>
      <button type="button" class="btn_login" onclick="window.location.href='/pages/login.html'">Log in</button>
    </div>
  </form>
  ${renderFooter()}
`;

const form = signUpElement.children[2];

let count = 0;
const submitFormSignUp = async (e) => {
  count++;
  e.preventDefault();
  const usernameInputValue = form.children[0].children[0].value;
  const passwordInputValue = form.children[0].children[1].value;
  const passwordConfirmInputValue = form.children[0].children[2].value;
  const signUpController = new SignUpController(
    usernameInputValue,
    passwordInputValue,
    passwordConfirmInputValue,
    showAlertMessage()
  );
  await signUpController
    .createUser()
    .then(() => {
      const message =
        signUpController.messageView.children[0].children[0].innerText;

      if (count === 1) {
        signUpElement.append(signUpController.messageView);
      } else {
        swicthAlertMessage("", signUpElement, message);
      }
    })
    .finally(() => {
      setTimeout(() => {
        swicthAlertMessage("hide", signUpElement);
      }, 1500);
    });
};

form.addEventListener("submit", submitFormSignUp);

const token = getTokenFromLocalstorage();
if (token) {
  window.location.href = "/index.html";
}
