<template>
  <div>
    <Breadcrumb breadcrumb="" />
    <div class="mt-4">
      <ProductTable />
    </div>
  </div>
</template>

<script>
import Breadcrumb from "../components/AppBreadcrumb.vue";
import ProductTable from "../components/ProductTable.vue";

export default {
  components: {
    Breadcrumb,
    ProductTable,
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
