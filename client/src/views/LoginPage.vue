<template>
  <div class="flex items-center justify-center h-screen px-6 bg-gray-200">
    <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-center">
        <svg
          class="w-8 h-8 ml-2 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 3h18v18H3V3zm9 5h4m-4 4h4m-4 4h4"
          ></path>
        </svg>

        <span class="text-2xl font-semibold text-gray-700">Inventory</span>
      </div>

      <form class="mt-4" @submit.prevent="handleLogin">
        <label class="block">
          <span class="text-sm text-gray-700">Username</span>
          <input
            type="username"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
            v-model="username"
          />
        </label>

        <label class="block mt-3">
          <span class="text-sm text-gray-700">Password</span>
          <input
            type="password"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
            v-model="password"
          />
        </label>

        <div class="mt-6">
          <button
            type="submit"
            class="w-full px-4 py-2 text-sm text-center text-white bg-indigo-600 rounded-md focus:outline-none hover:bg-indigo-500"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "LoginPage",
  setup() {
    const username = ref("");
    const password = ref("");
    const router = useRouter();

    const shouldShowLayout = computed(() => {
      return router.currentRoute.value.meta.layout !== "none";
    });

    const handleLogin = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/user/login",
          {
            username: username.value,
            password: password.value,
          }
        );

        if (response.data.status === "success") {
          document.cookie = `token=${response.data.data}; path=/`;
          router.push("/dashboard");
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error(error);
        alert("Login failed. Please try again.");
      }
    };

    return {
      username,
      password,
      handleLogin,
      shouldShowLayout,
    };
  },
};
</script>

<style scoped></style>
