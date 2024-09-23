<template>
  <div>
    <Breadcrumb breadcrumb="" />
    <div class="mt-4">
      <CategoryTable />
    </div>
  </div>
</template>

<script>
import Breadcrumb from "../components/AppBreadcrumb.vue";
import CategoryTable from "../components/CategoryTable.vue";

export default {
  components: {
    Breadcrumb,
    CategoryTable,
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
