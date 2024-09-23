<template>
  <div
    v-if="showModal"
    class="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white rounded-lg p-6 shadow-xl max-w-lg w-full">
      <h3 class="text-lg font-semibold mb-4">Add New Product</h3>
      <form @submit.prevent="addProduct">
        <div class="mb-4">
          <label class="block text-gray-700">Name:</label>
          <input
            type="text"
            v-model="newProduct.name"
            class="border rounded w-full p-2"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Description:</label>
          <input
            type="text"
            v-model="newProduct.description"
            class="border rounded w-full p-2"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Stock:</label>
          <input
            type="number"
            v-model="newProduct.stock"
            class="border rounded w-full p-2"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Price:</label>
          <input
            type="number"
            v-model="newProduct.price"
            class="border rounded w-full p-2"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Category:</label>
          <select
            v-model="newProduct.category_id"
            class="border rounded w-full p-2"
            required
          >
            <option disabled value="">Select a category</option>
            <option
              v-for="category in categories"
              :value="category.id"
              :key="category.id"
            >
              {{ category.category_name }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Image:</label>
          <input
            type="file"
            @change="onFileChange"
            class="border rounded w-full p-2"
            required
          />
        </div>
        <div class="flex justify-end">
          <button
            type="button"
            @click="closeModal"
            class="mr-2 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
    categories: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      newProduct: {
        name: "",
        description: "",
        stock: 0,
        price: 0,
        category_id: null,
        image: null,
      },
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    onFileChange(event) {
      this.newProduct.image = event.target.files[0];
    },
    async addProduct() {
      try {
        const token = this.getTokenFromCookie();
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        };
        const formData = new FormData();
        formData.append("name", this.newProduct.name);
        formData.append("description", this.newProduct.description);
        formData.append("stock", this.newProduct.stock);
        formData.append("price", this.newProduct.price);
        formData.append("category_id", this.newProduct.category_id);
        formData.append("image", this.newProduct.image);

        await axios.post("http://localhost:5000/api/product", formData, {
          headers,
        });
        this.$emit("product-added");
        this.closeModal();
      } catch (error) {
        console.error("Error adding product:", error);
      }
    },
    getTokenFromCookie() {
      const cookieString = document.cookie;
      const tokenMatch = cookieString.match(/token=([^;]+)/);
      return tokenMatch ? tokenMatch[1] : null;
    },
  },
};
</script>

<style scoped>
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
