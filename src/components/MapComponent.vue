<template>
  <!-- /********************** HEADER MAP ***********************/ -->
  <div class="template">
    <header class="entete">
      <img src="../assets/logo.png" alt="" class="logo" />
    </header>

    <LocalisationComponent :updatelocation="setlocation" />

    <!-- /********************** MAP ***********************/ -->
    <div id="map" class="page-map">
      <l-map style="height: 65vh; width: 70vw" :zoom="zoom" :center="center">
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>

        <!-- /********************** marquers comités ***********************/ -->
        <l-marker
          v-for="comitee in comites"
          :key="comitee.id"
          :lat-lng="[comitee.latitude, comitee.longitude]"
        >
          <l-popup
            ><strong>Nom du comité : </strong> {{ comitee.comiteName }}<br />
            <strong>Adresse : </strong>{{ comitee.adress }}<br />
            <strong>Contact : </strong>{{ comitee.phone }}<br /><br />
            <strong>ID : </strong>{{ comitee.id }}<br /><br />
            <router-link
              class="btn btn-warning btn-detail"
              :to="{
                name: 'detailscomite',
                params: { idDetails: comitee.id },
              }"
            >
              Voir les détails
            </router-link>
          </l-popup>
        </l-marker>

        <!-- /********************** marquer riverains ***********************/ -->
        <l-marker :lat-lng="[latitude, longitude]">
          <l-icon>
            <img class="imgicon" src="../assets/icon.png" />
          </l-icon>
          <l-popup> vous êtes ici</l-popup>
        </l-marker>

        <!-- /******************** marquers associations *************/ -->

        <l-marker
          v-for="association in associations"
          :key="association.id"
          :lat-lng="[association.latitude, association.longitude]"
        >
          <l-icon>
            <img class="imgicon" src="../assets/associcon.png" />
          </l-icon>
          <l-popup
            ><strong>Nom de l'association : </strong>
            {{ association.associationName }}<br />
            <strong>Adresse : </strong>{{ association.adress }}<br />
            <strong>Contact : </strong>{{ association.phone }}<br />
          </l-popup>
        </l-marker>
      </l-map>
    </div>
  </div>
</template>

// /* ******************* SCRIPT ************************** */
<script>
import LocalisationComponent from "../components/LocalisationComponent.vue";
// Inmportation des compsants de leafleats
import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LIcon,
} from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LIcon,
    LocalisationComponent,
  },

  data() {
    return {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 14,
      center: [43.7101728, 7.2619532],

      comites: [],

      associations: [],
      latitude: "",
      longitude: "",
    };
  },

  mounted() {
    this.getComiteesList();
    this.getAssociationList();
  },

  methods: {
    /* //////////METHODE POUR ENVOYER LES DETAILS SUR UNE NOUVELLE VUE//////////////
		test(id) {
			this.$store.dispatch("envoieId", id);
			this.$router.push("/detailscomite");
		}, */

    /********************* Methods map ************************/
    zoomUpdated(zoom) {
      this.zoom = zoom;
      console.log(this.markers);
    },

    centerUpdated(center) {
      this.center = center;
    },
    /* ********************* RÉCUPÉRATION DES COMITES ************* */
    async getComiteesList() {
      const promise = await fetch("http://127.0.0.1:8000/api/showcomites");
      console.log(promise);

      let response = await promise.json();
      console.log(response);

      if (promise.status === 200) {
        this.comites = response.comites;
      }
    },

    /* ** AFFICHAGE DES ASSOCIATIONS SUR LA CARTE ** */
    async getAssociationList() {
      const promise = await fetch("http://127.0.0.1:8000/api/associations");
      console.log(promise);

      let response = await promise.json();
      console.log(response);

      if (promise.status === 200) {
        this.associations = response.associations;
      }
    },

    // / recup longitude et latitude /
    setlocation(latitude, longitude) {
      this.latitude = latitude;
      this.longitude = longitude;
      this.getnearestcomites();
    },

    async getnearestcomites() {
      const response = await fetch(
        "http://127.0.0.1:8000/api/showcomites/nearest?latitude=" +
          this.latitude +
          "&longitude=" +
          this.longitude
      );

      const data = await response.json();
      this.comites = data.comites;
    },
  },
};

export default MapComponent;
</script>

<style scoped>
/************* Header map CSS ************/
.entete {
  min-height: 80px;
  position: absolute;
  left: 0px;
  right: 0px;
  border-bottom: 4px solid black;
  background-color: white;
}
.logo {
  height: 7vh;
  margin: 20px;
}
.btn-geoc-search {
  display: flex;
  flex-direction: row;
  margin-top: 130px;
  justify-content: space-between;
  gap: 35%;
}

/************* bouton geolocalisation ************/
/* .wrap {
  height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
} */

.button-geoc {
  margin-left: 80px;
  min-width: 200px;
  min-height: 40px;
  font-family: "Nunito", sans-serif;
  font-size: 15px;
  letter-spacing: 1.3px;
  color: #373738;
  background: #ffffff;
  border: 3px solid #ffda3e;
  border-radius: 1000px;
  box-shadow: 6px 6px 14px #ffda3e;
  transition: all 0.3s ease-in-out 0s;
  cursor: pointer;
  outline: none;
  position: relative;
  padding: 6px;
}

.button-geoc:hover,
.button-geoc:focus {
  color: #313133;
  transform: translateY(-4px);
}

.button-geoc::after {
  content: "";
  width: 15px;
  height: 15px;
  border-radius: 100%;
  border: 6px solid #ffda3e;
  position: absolute;
  z-index: -1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ring 2s infinite;
}

.button-geoc:hover::after,
.button-geoc:focus::after {
  animation: none;
  display: none;
}

@keyframes ring {
  0% {
    width: 30px;
    height: 30px;
    opacity: 1;
  }
  100% {
    width: 115px;
    height: 115px;
    opacity: 0;
  }
}
/************* INPUT ET BOUTON SEARCH ************/
.input-search {
  padding: 20px;
}

/* .btn-search {
  background-color: #8066f7;
} */

.imgicon {
  width: 30px;
  height: 30px;
}

.btn-popup-detail {
  background-color: #ffda3e;
  color: black;
}
</style>
