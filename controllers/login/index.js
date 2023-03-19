import {
  getCurrentPageName,
  renderNavbar,
  renderFooter,
  showAlertMessage,
  swicthAlertMessage,
  getTokenFromLocalstorage,
} from "../../functions";

import { LoginController } from "./login.controller";

const currentUrlName = getCurrentPageName();

const loginContainerElement = document.querySelector("#login");

loginContainerElement.innerHTML = `
  ${renderNavbar(currentUrlName)}
  <h1 class="pageTitle">Log in</h1>
  <form class="form" id="formLogin">
    <div class="formInputs">
      <input type="text" placeholder="User name" id="input_user_name" class="input"/>
      <input type="password" placeholder="Password" id="input_password" class="input"/>
    </div>  
    <div class="formOptions">
      <button type="submit" class="btn_login">Log in</button>
      <button type="button" class="btn_signup" onclick="window.location.href='/pages/signUp.html'">Sign up</button>
    </div>
  </form>
  ${renderFooter()}
`;

const form = loginContainerElement.children[2];
let count = 0;
const submitFormLogin = async (e) => {
  count++;
  e.preventDefault();
  const usernameInputValue = form.children[0].children[0].value;
  const passwordInputValue = form.children[0].children[1].value;
  const loginController = new LoginController(
    usernameInputValue,
    passwordInputValue,
    showAlertMessage()
  );
  await loginController
    .authenticateUser()
    .then(() => {
      const message =
        loginController.messageView.children[0].children[0].innerText;
      const alertType = loginController.messageView.children[0].classList;

      if (count === 1) {
        loginContainerElement.append(loginController.messageView);
      } else {
        swicthAlertMessage("", loginContainerElement, message, alertType);
      }
    })
    .finally(() => {
      setTimeout(() => {
        swicthAlertMessage("hide", loginContainerElement);
      }, 1500);
    });
};

form.addEventListener("submit", submitFormLogin);

const token = getTokenFromLocalstorage();
if (token) {
  window.location.href = "/index.html";
}
