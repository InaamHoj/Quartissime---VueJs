<template>
  <div>
    <h1>Edit User commite</h1>
    <div v-if="show == 'a'">
      <p>{{ message }}</p>
    </div>
    <div v-for="(element, index) in info" :key="index" class="test">
      <div class="bloc-modale" v-show="revele[index]">
        <div class="overlay" @click="toogle(index)">
          <div class="modale">
            <div @click="toogle(index)" class="btn-modale">X</div>
            <p>Est vous sur de supprimer {{ email[index] }}</p>
            <button @click="deleteData(index)">valider</button>
          </div>
        </div>
      </div>

      <p
        @click="this.visible[index] = !this.visible[index]"
        v-show="visible[index]"
      >
        indentifiant : {{ element.identifiant }}
      </p>
      <button v-show="visible[index]" @click="confirmation(index)">
        supprimer
      </button>

      <input type="email" v-show="!visible[index]" v-model="email[index]" />
      <input type="text" v-show="!visible[index]" v-model="user.password" />
      <input type="hidden" v-model="idi[index]" />
      <button v-show="!visible[index]" @click="recupData(index)">
        valider
      </button>

      <p>Password : ***********</p>
    </div>
  </div>
</template>

<script>
const EditShowDeleteUserComiteComponent = {
  props: {
    recharge: Function,
    info: Object,
  },
  data() {
    return {
      visible: [],
      email: [],
      idi: [],
      user: {
        emailTrue: "",
        id: "",
        password: "",
      },
      revele: [],
      message: "",
      show: "",
    };
  },

  mounted() {
    this.visibleTrue();
  },
  methods: {
    visibleTrue() {
      console.log(this.info, "probleme");
      this.info.forEach((element, index) => {
        this.visible[index] = true;
        this.revele[index] = false;
        this.email[index] = element.identifiant;
        this.idi[index] = element.id;
        console.log(this.email[index]);
      });
    },
    recupData(index) {
      this.user.emailTrue = this.email[index];
      this.user.id = this.idi[index];

      this.envoiData();
      return (this.visible[index] = !this.visible[index]);
    },
    async envoiData() {
      const promise = await fetch(
        "http://127.0.0.1:8000/api/udpateUserComite",
        {
          method: "PUT",
          body: JSON.stringify(this.user),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("admin_token"),
          },
        }
      );
      console.log(promise);
      let res = await promise.json();
      console.log(res);
      if (promise.status == 200) {
        this.message = res.message;
        this.show = "a";
        this.recharge();
      } else {
        this.show = "a";
        this.message = res.message;
      }
    },
    confirmation(index) {
      this.toogle(index);
    },
    toogle(index) {
      console.log("toogle");
      return (this.revele[index] = !this.revele[index]);
    },
    async deleteData(index) {
      console.log("hey");
      this.user.id = this.idi[index];
      const promise = await fetch(
        "http://127.0.0.1:8000/api/deleteUserComite",
        {
          method: "DELETE",
          body: JSON.stringify(this.user),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("admin_token"),
          },
        }
      );
      console.log(promise);
      let res = await promise.json();
      console.log(res);
      if (promise.status == 200) {
        this.message = res.message;
        this.show = "a";
        this.recharge();
      } else {
        this.show = "a";
        this.message = res.message;
      }
    },
  },
};
export default EditShowDeleteUserComiteComponent;
</script>

<style scoped>
.test {
  background-color: red;
}
.bloc-modale {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.all {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.modale {
  background: #f1f1f1;
  color: #d87418;
  padding: 20px;
  position: fixed;
  top: 30%;
}

.btn-modale {
  position: absolute;
  top: 10px;
  right: 10px;
}
.pointeur {
  cursor: pointer;
}
</style>