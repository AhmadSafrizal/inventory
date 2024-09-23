<template>
  <div
    class="mt-10 overflow-hidden bg-white p-3 border-b border-gray-200 shadow sm:rounded-lg"
  >
    <h3 class="text-lg font-semibold mb-4">Outgoing Transactions</h3>

    <div class="mb-4">
      <label for="startDate" class="mr-2">Start Date:</label>
      <input
        type="date"
        id="startDate"
        v-model="startDate"
        class="border rounded p-1"
      />
      <label for="endDate" class="ml-4 mr-2">End Date:</label>
      <input
        type="date"
        id="endDate"
        v-model="endDate"
        class="border rounded p-1"
      />
      <button
        @click="fetchTransactions"
        class="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Filter
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
        Add Transaction
      </button>
    </div>

    <div class="overflow-x-auto" id="pdf-content">
      <h3 class="pdf-title">Outgoing Transactions</h3>
      <table class="min-w-full">
        <thead>
          <tr>
            <th class="px-4 py-2 whitespace-nowrap text-center">No</th>
            <th class="px-4 py-2 whitespace-nowrap text-center">
              Product Name
            </th>
            <th class="px-4 py-2 whitespace-nowrap text-center">Quantity</th>
            <th class="px-4 py-2 whitespace-nowrap text-center">Price</th>
            <th class="px-4 py-2 whitespace-nowrap text-center">Date</th>
            <th class="px-4 py-2 whitespace-nowrap text-center">Total Stock</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(transaction, index) in transactions"
            :key="transaction.id"
          >
            <td class="px-4 py-2 whitespace-nowrap text-center">
              {{ (currentPage - 1) * pageSize + index + 1 }}
            </td>
            <td class="px-4 py-2 whitespace-nowrap text-center">
              {{ transaction.product.name }}
            </td>
            <td class="px-4 py-2 whitespace-nowrap text-center">
              {{ transaction.quantity }}
            </td>
            <td class="px-4 py-2 whitespace-nowrap text-center">
              {{ transaction.product.price }}
            </td>
            <td class="px-4 py-2 whitespace-nowrap text-center">
              {{ formatDate(transaction.createdAt) }}
            </td>
            <td class="px-4 py-2 whitespace-nowrap text-center">
              {{ transaction.product.stock }}
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

    <AddOutTransactionModal
      v-if="showModal"
      @close="closeModal"
      :showModal="showModal"
    />
  </div>
</template>

<script>
import axios from "axios";
import html2pdf from "html2pdf.js";
import AddOutTransactionModal from "./AddOutTransactionModal.vue";

export default {
  components: {
    AddOutTransactionModal,
  },
  data() {
    return {
      transactions: [],
      startDate: "",
      endDate: "",
      showModal: false,
      currentPage: 1,
      pageSize: 50,
      totalTransactions: 0,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalTransactions / this.pageSize);
    },
  },
  methods: {
    formatDate(dateString) {
      const options = { day: "2-digit", month: "2-digit", year: "2-digit" };
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-GB", options).format(date);
    },
    getTokenFromCookie() {
      const cookieString = document.cookie;
      const tokenMatch = cookieString.match(/token=([^;]+)/);
      return tokenMatch ? tokenMatch[1] : null;
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async fetchTransactions(page = 1) {
      try {
        const token = this.getTokenFromCookie();
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const params = {
          transactionType_id: 2,
          startDate: this.startDate,
          endDate: this.endDate,
          page: page,
          pageSize: this.pageSize,
        };

        const response = await axios.get(
          "http://localhost:5000/api/transaction",
          {
            headers,
            params,
          }
        );

        this.transactions = response.data.data.transaction;
        this.totalTransactions = response.data.data.totalTransactions;
        this.currentPage = page;
      } catch (error) {
        console.error("Error fetching outgoing transactions:", error);
      }
    },
    async nextPage() {
      if (this.currentPage < this.totalPages) {
        await this.fetchTransactions(this.currentPage + 1);
      }
    },
    async prevPage() {
      if (this.currentPage > 1) {
        await this.fetchTransactions(this.currentPage - 1);
      }
    },
    async downloadPDF() {
      const titleElement = document.querySelector(".pdf-title");

      titleElement.style.display = "block";
      titleElement.style.textAlign = "center";
      titleElement.style.fontSize = "32px";
      titleElement.style.fontWeight = "bold";
      titleElement.style.marginBottom = "20px";

      const element = document.getElementById("pdf-content");
      const options = {
        margin: 1,
        filename: "incoming_transactions.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      await html2pdf().from(element).set(options).save();

      titleElement.style.display = "none";
      titleElement.style.textAlign = "";
      titleElement.style.fontSize = "";
      titleElement.style.fontWeight = "";
      titleElement.style.marginBottom = "";
    },
  },
  async mounted() {
    await this.fetchTransactions();
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

th {
  background-color: #f9fafb;
}

.pdf-title {
  display: none;
}

@media print {
  .pdf-title {
    display: block;
    text-align: center;
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 30px;
  }
}
</style>
