<template>
  <div class="bloc-page">
    <!-- Section: Design Block -->
    <div class="container-connexion">
      <section class="text-center text-lg-start">
        <div class="card mb-3">
          <div class="row g-0 d-flex align-items-center">
            <div class="col-lg-4 d-none d-lg-flex">
              <img
                src="https://mdbootstrap.com/img/new/ecommerce/vertical/004.jpg"
                alt="Trendy Pants and Shoes"
                class="w-100 rounded-t-5 rounded-tr-lg-0 rounded-bl-lg-5"
              />
            </div>
            <div class="col-lg-8">
              <div class="card-body py-5 px-md-5">
                <form @submit.prevent="login">
                  <!-- Email input -->
                  <div class="form-outline mb-4">
                    <input
                      type="text"
                      name="identifiant"
                      v-model="identifiant"
                      id="form2Example1"
                      class="form-control"
                      placeholder="Identifiant"
                    />
                  </div>

                  <!-- Password input -->
                  <div class="form-outline mb-4">
                    <input
                      type="password"
                      name="password"
                      v-model="password"
                      id="form2Example2"
                      class="form-control"
                      placeholder="Mot de passe"
                    />
                  </div>

                  <!-- 2 column grid layout for inline styling -->
                  <div class="row mb-4">
                    <div class="col d-flex justify-content-center">
                      <!-- Checkbox -->
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          id="form2Example31"
                          checked
                        />
                        <label class="form-check-label" for="form2Example31">
                          Se souvenir de moi
                        </label>
                      </div>
                    </div>

                    <div class="col">
                      <!-- Simple link -->
                      <a href="#!">Mot de passe oublié</a>
                    </div>
                  </div>

                  <!-- Submit button -->
                  <button type="submit" class="btn btn-warning btn-block mb-4">
                    Me connecter
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <!-- Section: Design Block -->
  </div>
</template>

<script>
const ConnexionComiteView = {
  data() {
    return {
      identifiant: "",
      password: "",
    };
  },

  /****************** METHODES ************/
  methods: {
    async login() {
      const promise = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        body: JSON.stringify({
          identifiant: this.identifiant,
          password: this.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      let response = await promise.json();
      console.log(response);
      if (promise.status === 200) {
        localStorage.setItem("token", response.token);

        alert("Bravo, vous êtes maintenant connecté");
        this.$router.push("/profilcomite");
      } else {
        alert("Saisies incorrectes !");
      }
    },
  },
};
export default ConnexionComiteView;
</script>

<style scoped>
.container-connexion {
  width: 80vw;
  margin-top: 50px;
  margin-left: 120px;
}
.rounded-t-5 {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}

@media (min-width: 992px) {
  .rounded-tr-lg-0 {
    border-top-right-radius: 0;
  }

  .rounded-bl-lg-5 {
    border-bottom-left-radius: 0.5rem;
  }
}
/* STYLE TEST 1 */
.cascading-right {
  margin-right: -50px;
}

@media (max-width: 991.98px) {
  .cascading-right {
    margin-right: 0;
  }
}
</style>

/* "Authorization": "Bearer " + localStorage.getItem("token") */
