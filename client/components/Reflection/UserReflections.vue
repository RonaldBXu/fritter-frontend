<!-- Default page that also displays freets -->

<template>
  <div>
    <section v-if="refs.length">
      <header>
        <h3 v-if="pub">
          Public Reflections
        </h3>
        <h3 v-else>
          Private Reflections
        </h3>
      </header>
      <br />
      <ReflectionComponent v-for="reflection in refs" :key="reflection.id" :reflection="reflection"
        :getRefs="getRefs" />
    </section>
    <article v-else>
      <v-card style="padding: 10px;">
        <h3 v-if="pub">No Public Reflections!</h3>
        <h3 v-else>No Private Reflections!</h3>
      </v-card>
    </article>
    <div v-if="$route.params.username === $store.state.username">
      <br />
      <v-btn @click="togglePub">
        <p v-if="pub">
          View Private Reflections
        </p>
        <p v-else>
          View Public Reflections
        </p>
      </v-btn>
    </div>


  </div>


</template>

<script>
import ReflectionComponent from '@/components/Reflection/ReflectionComponent.vue';

export default {
  name: 'UserReflections',
  components: { ReflectionComponent },
  data() {
    return {
      refs: [],
      pub: true,
    };
  },
  async mounted() {
    await this.getRefs();
  },
  methods: {
    async getRefs() {
      const pCond = this.pub ? 'yes' : 'no';
      const url = `/api/reflections?id=${this.$route.params.username}&pub=${pCond}`;
      const r = await fetch(url);
      const res = await r.json();
      if (!r.ok) {
        throw new Error(res.error);
      }
      this.refs = [...res.reflection];


    },
    async togglePub() {
      this.pub = !this.pub;
      await this.getRefs();
    }
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header,
header>* {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
