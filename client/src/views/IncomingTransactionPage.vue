<template>
  <div>
    <Breadcrumb breadcrumb="" />
    <div class="mt-4">
      <IncomingTable />
    </div>
  </div>
</template>

<script>
import Breadcrumb from "../components/AppBreadcrumb.vue";
import IncomingTable from "../components/IncomingTable.vue";

export default {
  components: {
    Breadcrumb,
    IncomingTable,
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
