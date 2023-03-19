import { CreateProductModel } from "../../models/createProduct.model";
import { ProductListController } from "../productList/productList.controller";
import {
  setAlertViewType,
  getTokenFromLocalstorage,
  parseJwt,
  formatMoney,
} from "../../functions";

export class CreateProductController {
  constructor(data, messageView) {
    this.data = data;
    this.messageView = messageView;
  }

  async saveProduct() {
    try {
      const token = getTokenFromLocalstorage();
      const creator = parseJwt(token).username;
      const { productPhoto, name, description, price, type } = this.data;
      const productStatus = type === "Sale" ? "unsold" : "notbought";
      if ([name, description, price, type].includes("")) {
        setAlertViewType(this.messageView, "All fields are required!", "error");
        return;
      }
      setAlertViewType(this.messageView, "Saving product...!", "loading");
      const formattedPrice = formatMoney(price);
      const createProductModel = new CreateProductModel(
        productPhoto,
        name,
        description,
        formattedPrice,
        type,
        creator,
        productStatus
      );

      await createProductModel.createNewProduct();
      if (createProductModel.error) {
        setAlertViewType(
          this.messageView,
          createProductModel.serverResponse,
          "error"
        );
        return;
      }
      setAlertViewType(
        this.messageView,
        "Product has been created successfully!",
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
