<template>
  <div class="bigContainer">
    <h1>Dashboard Admin</h1>
    <header class="navBar">
      <section>
        <nav class="dash">
          <ul>
            <li @click="this.show = 'a'">creation admin</li>
            <li @click="this.show = 'b'">consultation / edit admin</li>
            <li @click="this.show = 'c'">creation comité quartier</li>
            <li @click="this.show = 'd'">consultation /edit comité quartier</li>
            <li @click="this.show = 'e'">
              consultation / edit user comité quartier
            </li>
            <li @click="this.show = 'f'">consulation /edit association</li>
          </ul>
        </nav>
      </section>
    </header>

    <div class="container">
      <div v-if="show == ''">
        <h1>Petit presententation</h1>
      </div>
      <creationAdmin v-else-if="show == 'a'" :recharge="affichageAdmin" />

      <editShowAdmin
        v-else-if="show == 'b'"
        :info="admins"
        :recharge="affichageAdmin"
      />
      <creationComite v-else-if="show == 'c'" :recharge="affichageComite" />

      <editShowComite
        v-else-if="show == 'd'"
        :recharge="affichageComite"
        :data="comite"
      />
      <editShowUserComite
        v-else-if="show == 'e'"
        :recharge="affichageComite"
        :info="userComite"
      />
      <editShowAssoc
        v-else-if="show == 'f'"
        :info="assoc"
        :recharge="affichageAssoc"
      />
    </div>
  </div>
</template>

<script>
import CreationAdminComponent from "@/components/CreationAdminComponent.vue";
import CreationComiteComponent from "@/components/CreationComiteComponent.vue";
import EditShowAdminComponent from "@/components/EditShowAdminComponent.vue";
import EditShowComiteComponent from "@/components/EditShowComiteComponent.vue";
import EditShowDeleteAssocComponent from "@/components/EditShowDeleteAssocComponent.vue";
import EditShowDeleteUserComiteComponent from "@/components/EditShowDeletUserComiteComponent.vue";

const DashboardView = {
  components: {
    creationAdmin: CreationAdminComponent,
    editShowAdmin: EditShowAdminComponent,
    creationComite: CreationComiteComponent,
    editShowComite: EditShowComiteComponent,
    editShowUserComite: EditShowDeleteUserComiteComponent,
    editShowAssoc: EditShowDeleteAssocComponent,
  },
  data() {
    return {
      show: "",
      admins: "",
      comite: "",
      userComite: "",
      assoc: "",
    };
  },
  mounted() {
    this.affichageAdmin();
    this.affichageComite();
    this.affichageAssoc();
  },
  methods: {
    async affichageAdmin() {
      try {
        const promise = await fetch("http://127.0.0.1:8000/api/showAdmin", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("admin_token"),
          },
        });
        console.log(promise);
        if (promise.status == 200) {
          let res = await promise.json();
          this.admins = res.admin;
          console.log(this.admins, "admins");
        } else {
          this.$router.push("/");
        }
      } catch (error) {
        console.log(error);
      }
    },
    async affichageComite() {
      try {
        const promise = await fetch("http://127.0.0.1:8000/api/showComite", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("admin_token"),
          },
        });
        console.log(promise);
        if (promise.status == 200) {
          let res = await promise.json();
          console.log(res, "comite");
          this.comite = res.comite;
          this.userComite = res.comiteUser;
        } else {
          this.$router.push("/");
        }
      } catch (error) {
        console.log(error);
      }
    },

    async affichageAssoc() {
      try {
        const promise = await fetch("http://127.0.0.1:8000/api/showAssoc", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("admin_token"),
          },
        });
        console.log(promise);
        if (promise.status == 200) {
          let res = await promise.json();
          this.assoc = res.association;
          console.log(this.assoc, "association ");
        } else {
          this.$router.push("/");
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
export default DashboardView;
</script>

<style scoped>
h1 {
  grid-area: header;
}
.container {
  display: flex;
  justify-content: center;
  grid-area: contenu;
}
.bigContainer {
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-template-rows: 1fr 4fr 1fr;
  grid-template-areas:
    "header header"
    "dash contenu"
    "footer footer";
}
.dash {
  grid-area: dash;
  background-color: red;
}
</style>