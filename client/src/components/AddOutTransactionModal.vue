<template>
  <div
    v-if="showModal"
    class="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
      <h3 class="text-lg font-semibold mb-4">Add New Transaction</h3>
      <form @submit.prevent="addTransaction">
        <div class="mb-4">
          <label class="block text-gray-700">Product Name:</label>
          <select
            v-model="newTransaction.product_id"
            class="border rounded w-full p-2"
            required
          >
            <option value="" disabled>Select a product</option>
            <option
              v-for="product in products"
              :key="product.id"
              :value="product.id"
            >
              {{ product.name }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Quantity:</label>
          <input
            type="number"
            v-model="newTransaction.quantity"
            class="border rounded w-full p-2"
            required
            min="1"
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
  },
  data() {
    return {
      newTransaction: {
        product_id: null,
        quantity: 0,
      },
      products: [],
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    async addTransaction() {
      try {
        const token = this.getTokenFromCookie();
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const transactionData = {
          product_id: this.newTransaction.product_id,
          quantity: this.newTransaction.quantity,
          transactionType_id: 2,
        };

        await axios.post(
          "http://localhost:5000/api/transaction",
          transactionData,
          { headers }
        );
        this.$emit("transaction-added");
        this.closeModal();
      } catch (error) {
        console.error(
          "Error adding transaction:",
          error.response ? error.response.data : error.message
        );
      }
    },
    async fetchProducts() {
      try {
        const token = this.getTokenFromCookie();
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get("http://localhost:5000/api/product", {
          headers,
        });
        this.products = response.data.data.products;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    getTokenFromCookie() {
      const cookieString = document.cookie;
      const tokenMatch = cookieString.match(/token=([^;]+)/);
      return tokenMatch ? tokenMatch[1] : null;
    },
  },
  async mounted() {
    await this.fetchProducts();
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
