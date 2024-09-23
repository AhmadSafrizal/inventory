<template>
  <div
    class="mt-10 overflow-hidden bg-white p-3 border-b border-gray-200 shadow sm:rounded-lg"
  >
    <h3 class="text-lg font-semibold mb-4">Product List</h3>

    <div class="mb-4">
      <label for="searchQuery" class="mr-2">Search by Name:</label>
      <input
        type="text"
        id="searchQuery"
        v-model="searchQuery"
        class="border rounded p-1"
        placeholder="Enter product name"
      />
      <button
        @click="fetchProducts"
        class="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Search
      </button>
      <button
        @click="downloadPDF"
        class="ml-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        Download PDF
      </button>
      <button
        @click="openModal"
        class="ml-4 bg-yellow-500 text-white px-4 py-2 rounded"
      >
        Add Product
      </button>
    </div>

    <div class="overflow-x-auto" id="pdf-content">
      <h3 class="pdf-title">Product List</h3>
      <table class="min-w-full">
        <thead>
          <tr>
            <th class="px-4 py-2 whitespace-nowrap text-center">No</th>
            <th class="px-4 py-2 whitespace-nowrap text-center">Image</th>
            <th class="px-4 py-2 whitespace-nowrap text-center">Name</th>
            <th class="px-4 py-2 whitespace-nowrap text-center">Description</th>
            <th class="px-4 py-2 whitespace-nowrap text-center">Category</th>
            <th class="px-4 py-2 whitespace-nowrap text-center">Price</th>
            <th class="px-4 py-2 whitespace-nowrap text-center">Stock</th>
            <th class="px-4 py-2 whitespace-nowrap text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in products" :key="product.id">
            <td class="px-4 py-2 whitespace-nowrap text-center">
              {{ index + 1 }}
            </td>
            <td class="px-4 py-2 whitespace-nowrap text-center">
              <img
                :src="product.image"
                alt="Product Image"
                class="h-16 w-16 object-cover"
              />
            </td>
            <td class="px-4 py-2 whitespace-nowrap text-center">
              {{ product.name }}
            </td>
            <td class="px-4 py-2 whitespace-nowrap text-center">
              {{ product.description }}
            </td>
            <td class="px-4 py-2 whitespace-nowrap text-center">
              {{ product.category.category_name }}
            </td>
            <td class="px-4 py-2 whitespace-nowrap text-center">
              {{ product.price }}
            </td>
            <td class="px-4 py-2 whitespace-nowrap text-center">
              {{ product.stock }}
            </td>
            <td class="px-4 py-2 whitespace-nowrap text-center">
              <button
                @click="openEditModal(product)"
                class="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="bg-gray-300 text-black px-4 py-2 rounded mr-2"
      >
        Previous
      </button>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="bg-gray-300 text-black px-4 py-2 rounded"
      >
        Next
      </button>
      <span class="ml-4">Page {{ currentPage }} of {{ totalPages }}</span>
    </div>

    <AddProductModal
      :showModal="showModal"
      :categories="categories"
      @close="closeModal"
      @product-added="fetchProducts"
    />
    <EditProductModal
      :showModal="showEditModal"
      :categories="categories"
      :product="currentProduct"
      @close="closeEditModal"
      @product-updated="fetchProducts"
    />
  </div>
</template>

<style scoped>
.pdf-title {
  display: none;
}

@media print {
  .pdf-title {
    display: block;
    text-align: center;
    font-size: 32px; /* Ukuran font lebih besar */
    font-weight: bold; /* Tebalkan teks */
    margin-bottom: 30px; /* Tambah jarak di bawah judul */
  }
}
</style>

<script>
import axios from "axios";
import html2pdf from "html2pdf.js";
import AddProductModal from "./AddProductModal.vue";
import EditProductModal from "./EditProductModal.vue";

export default {
  components: {
    AddProductModal,
    EditProductModal,
  },
  data() {
    return {
      products: [],
      categories: [],
      searchQuery: "",
      showModal: false,
      showEditModal: false,
      currentProduct: {},
      currentPage: 1,
      pageSize: 50,
      totalProducts: 0,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalProducts / this.pageSize);
    },
  },
  methods: {
    getTokenFromCookie() {
      const cookieString = document.cookie;
      const tokenMatch = cookieString.match(/token=([^;]+)/);
      return tokenMatch ? tokenMatch[1] : null;
    },
    async fetchProducts(page = 1) {
      try {
        const token = this.getTokenFromCookie();
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const params = {
          name: this.searchQuery,
          page: page,
          pageSize: this.pageSize,
        };

        const response = await axios.get("http://localhost:5000/api/product", {
          headers,
          params,
        });

        this.products = response.data.data.products;
        this.totalProducts = response.data.data.totalProducts;
        this.currentPage = page;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    async fetchCategories() {
      try {
        const token = this.getTokenFromCookie();
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get("http://localhost:5000/api/category", {
          headers,
        });
        this.categories = response.data.data.categories;
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    openEditModal(product) {
      this.currentProduct = { ...product };
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
    },
    async downloadPDF() {
      const titleElement = document.querySelector(".pdf-title");

      titleElement.style.display = "block";
      titleElement.style.textAlign = "center";
      titleElement.style.fontSize = "32px";
      titleElement.style.fontWeight = "bold";
      titleElement.style.marginBottom = "30px";

      const element = document.getElementById("pdf-content");
      const options = {
        margin: 1,
        filename: "products_list.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      await html2pdf().from(element).set(options).save();

      titleElement.style.display = "none";
    },

    async nextPage() {
      if (this.currentPage < this.totalPages) {
        await this.fetchProducts(this.currentPage + 1);
      }
    },
    async prevPage() {
      if (this.currentPage > 1) {
        await this.fetchProducts(this.currentPage - 1);
      }
    },
  },
  async mounted() {
    await this.fetchProducts();
    await this.fetchCategories();
  },
};
</script>
