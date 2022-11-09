<!-- Default page that also displays freets -->

<template>

  <section v-if="sfs.length">
    <header>
      <div class="left">
        <h2>
          Scheduled Freets
        </h2>
      </div>
    </header>
    <br />
    <ScheduledFreetComponent v-for="scheduledfreet in sfs" :key="scheduledfreet._id" :scheduledfreet="scheduledfreet"
      :getSFs="getSFs" />
  </section>
  <article v-else>
    <v-card style="padding: 10px;">
      <h3>No Scheduled Freets!</h3>
    </v-card>

  </article>


</template>

<script>
import ScheduledFreetComponent from '@/components/ScheduledFreet/ScheduledFreetComponent.vue';
import * as CONSTANT from '@/components/common/constants.ts'

export default {
  name: 'UserScheduledFreets',
  components: { ScheduledFreetComponent },
  data() {
    return {
      sfs: [],
    };
  },
  async created() {
    await this.getSFs();
  },
  methods: {
    async getSFs() {
      const url = `/api/scheduledfreets?authorId=${this.$store.state.username}`;
      const r = await fetch(url);
      const res = await r.json();
      if (!r.ok) {
        throw new Error(res.error);
      }
      this.sfs = [...res];
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
