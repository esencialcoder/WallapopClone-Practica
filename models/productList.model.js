import {
  getTokenFromLocalstorage,
  parseJwt,
  getCurrentPageName,
} from "../functions";

export class ProductListModel {
  constructor() {
    this.productList = [];
    this.apiUrl = "http://127.0.0.1:8000/api/products";
    this.error = false;
    this.serverResponse = null;
  }

  getProductList() {
    return this.productList;
  }

  setProductList(productList) {
    this.productList = productList;
  }

  async fetchProducts(page = null) {
    const token = getTokenFromLocalstorage();
    if (token) {
      const user = parseJwt(token);
      this.apiUrl = page
        ? `http://127.0.0.1:8000/api/products?userId=${user.userId}&_page=${page}&_limit=10&_sort=updatedAt&_order=desc`
        : `http://127.0.0.1:8000/api/products?userId=${user.userId}&_sort=updatedAt&_order=desc`;
    } else {
      this.apiUrl = page
        ? `http://127.0.0.1:8000/api/products?_page=${page}&_limit=10&_sort=updatedAt&_order=desc`
        : "http://127.0.0.1:8000/api/products?_sort=updatedAt&_order=desc";
    }

    await fetch(this.apiUrl)
      .then((response) => {
        if (!response.ok) {
          this.error = true;
        } else {
          return response.json();
        }
      })
      .then((data) => {
        this.setProductList(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async deleteProduct(id, token) {
    let options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    this.apiUrl = `http://127.0.0.1:8000/api/products/${id}`;
    await fetch(this.apiUrl, options)
      .then((response) => {
        if (!response.ok) {
          this.error = true;
        }
        return response.json();
      })
      .then((result) => {
        if (this.error) {
          this.serverResponse = result.message;
        }
      })
      .catch((error) => {
        console.log(error);
      });

    if (this.error) {
      return "error";
    }
    return "ok";
  }
}
