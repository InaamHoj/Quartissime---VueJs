<template>
  <div>
    <h1>Edit Assoc</h1>
    <div class="miniContainer">
      <p @click="this.show = 'a'">Voir tout les Associations</p>
      <label for="recherche">Recherche par nom de association</label>
      <input type="text" v-model="recherche" />
      <button @click="search">valider</button>
    </div>

    <div v-if="show == 'a'">
      <ul v-for="(element, index) in info" :key="index">
        <div v-show="visible[index]">
          <li>Nom du comite Quartier : {{ element.comiteName }}</li>
          <li>Nom de l'association: {{ element.nom }}</li>
          <li>Adresse : {{ element.adresse }}</li>
          <li>Status : {{ element.status }}</li>
          <li>Email : {{ element.email }}</li>
          <li>Telephone : {{ element.telephone }}</li>
          <li>Description : {{ element.description }}</li>
          <button @click="this.visible[index] = !this.visible[index]">
            editer
          </button>
          <button @click="deleteData(index)">supprimer</button>
        </div>
        <div v-show="!visible[index]" class="containerShow">
          <p>Nom du comite Quartier : {{ element.comiteName }}</p>

          <label for="nomAssoc">Nom de l'association</label>
          <input type="text" v-model="user.nomAssoc[index]" />

          <label for="Adresse">Adresse</label>
          <input type="text" v-model="user.adresse[index]" />

          <label for="status">Status</label>
          <input type="text" v-model="user.status[index]" />

          <label for="email">Email</label>
          <input type="email" v-model="user.email[index]" />

          <label for="telephone">Telephone</label>
          <input type="text" v-model="user.telephone[index]" />

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
        <li>Nom de l'association: {{ stocker.nom }}</li>
        <li>Adresse : {{ stocker.adresse }}</li>
        <li>Status : {{ stocker.status }}</li>
        <li>Email : {{ stocker.email }}</li>
        <li>Telephone : {{ stocker.telephone }}</li>
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
const EditShowDeleteAssocComponent = {
  props: {
    recharge: Function,
    info: Object,
  },
  data() {
    return {
      visible: [],
      show: "",
      recherche: "",
      stocker: [],
      user: {
        email: [],
        adresse: [],
        description: [],
        nomAssoc: [],
        status: [],
        telephone: [],
        idi: [],
        response: "",
      },
    };
  },
  mounted() {
    this.visibleTrue();
  },
  methods: {
    visibleTrue() {
      this.info.forEach((element, index) => {
        this.visible[index] = true;
        this.user.email[index] = element.email;
        this.user.adresse[index] = element.adresse;
        this.user.description[index] = element.description;
        this.user.nomAssoc[index] = element.nom;
        this.user.status[index] = element.status;
        this.user.telephone[index] = element.telephone;
        this.user.idi[index] = element.id;
      });
    },
    search() {
      console.log(this.recherche);
      this.user.nomAssoc.every((element, index) => {
        if (this.recherche == element) {
          console.log("oki");
          this.stocker = this.info[index];
          this.show = "b";
          return false;
        } else {
          this.show = "c";
          return true;
        }
      });
    },
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
    recupData(index) {
      this.recupCoords(index);
      return (this.visible[index] = !this.visible[index]);
    },
    async envoiData(index, longitude, latitude) {
      console.log(this.user[index]);
      let array = {
        nom: this.user.nomAssoc[index],
        email: this.user.email[index],
        telephone: this.user.telephone[index],
        adresse: this.user.adresse[index],
        description: this.user.description[index],
        status: this.user.status[index],
        id: this.user.idi[index],
        long: longitude,
        lat: latitude,
      };

      const promise = await fetch("http://127.0.0.1:8000/api/udpateAssoc", {
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
    async deleteData(index) {
      let array = {
        id: this.user.idi[index],
      };
      const promise = await fetch("http://127.0.0.1:8000/api/deleteAssoc", {
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
  },
};
export default EditShowDeleteAssocComponent;
</script>

<style scoped>
.containerShow {
  display: flex;
  flex-direction: column;
}
</style>