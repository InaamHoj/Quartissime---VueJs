<template>
  <div class="page-details">
    <div class="home">
      <header class="entete">
        <img src="../assets/logo.png" alt="" class="logo" />
      </header>
      <!------------ BLOC DETAILS COMITE AVEC IMAGE  ------------->

      <div class="bloc-details-img">
        <div class="div-img-personne">
          <img src="../assets/img-personne.png" alt="" class="img-personne" />
        </div>
        <div class="container-details">
          <p><strong>Nom du comité : </strong> {{ details.comiteName }}</p>
          <p><strong>Adresse : </strong>{{ details.adress }}</p>
          <p><strong>Contact : </strong>{{ details.phone }}</p>
          <p><strong>Email : </strong>{{ details.email }}</p>
          <p><strong> Site web : </strong>{{ details.webSite }}</p>
          <p><strong>Description : </strong>{{ details.description }}</p>
          <p>
            <strong>Prénom du Président : </strong
            >{{ details.firstnamePresident }}
          </p>
          <p>
            <strong>Nom du Président : </strong>{{ details.lastnamePresident }}
          </p>
          <router-link
            class=""
            :to="{ name: 'inscription', params: { idComite: details.id } }"
          >
            <button type="button" class="slide">
              <div>S'inscrire</div>
              <i class="icon-arrow-right"></i>
            </button>
          </router-link>
        </div>
      </div>

      <div class="row bloc-assos-evens">
        <div class="card" style="width: 30rem">
          <img
            class="card-img-top"
            src="../assets/img-assos.png"
            alt="Card image cap"
          />
          <div class="card-body">
            <h5 class="card-title">LES ASSOCITIONS</h5>
            <hr />

            <div
              class="card-text"
              v-for="assoc in detailsAssoc"
              :key="assoc.id"
            >
              <p><b>Nom de l'association : </b>{{ assoc.nom }}</p>
              <p><b> Email : </b> {{ assoc.email }}</p>
              <p><b> Téléphone : </b>{{ assoc.telephone }}</p>
              <hr />
            </div>

            <!-- <a href="#" class="btn btn-primary">Go somewhere</a> -->
          </div>
        </div>

        <div class="card" style="width: 30rem">
          <img
            class="card-img-top"
            src="../assets/img-evens.png"
            alt="Card image cap"
          />
          <div class="card-body">
            <h5 class="card-title">LES EVENEMENTS</h5>
            <div class="card-text" v-for="event in events" :key="event.id">
              <p><b>Nom de l'événement : </b>{{ event.eventname }}</p>
              <p><b> Date : </b> {{ event.eventdate }}</p>
              <p><b> Lieu : </b>{{ event.place }}</p>
              <br />
              <button @click="downloadpdf(event)">Télécharger la fiche</button>
              <hr />
            </div>

            <p v-if="this.events.length == 0">
              Aucun évènement pour le moment, n'hésitez pas à revenir voir
              régulièrement, à bientôt
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { jsPDF } from "jspdf";
import image from "@/assets/logo.png";
const DetailsComiteView = {
  props: {
    idDetails: String,
  },

  data() {
    return {
      details: {},
      detailsAssoc: [],
      events: [],
    };
  },

  mounted() {
    this.showdetailsComite();
  },
  /****************** RÉCUPÉRATION DES DÉTAILS D'UN COMITÉ ET SES ASSOCIATIONS ************/
  methods: {
    async downloadpdf(event) {
      const doc = new jsPDF();
      var imgData = image;
      doc.addImage(imgData, "png", 10, 78, 50, 30);

      doc.text([event.eventname, event.eventdate, event.place], 15, 15);

      doc.save("test.pdf");
    },

    async showdetailsComite() {
      const promise = await fetch(
        "http://127.0.0.1:8000/api/comites/" + this.idDetails
      );
      console.log("test", promise);
      let response = await promise.json();
      console.log("response", response);
      if (promise.status === 200) {
        this.details = response.detailsComite;
        this.detailsAssoc = response.detailsAssoc;
        this.events = response.events;
        console.log(this.events, "tablkeaux");
      }
    },
  },
};
export default DetailsComiteView;
</script>

<style scoped>
.entete {
  min-height: 80px;
  border-bottom: 4px solid black;
}
.logo {
  height: 7vh;
  margin: 20px;
}
.bloc-details-img {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 70px;
  gap: 8%;
}
.container-details {
  padding: 25px;
  border: solid 2px #ffda3e;
  width: 50%;
  box-shadow: 30px -16px #ffda3e;
  border-radius: 15px;
}

.img-personne {
  height: 65vh;
  margin-left: 10px;
}
/* CSS BOUTTON INSCRIPTION */
.slide {
  font-size: 20px;
  font-weight: 200;
  letter-spacing: 1px;
  padding: 10px 20px 10px;
  outline: 0;
  border: 1px solid black;
  border-radius: 5px;
  cursor: pointer;
  position: relative;
  background-color: rgba(0, 0, 0, 0);
}

.slide i {
  opacity: 0;
  font-size: 13px;
  transition: 0.2s;
  position: absolute;
  right: 10px;
  top: 21px;
  transition: transform 1;
}

.slide div {
  transition: transform 0.8s;
}

.slide:hover div {
  transform: translateX(-6px);
}

.slide::after {
  content: "";
  background-color: #ffda3e;
  width: 100%;
  z-index: -1;
  position: absolute;
  height: 100%;
  top: 7px;
  left: 7px;
  border-radius: 5px;
}

.slide:hover i {
  opacity: 1;
  transform: translateX(-6px);
}

.bloc-assos-evens {
  display: flex;
  justify-content: center;
  margin: 110px 20px 0px 30px;
  gap: 10%;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
}
</style>
