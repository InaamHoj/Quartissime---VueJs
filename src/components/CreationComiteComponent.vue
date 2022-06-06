<template>
  <div>
    <h1>Creation comite de quartier</h1>
    <div>
      <form class="container" @submit.prevent="submitForm">
        <div class="container1">
          <div class="aligne">
            <label for="indentifiant">identifiant</label>
            <input
              type="text"
              v-model="user.identifiant"
              @blur="v$.user.identifiant.$touch"
            />
          </div>
          <div class="error" v-if="v$.user.identifiant.$error">
            {{
              this.nbrCharIndentifiant - this.user.identifiant.length > 0
                ? `il manque ${
                    this.nbrCharIndentifiant - this.user.identifiant.length
                  } lettres `
                : ""
            }}
          </div>

          <div class="aligne">
            <label for="password">password</label>
            <input
              type="text"
              v-model="user.password"
              @blur="v$.user.password.$touch"
            />
          </div>
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

          <div class="aligne">
            <label for="nom">Nom du comite</label>
            <input type="text" v-model="comite.nom" />
          </div>

          <div class="aligne">
            <label for="nomP">Nom du president</label>
            <input type="text" v-model="comite.nomP" />
          </div>

          <div class="aligne">
            <label for="prenomP">Prenom du president</label>
            <input type="text" v-model="comite.prenomP" />
          </div>

          <div class="aligne">
            <label for="photo"
              >Photos (optionnelle, maximum 10, 2Mo par photo)</label
            >
            <input
              type="file"
              ref="fileuplaod"
              multiple
              @change="file"
              accept="image/*"
              class="input-file"
            />
          </div>
        </div>
        <div class="container2">
          <div class="aligne">
            <label for="adresse">adresse</label>
            <input
              type="text"
              v-model="comite.adresse"
              @blur="v$.comite.adresse.$touch"
            />
          </div>
          <div v-if="v$.comite.adresse.$error">
            {{ this.v$.comite.adresse.$message }}
          </div>

          <div class="aligne">
            <label for="email">email</label>
            <input
              type="email"
              v-model="comite.email"
              @blur="v$.comite.email.$touch"
            />
          </div>
          <div v-if="v$.comite.email.$error">
            {{ this.v$.comite.email.email.$message }}
          </div>
          <div class="aligne">
            <label for="telephone">telephone</label>
            <input type="text" v-model="comite.telephone" />
          </div>

          <div class="aligne">
            <label for="facebook">lien Facebook</label>
            <input type="text" v-model="comite.facebook" />
          </div>

          <div class="aligne">
            <label for="siteWeb">lien site Web</label>
            <input type="text" v-model="comite.site" />
          </div>

          <div class="aligne">
            <label for="descritpion">description</label>
            <textarea
              class="description"
              v-model="comite.description"
            ></textarea>
          </div>
          <button>Valider</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, email, helpers, minLength } from "@vuelidate/validators";
const CreationComiteComponent = {
  props: {
    recharge: Function,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      user: {
        identifiant: "",
        password: "",
      },
      comite: {
        nom: "",
        nomP: "",
        prenomP: "",
        adresse: "",
        email: "",
        telephone: "",
        facebook: "",
        site: "",
        description: "",
      },
      nbrCharIndentifiant: 6,
      nbrCharPassword: 8,
      verifMaj: /^(?=.*?[A-Z]).{1,}$/,
      verifNumber: /^(?=.*?[0-9]).{1,}$/,
      verifSpecial: /^(?=.*?[#?!§€/¤£@$<>%^&*§¤:;,-]).{1,}$/,
      image: null,
    };
  },
  validations() {
    return {
      user: {
        identifiant: {
          required,
          minLength: minLength(6),
        },
        password: {
          required,
          checkPassword: helpers.regex(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!§€/¤£@$<>%^&*§¤:;,-]).{8,}$/
          ),
        },
      },
      comite: {
        adresse: {
          required,
          minLength: helpers.withMessage(
            "adresse requis",
            required,
            minLength(1)
          ),
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
      console.log(this.v$.user.identifiant.$error, "errrrrrrrrrrrrrr");
      this.recupCoords();
    },
    file(e) {
      this.image = e.target.files;
    },
    async recupCoords() {
      try {
        const response = await fetch(
          "https://api-adresse.data.gouv.fr/search/?q=" + this.comite.adresse
        );

        const data = await response.json();

        if (data) {
          let longitude = data.features?.[0].geometry.coordinates[0];
          let latitude = data.features?.[0].geometry.coordinates[1];
          this.envoieInscription(longitude, latitude);
        }
      } catch (e) {
        console.log(e);
      }
    },
    async envoieInscription(longitude, latitude) {
      let fd = new FormData();
      if (this.image != null) {
        for (let index = 0; index < this.image.length; index++) {
          fd.append("images[" + index + "]", this.image[index]);
        }
      }
      fd.append("latitude", latitude);
      fd.append("longitude", longitude);
      fd.append("identifiant", this.user.identifiant);
      fd.append("password", this.user.password);
      fd.append("nom", this.comite.nom);
      fd.append("nomP", this.comite.nomP);
      fd.append("prenomP", this.comite.prenomP);
      fd.append("adresse", this.comite.adresse);
      fd.append("email", this.comite.email);
      fd.append("telephone", this.comite.telephone);
      fd.append("facebook", this.comite.facebook);
      fd.append("site", this.comite.site);
      fd.append("description", this.comite.description);

      const promise = await fetch(
        "http://127.0.0.1:8000/api/inscriptionComite",
        {
          method: "POST",
          body: fd,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("admin_token"),
          },
        }
      );

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
export default CreationComiteComponent;
</script>

<style scoped>
.container {
  display: flex;
}

.aligne {
  display: flex;
  flex-direction: column;
}
</style>