<template>
  <div
    class="mt-10 overflow-hidden bg-white p-3 border-b border-gray-200 shadow sm:rounded-lg"
  >
    <h3 class="text-lg font-semibold mb-4">Category List</h3>

    <div class="mb-4">
      <label for="searchQuery" class="mr-2">Search by Name:</label>
      <input
        type="text"
        id="searchQuery"
        v-model="searchQuery"
        class="border rounded p-1"
        placeholder="Enter category name"
      />
      <button
        @click="fetchCategories"
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
        Add Category
      </button>
    </div>

    <div class="overflow-x-auto" id="pdf-content">
      <table class="min-w-full">
        <thead>
          <tr>
            <th class="px-4 py-2 whitespace-nowrap text-center">No</th>
            <th class="px-4 py-2 whitespace-nowrap text-center">Name</th>
            <th class="px-4 py-2 whitespace-nowrap text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(category, index) in categories" :key="category.id">
            <td class="px-4 py-2 whitespace-nowrap text-center">
              {{ index + 1 }}
            </td>
            <td class="px-4 py-2 whitespace-nowrap text-center">
              {{ category.category_name }}
            </td>
            <td class="px-4 py-2 whitespace-nowrap text-center">
              <button
                @click="openEditModal(category)"
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

    <AddCategoryModal
      :showModal="showModal"
      :categories="categories"
      @close="closeModal"
      @category-added="fetchCategories"
    />

    <EditCategoryModal
      :showModal="showEditModal"
      :categories="categories"
      :category="currentCategory"
      @close="closeEditModal"
      @category-updated="fetchCategories"
    />
  </div>
</template>

<script>
import axios from "axios";
import html2pdf from "html2pdf.js";
import AddCategoryModal from "./AddCategoryModal.vue";
import EditCategoryModal from "./EditCategoryModal.vue";

export default {
  components: {
    AddCategoryModal,
    EditCategoryModal,
  },
  data() {
    return {
      categories: [], // Removed duplicate definition
      searchQuery: "",
      showModal: false,
      showEditModal: false,
      currentCategory: {},
      currentPage: 1,
      pageSize: 10,
      totalCategories: 0,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalCategories / this.pageSize);
    },
  },
  methods: {
    getTokenFromCookie() {
      const cookieString = document.cookie;
      const tokenMatch = cookieString.match(/token=([^;]+)/);
      return tokenMatch ? tokenMatch[1] : null;
    },
    async fetchCategories(page = 1) {
      // Kept this single definition
      try {
        const token = this.getTokenFromCookie();
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const params = {
          category_name: this.searchQuery,
          page: page,
          pageSize: this.pageSize,
        };

        const response = await axios.get("http://localhost:5000/api/category", {
          headers,
          params,
        });

        this.categories = response.data.data.categories;
        this.totalCategories = response.data.data.totalCategories;
        this.currentPage = page;
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
    openEditModal(category) {
      this.currentCategory = { ...category }; // Copy category data for editing
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
    },
    async downloadPDF() {
      const element = document.getElementById("pdf-content");
      const options = {
        margin: 1,
        filename: "categories_list.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      await html2pdf().from(element).set(options).save();
    },
    async nextPage() {
      if (this.currentPage < this.totalPages) {
        await this.fetchCategories(this.currentPage + 1);
      }
    },
    async prevPage() {
      if (this.currentPage > 1) {
        await this.fetchCategories(this.currentPage - 1);
      }
    },
  },
  async mounted() {
    await this.fetchCategories();
  },
};
</script>
