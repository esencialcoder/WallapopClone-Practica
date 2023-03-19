import { getTokenFromLocalstorage } from "../functions";
import { ProductListModel } from "./productList.model";

export class ProductDetailsModel {
  constructor(productId) {
    this.productDetails = {};
    this.apiUrl = `http://127.0.0.1:8000/api/products/${productId}`;
    this.error = false;
    this.serverResponse = null;
  }

  getProductDetails() {
    return this.productDetails;
  }

  async fetchProductDetails() {
    await fetch(this.apiUrl)
      .then((response) => {
        if (!response.ok) {
          this.error = true;
        }
        return response.json();
      })
      .then((data) => {
        this.productDetails = data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async updateProductStatus(updatedProduct) {
    const productListModel = new ProductListModel();
    const token = getTokenFromLocalstorage();
    let options = {
      method: "PUT",
      body: JSON.stringify(updatedProduct),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    this.apiUrl = `http://127.0.0.1:8000/api/products/${updatedProduct.id}`;
    await fetch(this.apiUrl, options)
      .then((response) => {
        if (!response.ok) {
          this.error = true;
        }
        productListModel.deleteProduct(updatedProduct.id, token);
        return response.json();
      })
      .then((data) => {
        this.productDetails = data;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
