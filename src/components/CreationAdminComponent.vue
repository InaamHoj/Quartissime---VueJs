<template>
  <div>
    <h1>Creation admin</h1>
    <form class="container" @submit.prevent="inscription">
      <label for="email">Email</label>
      <input type="email" v-model="user.email" @blur="v$.user.email.$touch" />
      <div v-if="v$.user.email.$error">
        {{ this.v$.user.email.email.$message }}
      </div>

      <label for="password">Password</label>
      <input
        type="text"
        v-model="user.password"
        @blur="v$.user.password.$touch"
      />
      <div class="error" v-if="v$.user.password.$error">
        {{
          this.nbrCharPassword - this.user.password.length > 0
            ? `il manque ${
                this.nbrCharPassword - this.user.password.length
              } lettres`
            : ""
        }}

        {{
          this.verifMaj.test(this.user.password)
            ? ""
            : "1 majuscule obligatoire"
        }}
        {{
          this.verifNumber.test(this.user.password)
            ? ""
            : "1 chiffre obligatoire"
        }}
        {{
          this.verifSpecial.test(this.user.password)
            ? ""
            : "1 caractere spécial obligatoire"
        }}
      </div>

      <label for="verifPassword">Verification</label>
      <input
        type="text"
        v-model="user.password_confirmation"
        @blur="v$.user.password_confirmation.$touch"
      />
      <div class="error" v-if="v$.user.password_confirmation.$error">
        {{ this.v$.user.password_confirmation.sameAsPassword.$message }}
      </div>
      <button>valider</button>
    </form>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, sameAs, helpers, email } from "@vuelidate/validators";
const CreationAdminComponent = {
  props: {
    recharge: Function,
  },
  data() {
    return {
      user: {
        // compte: "",
        email: "",
        password: "",
        password_confirmation: "",
      },
      nbrCharIndentifiant: 6,
      nbrCharPassword: 8,
      verifMaj: /^(?=.*?[A-Z]).{1,}$/,
      verifNumber: /^(?=.*?[0-9]).{1,}$/,
      verifSpecial: /^(?=.*?[#?!§€/¤£@$<>%^&*§¤:;,-]).{1,}$/,
    };
  },
  setup() {
    return { v$: useVuelidate() };
  },
  validations() {
    return {
      user: {
        email: {
          required,
          email: helpers.withMessage("Email incorrect", email, required),
        },
        password: {
          required,
          checkPassword: helpers.regex(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!§€/¤£@$<>%^&*§¤:;,-]).{8,}$/
          ),
        },
        password_confirmation: {
          sameAsPassword: helpers.withMessage(
            "le mot de passe est différent",
            sameAs(this.user.password)
          ),
        },
      },
    };
  },
  methods: {
    inscription() {
      this.v$.$touch();
      // !this.v$.user.compte.$error &&
      !this.v$.user.email.$error &&
      !this.v$.user.password.$error &&
      !this.v$.user.password_confirmation.$error
        ? this.envoieInscription()
        : console.log("false");
    },
    async envoieInscription() {
      const promise = await fetch("http://127.0.0.1:8000/api/registerAdmin", {
        method: "POST",
        body: JSON.stringify(this.user),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("admin_token"),
        },
      });
      console.log(promise);
      let res = await promise.json();
      console.log(res);
      if (promise.status === 200) {
        this.recharge();
      } else {
        console.log("c'est pas good");
      }
    },
  },
};
export default CreationAdminComponent;
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
</style>