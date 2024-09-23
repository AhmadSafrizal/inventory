<template>
  <div>
    <Breadcrumb breadcrumb="" />
    <div class="mt-4">
      <UserTable />
    </div>
  </div>
</template>

<script>
import Breadcrumb from "../components/AppBreadcrumb.vue";
import UserTable from "../components/UserTable.vue";

export default {
  components: {
    Breadcrumb,
    UserTable,
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
