<template>
  <div>
    <h1>Edit Comite/consultation</h1>

    <div class="miniContainer">
      <p @click="this.show = 'a'">Voir tout les comite</p>
      <label for="recherche">Recherche par nom de comite</label>
      <input type="text" v-model="recherche" />
      <button @click="search">valider</button>
    </div>

    <div v-if="show == 'a'">
      <ul v-for="(element, index) in data" :key="index">
        <div v-show="visible[index]">
          <li>Nom du comite : {{ element.comiteName }}</li>
          <li>Nom du president : {{ element.lastnamePresident }}</li>
          <li>Prenom du president : {{ element.firstnamePresident }}</li>
          <li>Adresse : {{ element.adress }}</li>
          <li>Email : {{ element.email }}</li>
          <li>Telephone : {{ element.phone }}</li>
          <li>Site : {{ element.webSite }}</li>
          <li>Facebook : {{ element.facebookLink }}</li>
          <li>Description : {{ element.description }}</li>
          <button @click="this.visible[index] = !this.visible[index]">
            editer
          </button>
          <button @click="deleteData(index)">supprimer</button>
        </div>
        <div v-show="!visible[index]" class="containerShow">
          <label for="nom">Nom comite</label>
          <input type="text" v-model="user.nom[index]" />

          <label for="nomP">Nom president</label>
          <input type="text" v-model="user.nomP[index]" />

          <label for="prenomP">Prenom president</label>
          <input type="text" v-model="user.prenomP[index]" />

          <label for="adresse">Adresse</label>
          <input type="text" v-model="user.adresse[index]" />

          <label for="email">Email</label>
          <input type="text" v-model="user.email[index]" />

          <label for="telephone">Telephone</label>
          <input type="text" v-model="user.telephone[index]" />

          <label for="site">Site</label>
          <input type="text" v-model="user.site[index]" />

          <label for="facebook">Facebok</label>
          <input type="text" v-model="user.facebook[index]" />

          <label for="descrption">Description</label>
          <textarea v-model="user.description[index]" />

          <input type="hidden" v-model="user.idi[index]" />
          <button @click="recupData(index)">Valider</button>
        </div>
      </ul>
    </div>

    <div v-else-if="show == 'b'">
      <ul>
        <li>Nom du comite : {{ stocker.comiteName }}</li>
        <li>Nom du president : {{ stocker.lastnamePresident }}</li>
        <li>Prenom du president : {{ stocker.firstnamePresident }}</li>
        <li>Adresse : {{ stocker.adress }}</li>
        <li>Email : {{ stocker.email }}</li>
        <li>Telephone : {{ stocker.phone }}</li>
        <li>Site : {{ stocker.webSite }}</li>
        <li>Facebook : {{ stocker.facebookLink }}</li>
        <li>Description : {{ stocker.description }}</li>
        <button>supprimer</button>
      </ul>
    </div>

    <div v-else-if="show == 'c'">
      <p>Inconnue</p>
    </div>
    <div v-else-if="show == 'd'">
      <p>{{ response }}</p>
    </div>
  </div>
</template>

<script>
const EditShowComiteComponent = {
  props: {
    recharge: Function,
    data: Object,
  },
  data() {
    return {
      visible: [],
      show: "",

      recherche: "",
      stocker: [],
      user: {
        nom: [],
        email: [],
        adresse: [],
        description: [],
        nomP: [],
        prenomP: [],
        telephone: [],
        site: [],
        facebook: [],
        idi: [],
        response: "",
      },
    };
  },
  mounted() {
    this.visibleTrue();
  },
  methods: {
    async recupCoords(index) {
      try {
        const response = await fetch(
          "https://api-adresse.data.gouv.fr/search/?q=" +
            this.user.adresse[index]
        );

        const data = await response.json();

        if (data) {
          let longitude = data.features?.[0].geometry.coordinates[0];
          let latitude = data.features?.[0].geometry.coordinates[1];
          this.envoiData(index, longitude, latitude);
        }
      } catch (e) {
        console.log(e);
      }
    },
    visibleTrue() {
      console.log(this.data, "probleme");
      this.data.forEach((element, index) => {
        this.visible[index] = true;
        this.user.nom[index] = element.comiteName;
        this.user.email[index] = element.email;
        this.user.adresse[index] = element.adress;
        this.user.description[index] = element.description;
        this.user.nomP[index] = element.lastnamePresident;
        this.user.prenomP[index] = element.firstnamePresident;
        this.user.facebook[index] = element.facebookLink;
        this.user.telephone[index] = element.phone;
        this.user.site[index] = element.webSite;
        this.user.idi[index] = element.id;
      });
    },
    search() {
      console.log(this.recherche);
      this.user.nom.every((element, index) => {
        if (this.recherche == element) {
          console.log("oki");
          this.stocker = this.data[index];
          this.show = "b";
          return false;
        } else {
          this.show = "c";
          return true;
        }
      });
    },
    recupData(index) {
      this.recupCoords(index);
      return (this.visible[index] = !this.visible[index]);
    },
    async deleteData(index) {
      let array = {
        id: this.user.idi[index],
      };
      const promise = await fetch("http://127.0.0.1:8000/api/deleteComite", {
        method: "DELETE",
        body: JSON.stringify(array),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("admin_token"),
        },
      });
      console.log(promise);
      let res = await promise.json();
      console.log(res);
      if (promise.status == 200) {
        this.response = res.message;
        this.show = "d";
        this.recharge();
      } else {
        this.response = res.message;
        this.show = "d";
      }
    },

    async envoiData(index, longitude, latitude) {
      console.log(this.user[index]);
      let array = {
        nom: this.user.nom[index],
        prenomP: this.user.prenomP[index],
        nomP: this.user.nomP[index],
        email: this.user.email[index],
        telephone: this.user.telephone[index],
        adresse: this.user.adresse[index],
        site: this.user.site[index],
        facebook: this.user.facebook[index],
        description: this.user.description[index],
        id: this.user.idi[index],
        long: longitude,
        lat: latitude,
      };

      const promise = await fetch("http://127.0.0.1:8000/api/udpateComite", {
        method: "PUT",
        body: JSON.stringify(array),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("admin_token"),
        },
      });
      console.log(promise);
      let res = await promise.json();
      console.log(res);
      if (promise.status == 200) {
        this.response = res.message;
        this.show = "d";
        this.recharge();
      } else {
        this.response = res.message;
        this.show = "d";
      }
    },
  },
};
export default EditShowComiteComponent;
</script>

<style scoped>
.containerShow {
  display: flex;
  flex-direction: column;
}
</style>