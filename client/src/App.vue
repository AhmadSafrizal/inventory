<template>
  <div>
    <Header :isOpen="isSidebarOpen" @toggle-sidebar="toggleSidebar" />
    <Sidebar :isOpen="isSidebarOpen" @toggle-sidebar="toggleSidebar" />
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
import { computed } from "vue";
import { useRouter } from "vue-router";

export default {
  data() {
    return {
      isSidebarOpen: false,
    };
  },
  setup() {
    const defaultLayout = "default";
    const { currentRoute } = useRouter();

    const layout = computed(() => {
      return `${currentRoute.value.meta.layout || defaultLayout}-layout`;
    });

    return { layout };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
  },
};
</script>

<style scoped>
/* Custom styles for better responsiveness */
@media (max-width: 1024px) {
  .lg\:translate-x-0 {
    transform: none !important;
  }
  .lg\:static {
    position: static !important;
  }
  .lg\:inset-0 {
    top: auto !important;
    left: auto !important;
    bottom: auto !important;
    right: auto !important;
  }
}
</style>
