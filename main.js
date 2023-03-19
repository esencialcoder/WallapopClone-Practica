import {
  renderNavbar,
  renderFooter,
  renderLogOutButton,
  getTokenFromLocalstorage,
  showAlertMessage,
  swicthAlertMessage,
} from "./functions";
import { ProductListController } from "./controllers/productList/productList.controller";

const appElement = document.querySelector("#app");

appElement.innerHTML = `
  ${renderNavbar()}
  <h1 class="pageTitle">Product list</h1>
  <li class="productList"></li>
  ${renderFooter()}
`;
if (getTokenFromLocalstorage()) {
  const logOutButton = renderLogOutButton();
  appElement.append(logOutButton);
}

let count = 0;
let productList = appElement.children[2];
let page = 1;

const productListController = new ProductListController(
  productList,
  showAlertMessage(),
  appElement
);

const renderProductList = async () => {
  count++;
  await productListController
    .getAllProducts(page)
    .then(() => {
      productListController.getTotalProducts();

      appElement.append(productListController.productListView);
      const message =
        productListController.messageView.children[0].children[0].innerText;
      const alertType = productListController.messageView.children[0].classList;

      if (count === 1) {
        appElement.append(productListController.messageView);
      } else {
        swicthAlertMessage("", appElement, message, alertType);
      }
    })
    .finally(() => {
      setTimeout(() => {
        swicthAlertMessage("hide", appElement);
      }, 1500);
    });
};

const renderPagination = () => {
  const pagination = document.createElement("div");
  pagination.classList = "pagination";
  const buttonPrev = document.createElement("button");
  const buttonNext = document.createElement("button");
  buttonPrev.classList = "btn_paginate";
  buttonNext.classList = "btn_paginate";
  buttonPrev.innerText = "Previous";
  buttonNext.innerText = "Next";
  pagination.append(buttonPrev, buttonNext);
  appElement.append(pagination);

  buttonNext.addEventListener("click", () => {
    if (page < Math.ceil(productListController.totalProducts / 10)) {
      page++;
      productListController.getAllProducts(page);
    }
  });

  buttonPrev.addEventListener("click", () => {
    if (page > 1) {
      page--;
      productListController.getAllProducts(page);
    }
  });
};

renderProductList();
renderPagination();
