import {
  getCurrentPageName,
  renderNavbar,
  renderFooter,
  getTokenFromLocalstorage,
  renderLogOutButton,
  showAlertMessage,
  swicthAlertMessage,
} from "../../functions";
import { ProductDetailsController } from "./productDetails.controller";

const currentUrlName = getCurrentPageName();

const productDetailElement = document.querySelector("#productDetails");

productDetailElement.innerHTML = `
  ${renderNavbar(currentUrlName)}
  <h1 class="pageTitle">Product details</h1>
  ${renderFooter()}
`;

if (getTokenFromLocalstorage()) {
  const logOutButton = renderLogOutButton();

  productDetailElement.append(logOutButton);
}
let count = 0;
const renderProductDetails = async () => {
  count++;

  const urlSearchParams = new URLSearchParams(window.location.search);
  const id = urlSearchParams.get("idProduct");

  const productDetailController = new ProductDetailsController(
    id,
    showAlertMessage(),
    productDetailElement
  );
  if (getTokenFromLocalstorage()) {
    await productDetailController
      .getProduct()
      .then(() => {
        if (productDetailController.productDetailView) {
          productDetailElement.append(
            productDetailController.productDetailView
          );
          const btnSell =
            productDetailElement.children[4].children[0].children[1]
              .children[4];

          btnSell.addEventListener("click", async () => {
            await productDetailController.sellOrBuyProduct(btnSell);
          });
        }
        const message =
          productDetailController.messageView.children[0].children[0].innerText;
        const alertType =
          productDetailController.messageView.children[0].classList;

        if (count === 1) {
          productDetailElement.append(productDetailController.messageView);
        } else {
          swicthAlertMessage("", productDetailElement, message, alertType);
        }
      })
      .finally(() => {
        setTimeout(() => {
          swicthAlertMessage("hide", productDetailElement);
        }, 1500);
      });
  } else {
    productDetailElement.innerHTML +=
      "<div>You must be logged to see page</div>";
  }
};

renderProductDetails();
