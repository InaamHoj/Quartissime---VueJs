<template>
  <div>
    {{ idComiteRiverain }}
    <h2>{{ titre }}</h2>
    <form @submit.prevent="submitForm" class="formulaire">
      <label for="nom">Nom</label>
      <input
        type="text"
        class="nom"
        v-model="user.nom"
        @blur="v$.user.nom.$touch"
      />
      <div v-if="v$.user.nom.$error">
        {{ this.v$.user.nom.required.$message }}
      </div>

      <label for="prenom">Prénom</label>
      <input
        type="text"
        class="prenom"
        v-model="user.prenom"
        @blur="v$.user.prenom.$touch"
      />
      <div v-if="v$.user.prenom.$error">
        {{ this.v$.user.prenom.required.$message }}
      </div>

      <label for="email">Email</label>
      <input
        type="email"
        class="email"
        v-model="user.email"
        @blur="v$.user.email.$touch"
      />
      <div v-if="v$.user.email.$error">
        {{ this.v$.user.email.email.$message }}
      </div>

      <label for="adresse">Addresse postal (optionnel)</label>
      <input type="text" class="addrese" v-model="user.adresse" />

      <button>Valider</button>
      <p @click="showAssoc">Si vous êtes une association</p>
    </form>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";
const RiverainComponent = {
  props: {
    titre: String,
    showAssoc: Function,
    idComiteRiverain: Number,
  },
  data() {
    return {
      user: {
        adresse: "",
        email: "",
        prenom: "",
        nom: "",
        id: "",
      },
    };
  },
  setup() {
    return { v$: useVuelidate() };
  },
  validations() {
    return {
      user: {
        nom: { required: helpers.withMessage("Nom requis", required) },
        prenom: { required: helpers.withMessage("Prénom requis", required) },
        email: {
          required,
          email: helpers.withMessage("Email incorrect", email, required),
        },
      },
    };
  },
  methods: {
    submitForm() {
      this.user.id = parseInt(this.idComiteRiverain);
      this.v$.$touch();
      !this.v$.user.nom.$error &&
      !this.v$.user.prenom.$error &&
      !this.v$.user.email.$error
        ? this.envoieInscription()
        : console.log("false");
    },
    async envoieInscription() {
      const promise = await fetch("http://127.0.0.1:8000/api/riverain", {
        method: "POST",
        body: JSON.stringify(this.user),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(promise);
      let res = await promise.json();
      console.log(res);
    },
  },
};

export default RiverainComponent;
</script>
<style scoped>
.formulaire {
  display: flex;
  flex-direction: column;
}
</style>