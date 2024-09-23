<template>
  <div
    v-if="showModal"
    class="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white rounded-lg p-6 shadow-xl max-w-lg w-full">
      <h3 class="text-lg font-semibold mb-4">Add New User</h3>
      <form @submit.prevent="addUser">
        <div class="mb-4">
          <label class="block text-gray-700">Username:</label>
          <input
            type="text"
            v-model="newUser.Username"
            class="border rounded w-full p-2"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Email:</label>
          <input
            type="text"
            v-model="newUser.Email"
            class="border rounded w-full p-2"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Password:</label>
          <input
            type="password"
            v-model="newUser.Password"
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
  },
  data() {
    return {
      newUser: {
        Username: "",
        Email: "",
        Password: "",
      },
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    async addUser() {
      try {
        const token = this.getTokenFromCookie();
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const userData = {
          username: this.newUser.Username,
          email: this.newUser.Email,
          password: this.newUser.Password,
        };

        await axios.post("http://localhost:5000/api/User/register", userData, {
          headers,
        });
        this.$emit("User-added");
        this.closeModal();
      } catch (error) {
        console.error(
          "Error adding User:",
          error.response ? error.response.data : error.message
        );
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
