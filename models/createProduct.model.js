import { getTokenFromLocalstorage } from "../functions";

export class CreateProductModel {
  constructor(
    productPhoto,
    name,
    description,
    price,
    type,
    creator,
    productStatus
  ) {
    this.productPhoto = productPhoto;
    this.name = name;
    this.description = description;
    this.price = price;
    this.type = type;
    this.creator = creator;
    this.productStatus = productStatus;
    this.apiUrl = "http://127.0.0.1:8000/api/products";
    this.apiUrlFile = "http://127.0.0.1:8000/upload";
    this.error = false;
    this.serverResponse = null;
  }
  async createNewProduct() {
    let file = new FormData();
    file.append("file", this.productPhoto.files[0]);

    const token = getTokenFromLocalstorage();
    const data = {
      name: this.name,
      description: this.description,
      price: this.price,
      type: this.type,
      creator: this.creator,
      productStatus: this.productStatus,
    };
    let options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    let fileOptions = {
      method: "POST",
      body: file,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await fetch(this.apiUrlFile, fileOptions)
      .then((response) => {
        if (!response.ok) {
          this.error = true;
        }
        return response.json();
      })
      .then(async (result) => {
        if (this.error) {
          this.serverResponse = result.message;
          return;
        }
        const filePath = result.path;
        const body = JSON.stringify({ ...data, productPhoto: filePath });
        await fetch(this.apiUrl, { ...options, body })
          .then((response) => {
            if (!response.ok) {
              this.error = true;
            }
            return response.json();
          })
          .then((result) => {
            if (this.error) {
              this.serverResponse = result;
              return;
            }
            console.log(result);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
