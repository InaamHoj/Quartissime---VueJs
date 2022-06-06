<template>
  <div>
    <h2>{{ titre }}</h2>
    {{ user.latitude }}
    <form
      class="formulaire"
      @submit.prevent="submitForm"
      enctype="multipart/form-data"
    >
      <label for="nomAssoc">Nom Association</label>
      <input type="text" class="nomAssoc" v-model="user.nomAssoc" />

      <label for="adresse">Adresse</label>
      <input type="text" class="adresse" v-model="user.adresse" />

      <label for="status">Veuillez écrire publique ou prive</label>
      <input type="text" class="status" v-model="user.status" />

      <label for="email">Email</label>
      <input type="email" class="email" v-model="user.email" />

      <label for="telephone">Numéro de téléphone (optionnel)</label>
      <input
        type="text"
        class="telephone"
        maxlength="10"
        minlength="10"
        @input="phone"
        :value="tele"
      />

      <label for="description">Description</label>
      <textarea class="description" v-model="user.description"></textarea>
      <label for="photo">Photos (optionnelle, maximum 10, 2Mo par photo)</label>
      <input
        type="file"
        ref="fileuplaod"
        multiple
        @change="file"
        accept="image/*"
        class="input-file"
      />

      <label for="accord"
        >Une case à cocher (opt-in) doit être présente sur le formulaire pour
        recueillir le consentement éclairé de l’utilisateur pour la transmission
        des données au comité de quartier par email.</label
      >
      <input type="checkbox" class="accord" v-model="user.accord" />
      <button>Valider</button>

      <p @click="showRiverain">Si vous etes un riverain</p>
    </form>
  </div>
</template>

<script>
const AssocComponent = {
  props: {
    titre: String,
    showRiverain: Function,
    idComiteAssoc: Number,
  },
  data() {
    return {
      user: {
        nomAssoc: "",
        adresse: "",
        status: "",
        email: "",
        telephone: "",
        description: "",
        accord: false,
        id: "",
        latitude: "",
        longitude: "",
      },
      tele: "",
      image: null,
    };
  },
  methods: {
    submitForm() {
      console.log(this.image);
      console.log(this.user, "hey");
      let verif = this.verification();
      verif ? this.envoiAllData() : console.log("faux");
    },
    phone(e) {
      if (isNaN(e.target.value)) {
        e.target.value = this.tele;
        console.log("hey");
        return;
      }

      this.tele = e.target.value;
      this.user.telephone = this.tele;
    },
    uploadImage(e) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.user.previewImage = e.target.result;
      };
    },
    file(e) {
      // for (let index = 0; index < e.target.files.length; index++) {
      //   this.image.push(e.target.files[index]);
      // }
      this.image = e.target.files;
    },
    verification() {
      if (this.user.status == "prive") {
        return true;
      } else if (this.user.status == "publique") {
        return true;
      } else {
        return false;
      }
    },
    envoiAllData() {
      this.recupCoords();
    },
    async envoieInscription(longitude, latitude) {
      this.user.id = parseInt(this.idComiteAssoc);
      let fd = new FormData();
      if (this.image != null) {
        for (let index = 0; index < this.image.length; index++) {
          fd.append("images[" + index + "]", this.image[index]);
        }
      }

      // fd.append("images", this.image);
      fd.append("latitude", latitude);
      fd.append("longitude", longitude);
      fd.append("id", this.user.id);
      fd.append("nomAssoc", this.user.nomAssoc);
      fd.append("adresse", this.user.adresse);
      fd.append("status", this.user.status);
      fd.append("email", this.user.email);
      fd.append("telephone", this.user.telephone);
      fd.append("description", this.user.description);
      fd.append("accord", this.user.accord);

      const promise = await fetch("http://127.0.0.1:8000/api/assoc", {
        method: "POST",
        body: fd,
      });

      console.log(promise);
      let res = await promise.json();
      console.log(res);
    },
    async recupCoords() {
      try {
        const response = await fetch(
          "https://api-adresse.data.gouv.fr/search/?q=" + this.user.adresse
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
  },
};
export default AssocComponent;
</script>

<style scoped>
.formulaire {
  display: flex;
  flex-direction: column;
}
</style>