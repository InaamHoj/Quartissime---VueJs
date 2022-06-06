<template>
  <div>
    <!-- <router-link to="/login"> Login comité </router-link> -->
    <router-view />

    <!-- <div class="div_footer">
      <footer class="bg-dark text-center text-white"> -->
    <!-- Grid container -->
    <!-- <div class="container p-4 pb-0 foot"> -->
    <!-- Section: Social media -->
    <!-- <section class="mb-4 sectionfoot"> -->
    <!-- Facebook -->
    <!-- <a
              class="btn btn-outline-light btn-floating m-1"
              href="#!"
              role="button"
              ><i class="fab fa-facebook-f"></i
            ></a> -->

    <!-- Twitter -->
    <!-- <a
              class="btn btn-outline-light btn-floating m-1"
              href="#!"
              role="button"
              ><i class="fab fa-twitter"></i
            ></a> -->

    <!-- Instagram -->
    <!-- <a
              class="btn btn-outline-light btn-floating m-1"
              href="#!"
              role="button"
              ><i class="fab fa-instagram"></i
            ></a>
          </section> -->
    <!-- Section: Social media -->
    <!-- </div> -->
    <!-- Grid container -->

    <!-- Copyright -->
    <!-- <div
          class="text-center p-3"
          style="background-color: rgba(0, 0, 0, 0.2)"
        >
          © 2022 Copyright:
          <a class="text-white" href="https://jcenice.com/"
            >JCI NICE COTE D'AZUR</a
          >
        </div>
      </footer> -->
    <!-- </div> -->
  </div>
</template>

<style>
body {
  margin: 0px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
.div_footer {
  margin-top: 50px;
}
.foot {
  padding: 10px 0 0 0 !important;
}
.sectionfoot {
  margin-bottom: 10px !important;
}
</style>
