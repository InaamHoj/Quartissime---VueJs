<template>
  <div>
    <h1>Connexion</h1>
    <form class="formulaire" @submit.prevent="submitForm">
      <label for="email">email</label>
      <input type="email" v-model="admin.email" @blur="v$.admin.email.$touch" />
      <div v-if="v$.admin.email.$error">
        {{ this.v$.admin.email.email.$message }}
      </div>

      <label for="password">password</label>
      <input
        type="password"
        v-model="admin.password"
        @blur="v$.admin.password.$touch"
      />
      <div v-if="v$.admin.password.$error">
        {{ this.v$.admin.password.required.$message }}
      </div>
      <button>valider</button>
    </form>
    <p>{{ res.message }}</p>
  </div>
</template>

<script>
// import store from "@/store";
import useVuelidate from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";
const AdminComponent = {
  data() {
    return {
      admin: {
        email: "",
        password: "",
      },
      res: "",
    };
  },
  setup() {
    return { v$: useVuelidate() };
  },
  validations() {
    return {
      admin: {
        password: {
          required: helpers.withMessage("Password requis", required),
        },
        email: {
          required,
          email: helpers.withMessage("Email incorrect", email, required),
        },
      },
    };
  },
  methods: {
    submitForm() {
      this.v$.$touch();
      !this.v$.admin.password.$error && !this.v$.admin.email.$error
        ? this.connexion()
        : console.log("false");
    },
    async connexion() {
      const promise = await fetch("http://127.0.0.1:8000/api/connexionAdmin", {
        method: "POST",
        body: JSON.stringify(this.admin),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(promise);
      this.res = await promise.json();
      console.log(this.res);
      if (promise.status === 200) {
        // store.state.admin.token = this.res.token;
        localStorage.setItem("admin_token", this.res.token);
        this.$router.push("/dashboard");
      }
    },
  },
};
export default AdminComponent;
</script>

<style scoped>
.formulaire {
  display: flex;
  flex-direction: column;
}
</style>