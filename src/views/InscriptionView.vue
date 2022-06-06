<template>
  <div>
    <!-- recuperer la variable nom commité -->
    <h1>Inscrivez-vous dans votre comité</h1>
    <div class="container">
      <riverain
        titre="riverain"
        :idComiteRiverain="idComite"
        :showAssoc="show"
        v-show="visible"
      />
      <assoc
        titre="assoc"
        :showRiverain="show"
        :idComiteAssoc="idComite"
        v-show="!visible"
      />
    </div>
  </div>
</template>

<script>
import AssocComponent from "@/components/AssocComponent.vue";
import RiverainComponent from "@/components/RiverainComponent.vue";
const InscriptionView = {
  props: {
    idComite: Number,
  },
  components: {
    riverain: RiverainComponent,
    assoc: AssocComponent,
  },
  data() {
    return {
      visible: true,
    };
  },
  methods: {
    show() {
      return (this.visible = !this.visible);
    },
  },
};
export default InscriptionView;
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}
</style>