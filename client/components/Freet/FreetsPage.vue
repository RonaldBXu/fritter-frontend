<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <br />
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <br />
      <CreateFreetForm />
      <br />
      <CreateScheduledFreetForm />
    </section>
    <section v-else>
      <br />
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <br />
      <article>
        <h3>
          <v-btn @click="$router.push('/login')">
            🔑 Sign In
          </v-btn>
          to create, edit, and delete freets.
        </h3>
      </article>
    </section>
    <section>
      <br />
      <header>
        <div class="left">
          <h2>
            Viewing all freets
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
        </div>
        <div class="right">
          <GetFreetsForm ref="getFreetsForm" value="author" placeholder="🔍 Author" button="🔄 Get freets" />
        </div>
      </header>
      <br />
      <section v-if="$store.state.freets.length">
        <FreetComponent v-for="freet in $store.state.freets" :key="freet._id" :freet="freet" :fpUpdate="fpUpdate" />
      </section>
      <article v-else>
        <h3>No freets found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
import CreateScheduledFreetForm from '@/components/ScheduledFreet/CreateScheduledFreetForm.vue';
import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';

export default {
  name: 'FreetPage',
  components: { FreetComponent, GetFreetsForm, CreateFreetForm, CreateScheduledFreetForm },
  async mounted() {
    this.$refs.getFreetsForm.submit()
    this.$store.commit('resetInterval')
    this.$store.commit('setStateInterval')
  },
  methods: {
    async fpUpdate() {
      await this.$store.commit('refreshFreets');
      this.$forceUpdate();
    },
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
