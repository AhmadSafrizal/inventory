<template>
  <div
    v-if="showModal"
    class="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white rounded-lg p-6 shadow-xl max-w-lg w-full">
      <h3 class="text-lg font-semibold mb-4">Edit Category</h3>
      <form @submit.prevent="updateCategory">
        <div class="mb-4">
          <label class="block text-gray-700">Name:</label>
          <input
            type="text"
            v-model="localCategory.category_name"
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
import { ref, watch } from "vue";
import axios from "axios";

export default {
  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
    category: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const localCategory = ref({ ...props.category });

    watch(
      () => props.category,
      (newVal) => {
        localCategory.value = { ...newVal };
      }
    );

    const closeModal = () => {
      emit("close");
    };

    const updateCategory = async () => {
      try {
        const token = getTokenFromCookie();
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        await axios.put(
          `http://localhost:5000/api/category/${localCategory.value.id}`,
          localCategory.value,
          { headers }
        );

        emit("category-updated");
        closeModal();
      } catch (error) {
        console.error("Error updating category:", error);
      }
    };

    const getTokenFromCookie = () => {
      const cookieString = document.cookie;
      const tokenMatch = cookieString.match(/token=([^;]+)/);
      return tokenMatch ? tokenMatch[1] : null;
    };

    return {
      localCategory,
      closeModal,
      updateCategory,
    };
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
