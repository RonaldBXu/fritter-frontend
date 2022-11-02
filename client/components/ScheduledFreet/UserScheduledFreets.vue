<!-- Default page that also displays freets -->

<template>
  <main>
    <header>
      <h2>Welcome @{{ $store.state.username }}</h2>
    </header>
    <section>
      <header>
        <div class="left">
          <h2>
            Scheduled Freets
          </h2>
        </div>
      </header>
      <section v-if="$store.state.scheduledfreets.length">
        <ScheduledFreetComponent v-for="scheduledfreet in $store.state.scheduledfreets" :key="scheduledfreet.id" :scheduledfreet="scheduledfreet" />
      </section>
      <article v-else>
        <h3>No freets found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import ScheduledFreetComponent from '@/components/ScheduledFreet/ScheduledFreetComponent.vue';

export default {
  name: 'UserScheduledFreets',
  components: { ScheduledFreetComponent },
  beforeMount () {
    this.getSFs();
  },
  methods: {
    async getSFs() {
      const url = `/api/scheduledfreets?authorId=${this.$store.state.username}`;
      const r = await fetch(url);
      const res = await r.json();
      if (!r.ok) {
        throw new Error(res.error);
      }
      this.$store.commit('updateScheduledFreets', res);
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
