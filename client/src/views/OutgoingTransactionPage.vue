<template>
  <div>
    <Breadcrumb breadcrumb="" />
    <div class="mt-4">
      <OutgoingTable />
    </div>
  </div>
</template>

<script>
import Breadcrumb from "../components/AppBreadcrumb.vue";
import OutgoingTable from "../components/OutgoingTable.vue";

export default {
  components: {
    Breadcrumb,
    OutgoingTable,
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
