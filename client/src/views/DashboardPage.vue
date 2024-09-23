<template>
  <div>
    <Breadcrumb breadcrumb="" />
    <div class="mt-4">
      <div class="flex flex-wrap -mx-6">
        <div class="w-full px-6 sm:w-1/2 xl:w-1/3">
          <div
            class="flex items-center px-5 py-6 bg-white rounded-md shadow-sm"
          >
            <div class="p-3 bg-indigo-600 bg-opacity-75 rounded-full">
              <svg
                class="w-8 h-8 text-white"
                viewBox="0 0 28 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.2 9.08889C18.2 11.5373 16.3196 13.5222 14 13.5222C11.6804 13.5222 9.79999 11.5373 9.79999 9.08889C9.79999 6.64043 11.6804 4.65556 14 4.65556C16.3196 4.65556 18.2 6.64043 18.2 9.08889Z"
                  fill="currentColor"
                />
                <path
                  d="M25.2 12.0444C25.2 13.6768 23.9464 15 22.4 15C20.8536 15 19.6 13.6768 19.6 12.0444C19.6 10.4121 20.8536 9.08889 22.4 9.08889C23.9464 9.08889 25.2 10.4121 25.2 12.0444Z"
                  fill="currentColor"
                />
                <path
                  d="M19.6 22.3889C19.6 19.1243 17.0927 16.4778 14 16.4778C10.9072 16.4778 8.39999 19.1243 8.39999 22.3889V26.8222H19.6V22.3889Z"
                  fill="currentColor"
                />
                <path
                  d="M8.39999 12.0444C8.39999 13.6768 7.14639 15 5.59999 15C4.05359 15 2.79999 13.6768 2.79999 12.0444C2.79999 10.4121 4.05359 9.08889 5.59999 9.08889C7.14639 9.08889 8.39999 10.4121 8.39999 12.0444Z"
                  fill="currentColor"
                />
                <path
                  d="M22.4 26.8222V22.3889C22.4 20.8312 22.0195 19.3671 21.351 18.0949C21.6863 18.0039 22.0378 17.9556 22.4 17.9556C24.7197 17.9556 26.6 19.9404 26.6 22.3889V26.8222H22.4Z"
                  fill="currentColor"
                />
                <path
                  d="M6.64896 18.0949C5.98058 19.3671 5.59999 20.8312 5.59999 22.3889V26.8222H1.39999V22.3889C1.39999 19.9404 3.2804 17.9556 5.59999 17.9556C5.96219 17.9556 6.31367 18.0039 6.64896 18.0949Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div class="mx-5">
              <h4 class="text-2xl font-semibold text-gray-700">
                {{ userCount }}
              </h4>
              <div class="text-gray-500">Users</div>
            </div>
          </div>
        </div>

        <div class="w-full px-6 mt-6 sm:w-1/2 xl:w-1/3 xl:mt-0">
          <div
            class="flex items-center px-5 py-6 bg-white rounded-md shadow-sm"
          >
            <div class="p-3 bg-pink-600 bg-opacity-75 rounded-full">
              <svg
                class="w-8 h-8 text-white"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.99998 11.2H21L22.4 23.8H5.59998L6.99998 11.2Z"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
                <path
                  d="M9.79999 8.4C9.79999 6.08041 11.6804 4.2 14 4.2C16.3196 4.2 18.2 6.08041 18.2 8.4C18.2 10.7196 16.3196 12.6 14 12.6C11.6804 12.6 9.79999 10.7196 9.79999 8.4Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div class="mx-5">
              <h4 class="text-2xl font-semibold text-gray-700">
                {{ productCount }}
              </h4>
              <div class="text-gray-500">Products</div>
            </div>
          </div>
        </div>

        <div class="w-full px-6 mt-6 sm:w-1/2 xl:w-1/3 sm:mt-0">
          <div
            class="flex items-center px-5 py-6 bg-white rounded-md shadow-sm"
          >
            <div class="p-3 bg-blue-600 bg-opacity-75 rounded-full">
              <svg
                class="w-8 h-8 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 3h18v18H3V3zm4 2v4h2V5H7zm0 6v4h2v-4H7zm4-6v4h2V5h-2zm0 6v4h2v-4h-2zm4-6v4h2V5h-2zm0 6v4h2v-4h-2z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div class="mx-5">
              <h4 class="text-2xl font-semibold text-gray-700">
                {{ categoryCount }}
              </h4>
              <div class="text-gray-500">Categories</div>
            </div>
          </div>
        </div>
      </div>
      <IncomingTable />

      <OutgoingTable />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Breadcrumb from "../components/AppBreadcrumb.vue";
import axios from "axios";
import IncomingTable from "../components/IncomingTable.vue";
import OutgoingTable from "../components/OutgoingTable.vue";

export default {
  components: {
    Breadcrumb,
    IncomingTable,
    OutgoingTable,
  },
  setup() {
    const userCount = ref(0);
    const productCount = ref(0);
    const categoryCount = ref(0);
    const transactions = ref([]);

    const getTokenFromCookie = () => {
      const cookieString = document.cookie;
      const tokenMatch = cookieString.match(/token=([^;]+)/);
      return tokenMatch ? tokenMatch[1] : null;
    };

    const fetchData = async () => {
      const token = getTokenFromCookie();
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const [
          userResponse,
          productResponse,
          categoryResponse,
          transactionResponses,
        ] = await Promise.all([
          axios.get("http://localhost:5000/api/user", { headers }),
          axios.get("http://localhost:5000/api/product", { headers }),
          axios.get("http://localhost:5000/api/category", { headers }),
          axios.all([
            axios.get(
              "http://localhost:5000/api/transaction?transactionType_id=1",
              { headers }
            ),
            axios.get(
              "http://localhost:5000/api/transaction?transactionType_id=2",
              { headers }
            ),
          ]),
        ]);

        // Set user, product, and category counts
        userCount.value = userResponse.data.data.length;
        productCount.value = productResponse.data.data.products.length;
        categoryCount.value = categoryResponse.data.data.categories.length;

        // Access transaction arrays from API responses
        const incomingTransactions =
          transactionResponses[0].data.data.transaction;
        const outgoingTransactions =
          transactionResponses[1].data.data.transaction;

        // Debugging log
        // console.log(
        //   "Transaction Response 0 Data:",
        //   transactionResponses[0].data
        // );
        // console.log(
        //   "Transaction Response 1 Data:",
        //   transactionResponses[1].data
        // );

        // console.log("User Res: ", userResponse.data);
        // console.log("User Count: ", userCount.value);
        // console.log("Product Res: ", productResponse.data);
        // console.log("Product Count: ", productCount.value);
        // console.log("Category Res: ", categoryResponse.data);
        // console.log("Category Count: ", categoryCount.value);

        console.log("incoming : ", incomingTransactions);

        // Ensure both incomingTransactions and outgoingTransactions are arrays
        if (
          Array.isArray(incomingTransactions) &&
          Array.isArray(outgoingTransactions)
        ) {
          transactions.value = [
            ...incomingTransactions,
            ...outgoingTransactions,
          ];
        } else {
          console.error("Expected an array for transactions.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    onMounted(fetchData);

    return {
      userCount,
      productCount,
      categoryCount,
      transactions,
    };
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
