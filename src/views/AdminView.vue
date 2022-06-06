<template>
  <div>
    <div class="container">
      <admin />
    </div>
  </div>
</template>

<script>
import AdminComponent from "@/components/AdminComponent.vue";
const AdminView = {
  components: {
    admin: AdminComponent,
  },
};
export default AdminView;
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}
</style>