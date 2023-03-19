import {
  getCurrentPageName,
  renderNavbar,
  renderFooter,
  showAlertMessage,
  swicthAlertMessage,
  getTokenFromLocalstorage,
} from "../../functions";

import { CreateProductController } from "./createProduct.controller";

const currentUrlName = getCurrentPageName();

const createProductContainerElement = document.querySelector(
  "#createProductContent"
);

createProductContainerElement.innerHTML = `
    ${renderNavbar(currentUrlName)}
    <h1 class="pageTitle">Create product</h1>
    <form class="form productForm" id="formCreateProduct">
      <div class="formInputs">
        <input type="file" placeholder="Choose a image to product" id="input_product_image" class="input"/>
        <input type="text" placeholder="Product name" id="input_product_name" class="input"/>
        <textarea  placeholder="Product description" id="input_description" class="input textarea"></textarea>
        <input type="number" placeholder="Product price in Euros" id="input_product_price" class="input"/>
        <select  id="select_type" class="input">
            <option value="">Select product type</option>
            <option value="Sale">Sale</option>
            <option value="Purchase">Purchase</option>
        </select>
      </div>  
      <div class="formOptions">
        <button type="submit" class="btn_login">Create product</button>
        <button type="reset" class="btn_signup">Clean form</button>
      </div>
    </form>
    ${renderFooter()}
  `;

const form = createProductContainerElement.children[2];
let count = 0;
const submitFormCreateProduct = async (e) => {
  count++;
  e.preventDefault();
  const productPhoto = form.children[0].children[0];
  const name = form.children[0].children[1].value;
  const description = form.children[0].children[2].value;
  const price = form.children[0].children[3].value;
  const type = form.children[0].children[4].value;
  const createProductController = new CreateProductController(
    { productPhoto, name, description, price, type },
    showAlertMessage()
  );

  await createProductController
    .saveProduct()
    .then(() => {
      const message =
        createProductController.messageView.children[0].children[0].innerText;
      const alertType =
        createProductController.messageView.children[0].classList;

      if (count === 1) {
        createProductContainerElement.append(
          createProductController.messageView
        );
      } else {
        swicthAlertMessage(
          "",
          createProductContainerElement,
          message,
          alertType
        );
      }
    })
    .finally(() => {
      setTimeout(() => {
        swicthAlertMessage("hide", createProductContainerElement);
      }, 1500);
    });
};

form.addEventListener("submit", submitFormCreateProduct);

const token = getTokenFromLocalstorage();
if (!token) {
  window.location.href = "/pages/login.html";
  alert("You must be logged to be able to access this page!");
}
