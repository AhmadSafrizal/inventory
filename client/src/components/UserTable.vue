<template>
  <div
    class="mt-10 overflow-hidden bg-white p-3 border-b border-gray-200 shadow sm:rounded-lg"
  >
    <h3 class="text-lg font-semibold mb-4">user List</h3>

    <div class="mb-4">
      <label for="searchQuery" class="mr-2">Search by Name:</label>
      <input
        type="text"
        id="searchQuery"
        v-model="searchQuery"
        class="border rounded p-1"
        placeholder="Enter user name"
      />
      <button
        @click="fetchUsers"
        class="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Search
      </button>
      <button
        @click="openModal"
        class="ml-4 bg-yellow-500 text-white px-4 py-2 rounded"
      >
        Add user
      </button>
    </div>

    <div class="overflow-x-auto" id="pdf-content">
      <table class="min-w-full">
        <thead>
          <tr>
            <th class="px-4 py-2 whitespace-nowrap text-center">No</th>
            <th class="px-4 py-2 whitespace-nowrap text-center">Username</th>
            <th class="px-4 py-2 whitespace-nowrap text-center">Email</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in Users" :key="user.id">
            <td class="px-4 py-2 whitespace-nowrap text-center">
              {{ index + 1 }}
            </td>
            <td class="px-4 py-2 whitespace-nowrap text-center">
              {{ user.username }}
            </td>
            <td class="px-4 py-2 whitespace-nowrap text-center">
              {{ user.email }}
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

    <AdduserModal
      :showModal="showModal"
      :Users="Users"
      @close="closeModal"
      @user-added="fetchUsers"
    />
  </div>
</template>

<script>
import axios from "axios";
import AdduserModal from "./AddUserModal.vue";

export default {
  components: {
    AdduserModal,
  },
  data() {
    return {
      Users: [],
      searchQuery: "",
      showModal: false,
      currentuser: {},
      currentPage: 1,
      pageSize: 50,
      totalUsers: 0,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalUsers / this.pageSize);
    },
  },
  methods: {
    getTokenFromCookie() {
      const cookieString = document.cookie;
      const tokenMatch = cookieString.match(/token=([^;]+)/);
      return tokenMatch ? tokenMatch[1] : null;
    },
    async fetchUsers(page = 1) {
      try {
        const token = this.getTokenFromCookie();
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const params = {
          user_name: this.searchQuery,
          page: page,
          pageSize: this.pageSize,
        };

        const response = await axios.get("http://localhost:5000/api/user", {
          headers,
          params,
        });

        console.log(response.data);

        this.Users = response.data.data;
        this.totalUsers = response.data.data.totalUsers;
        this.currentPage = page;
      } catch (error) {
        console.error("Error fetching Users:", error);
      }
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async nextPage() {
      if (this.currentPage < this.totalPages) {
        await this.fetchUsers(this.currentPage + 1);
      }
    },
    async prevPage() {
      if (this.currentPage > 1) {
        await this.fetchUsers(this.currentPage - 1);
      }
    },
  },
  async mounted() {
    await this.fetchUsers();
  },
};
</script>
