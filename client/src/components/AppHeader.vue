<template>
  <header
    class="flex items-center justify-between px-6 py-2 bg-white border-b-4 border-indigo-600"
  >
    <div class="flex-grow">
      <button
        @click="toggleSidebar"
        class="p-2 rounded-lg hover:bg-gray-200 focus:outline-none"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>
    </div>
    <div class="relative">
      <button
        @click="dropdownOpen = !dropdownOpen"
        class="relative z-10 block w-8 h-8 overflow-hidden rounded-full shadow focus:outline-none"
      >
        <img
          class="object-cover w-full h-full"
          src="../../public/avatar.jpeg"
          alt="Your avatar"
        />
      </button>

      <div
        v-show="dropdownOpen"
        @click="dropdownOpen = false"
        class="fixed inset-0 z-10 w-full h-full"
      ></div>

      <transition
        enter-active-class="transition duration-150 ease-out transform"
        enter-from-class="scale-95 opacity-0"
        enter-to-class="scale-100 opacity-100"
        leave-active-class="transition duration-150 ease-in transform"
        leave-from-class="scale-100 opacity-100"
        leave-to-class="scale-95 opacity-0"
      >
        <div
          v-show="dropdownOpen"
          class="absolute right-0 z-20 w-48 py-1 mt-2 bg-white rounded-lg shadow-xl"
        >
          <router-link
            to="/"
            @click="logout"
            class="flex px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-indigo-600 hover:text-white"
          >
            Log out
          </router-link>
        </div>
      </transition>
    </div>
  </header>
</template>

<script>
import Cookies from "js-cookie";

export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      dropdownOpen: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.$emit("toggle-sidebar");
    },
    logout() {
      Cookies.remove("token");
      this.$router.push("/");
    },
  },
};
</script>

<style scoped></style>
