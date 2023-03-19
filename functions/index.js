import "../styles/navStyles.css";
import "../styles/footerStyles.css";
import "../styles/alertMessage.css";
import "../styles/productCard.css";

const getCurrentPageName = () => {
  return location.href.split("/")[4];
};

const renderNavbar = (currentUrlName = "/index.html") => {
  const token = getTokenFromLocalstorage();

  const isCurrentPageLogin = currentUrlName === "login.html" ? true : false;
  const isCurrentPageSignUp = currentUrlName === "signUp.html" ? true : false;
  const isCurrentPageProductDetail =
    currentUrlName?.split("?")[0] === "productDetails.html" ? true : false;
  const isCurrentPageCreateProduct =
    currentUrlName === "createProduct.html" ? true : false;
  return `
    <nav class="navigation">
      <a class="logo" href="/">Clon Wallapop</a> 
      <li class="options">    
          <a class="link" href="${
            isCurrentPageLogin ||
            isCurrentPageSignUp ||
            isCurrentPageProductDetail ||
            isCurrentPageCreateProduct
              ? "/index.html"
              : token
              ? "/index.html"
              : "/pages/login.html"
          }">
            ${
              isCurrentPageLogin ||
              isCurrentPageSignUp ||
              isCurrentPageProductDetail
                ? "Go back"
                : token
                ? isCurrentPageCreateProduct
                  ? "Go back"
                  : "Reload list"
                : "Log in or Sign up"
            }
          </a>
        ${
          isCurrentPageLogin || isCurrentPageSignUp
            ? ""
            : token
            ? isCurrentPageCreateProduct
              ? ""
              : "<a class='link variant' href='/pages/createProduct.html'>Add product</a>"
            : ""
        }
      </li>
    </nav> 
  `;
};

const renderFooter = () => {
  return `
    <footer class="footerPage">
      <p class="copyright">Derechos reservados©</p>          
    </footer>
  `;
};

const showAlertMessage = () => {
  const alertMessageContainer = document.createElement("div");
  const alertMessage = document.createElement("div");
  const messageText = document.createElement("span");
  alertMessageContainer.classList = "alertContainer";
  alertMessageContainer.name = "alert";
  alertMessage.classList = "alert";
  messageText.classList = "message";
  alertMessage.append(messageText);
  alertMessageContainer.append(alertMessage);
  return alertMessageContainer;
};

const swicthAlertMessage = (className, alert, message = "", type = "") => {
  for (let index = 0; index < alert.children.length; index++) {
    const element = alert.children[index];
    if (element.name === "alert") {
      element.classList = `alertContainer ${className}`;
      element.children[0].classList = type;
      element.children[0].children[0].innerText = message;
    }
  }
};

const setAlertViewType = (messageView, message, type) => {
  messageView.children[0].classList = `alert ${type}`;
  messageView.children[0].children[0].innerText = message;
};

const renderDeleteProduct = () => {
  const buttonDeleteProduct = document.createElement("button");
  buttonDeleteProduct.classList = "btn_delete_product hidden";
  buttonDeleteProduct.append("Eliminar");

  return buttonDeleteProduct;
};

const renderProductCard = (productData = {}) => {
  const token = getTokenFromLocalstorage();
  const { id, productPhoto, name, price, removeProduct, userId, type } =
    productData;
  const buttonDelete = renderDeleteProduct();
  const cardContainer = document.createElement("div");
  const card = document.createElement("div");
  const cardHead = document.createElement("div");
  const cardImage = document.createElement("img");
  const cardBody = document.createElement("div");
  const text = document.createElement("span");
  const text2 = document.createElement("span");
  const text3 = document.createElement("span");
  const textId = document.createElement("small");
  text3.innerHTML = price;
  textId.classList = "textId";
  card.classList = "card";
  cardContainer.classList = "cardContainer";
  cardHead.classList = "cardHead";
  cardImage.classList = "productPhoto";
  cardBody.classList = "cardBody";
  text.classList = "text";
  text2.classList = "text";
  text3.classList = "text";
  cardImage.alt = name;
  cardImage.src = productPhoto;
  card.id = "product";
  textId.append(id);
  cardHead.append(cardImage);
  card.append(cardHead);
  cardBody.append(text3, text, text2);
  cardContainer.append(card);

  const loggedUser = token ? parseJwt(token) : 1;
  if (token && loggedUser?.userId === userId) {
    buttonDelete.classList = "btn_delete_product";
  }

  cardContainer.append(buttonDelete);

  text.append(name);
  text2.append(type);
  text.append(textId);
  card.append(cardBody);
  card.addEventListener("click", () => {
    window.location.href = `/pages/productDetails.html?idProduct=${id}`;
  });

  buttonDelete.addEventListener("click", removeProduct);

  return cardContainer;
};

const renderEmptyProductList = () => {
  const emptyContainer = document.createElement("div");
  const emptyImage = document.createElement("img");
  const emptyText = document.createElement("span");
  emptyContainer.classList = "emptyContainer";
  emptyImage.classList = "empty";
  emptyImage.alt = "Empty list";
  emptyImage.src = "/images/empty.png";
  emptyText.append("There're not any products to show!");
  emptyContainer.append(emptyImage);
  emptyContainer.append(emptyText);
  return emptyContainer;
};

const renderProductDetailsCard = (productData = {}) => {
  const { productPhoto, name, description, price, type, productStatus } =
    productData;
  const cardContainer = document.createElement("div");
  const card = document.createElement("div");
  const cardHead = document.createElement("div");
  const cardImage = document.createElement("img");
  const cardBody = document.createElement("div");
  const btnSale = document.createElement("button");
  btnSale.innerText =
    productStatus === "unsold" || productStatus === "notbought"
      ? type === "Sale"
        ? "Sell"
        : "Buy"
      : productStatus;
  cardContainer.classList = "cardContainer";
  let productInfo = [],
    data = [name, description, price, type];

  for (let index = 0; index < data.length; index++) {
    let text = document.createElement(index === 1 ? "p" : "span");
    productInfo.push(text);
    text.classList = index === 1 ? "paragraph" : "text";
    text.append(data[index]);
  }

  card.classList = "card details";
  cardHead.classList = "cardHead";
  cardImage.classList = "productPhoto";
  cardBody.classList = "cardBody details";
  btnSale.classList = "btnSale";
  cardImage.alt = name;
  cardImage.src = productPhoto;

  cardHead.append(cardImage);
  card.append(cardHead);
  productInfo.forEach((item) => {
    cardBody.append(item);
  });
  cardBody.append(btnSale);
  card.append(cardBody);
  cardContainer.append(card);

  return cardContainer;
};

const saveTokenToLocalstorage = (token) => {
  localStorage.setItem("token", token);
};

const getTokenFromLocalstorage = () => {
  const tokenLS = localStorage.getItem("token");
  if (tokenLS) {
    return tokenLS;
  }
  return null;
};

const renderLogOutButton = () => {
  const button = document.createElement("button");
  button.classList = "btn_logout";
  button.append("Log out");
  button.addEventListener("click", () => logOut());
  return button;
};

const logOut = () => {
  if (getTokenFromLocalstorage()) {
    localStorage.removeItem("token");
    window.location.reload();
  }
};

const parseJwt = (token) => {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};

const formatMoney = (price) => {
  const parsedPrice = parseInt(price);
  const formattedPrice = parsedPrice.toLocaleString("es", {
    style: "currency",
    currency: "EUR",
  });
  return formattedPrice;
};

export {
  getCurrentPageName,
  renderNavbar,
  renderFooter,
  showAlertMessage,
  renderProductCard,
  renderEmptyProductList,
  renderProductDetailsCard,
  saveTokenToLocalstorage,
  getTokenFromLocalstorage,
  renderLogOutButton,
  swicthAlertMessage,
  setAlertViewType,
  parseJwt,
  formatMoney,
};
