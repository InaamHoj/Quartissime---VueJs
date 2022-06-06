<template>
  <!-- /** GEOLOCALISATION **/ -->
  <div class="btn-geoc-search">
    <div class="btn-geoc">
      <div class="wrap">
        <button @click="geolocbutton" class="button-geoc">
          Me géolocaliser
        </button>
      </div>
    </div>

    <!-- /** INPUT ET BOUTON RECHERCHE PAR ADRESSE **/ -->
    <div class="input-group">
      <div class="form-outline">
        <input
          v-model="search"
          id="form1"
          class="form-control input-search"
          placeholder="Rechercher par adresse"
        />
      </div>
      <button type="button" @click="getadress" class="btn btn-primary">
        <i class="fas fa-search"></i>
      </button>
    </div>
  </div>
</template>

<script>
const LocalisationComponent = {
  props: {
    updatelocation: Function,
  },
  data() {
    return {
      search: "",
    };
  },

  methods: {
    // / GEOLOCALISATION et  AFFICHAGE DES TOP 3 ACOMITES/ASSOCIATIONS  /
    async geolocbutton() {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        this.updatelocation(latitude, longitude);
      });
    },

    /* Methods geo/adresse **/
    async getadress() {
      try {
        const response = await fetch(
          "https://api-adresse.data.gouv.fr/search/?q=" + this.search
        );

        const data = await response.json();

        if (data) {
          const longitude = data.features?.[0].geometry.coordinates[0];
          const latitude = data.features?.[0].geometry.coordinates[1];

          this.updatelocation(latitude, longitude);
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
};

export default LocalisationComponent;
</script>

<style scoped>
.btn-geoc-search {
  display: flex;
  flex-direction: row;
  margin-top: 40px;
  margin-bottom: 40px;
  justify-content: space-between;
  gap: 35%;
}
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
</style>
