import { ProductDetailsModel } from "../../models/productDetails.model";
import {
  renderProductDetailsCard,
  setAlertViewType,
  swicthAlertMessage,
} from "../../functions";

export class ProductDetailsController {
  constructor(productId, messageView, appElementView) {
    this.productDetailsModel = new ProductDetailsModel(productId);
    this.productDetailView = null;
    this.messageView = messageView;
    this.data = {};
    this.sellingIndicatorView = "";
    this.appElementView = appElementView;
  }

  async getProduct() {
    try {
      setAlertViewType(this.messageView, "Loading product data....", "loading");
      await this.productDetailsModel.fetchProductDetails();
      this.data = this.productDetailsModel.getProductDetails();
      if (!this.productDetailsModel.error) {
        if (Object.keys(this.data).length > 0) {
          let productDetailsCard = renderProductDetailsCard(this.data);
          this.productDetailView = productDetailsCard;
          setAlertViewType(
            this.messageView,
            "Product data has been loaded successfully!",
            "success"
          );
        }
      } else {
        setAlertViewType(
          this.messageView,
          "An error has been ocurred!",
          "error"
        );
      }
    } catch (error) {
      setAlertViewType(this.messageView, error, "error");
    }
  }

  async sellOrBuyProduct(sellingIndicatorView) {
    try {
      setAlertViewType(this.messageView, "Processing product....", "loading");
      this.sellingIndicatorView = sellingIndicatorView;
      if (Object.keys(this.data).length > 0) {
        let status = this.data.type === "Sale" ? "Sold" : "Bought";
        await this.productDetailsModel.updateProductStatus({
          ...this.data,
          productStatus: status,
        });
        if (this.productDetailsModel.error) {
          setAlertViewType(
            this.messageView,
            this.productDetailsModel.serverResponse,
            "error"
          );
          return;
        }
        this.sellingIndicatorView.innerText =
          this.data.type === "Sale" ? "Sold" : "Bought";
        this.sellingIndicatorView.disabled = true;
        setAlertViewType(
          this.messageView,
          `The product has been ${
            this.data.type === "Sale" ? "sold" : "bought"
          } successfully!`,
          "success"
        );

        const message = this.messageView.children[0].children[0].innerText;
        const alertType = this.messageView.children[0].classList;

        swicthAlertMessage("", this.appElementView, message, alertType);

        setTimeout(() => {
          swicthAlertMessage("hide", this.appElementView);
          window.location.href = "/index.html";
        }, 1500);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
