<!-- Default page that also displays freets -->

<template>

  <section v-if="sfs.length">
    <br />
    <header>

      <div style="margin:auto; text-align:center">
        <h2>
          Scheduled Freets
        </h2>
      </div>
    </header>
    <br />
    <div style="margin:auto;width:90%">
      <ScheduledFreetComponent v-for="scheduledfreet in sfs" :key="scheduledfreet._id" :scheduledfreet="scheduledfreet"
      :getSFs="getSFs" />
    </div>
    
  </section>
  <article v-else>
    <br />
    <div style="margin:auto; text-align:center">
      <h2>No Scheduled Freets!</h2>
    </div>
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
    if (this.$route.params.username !== this.$store.state.username) this.$router.push('/');
    await this.getSFs();
  },
  methods: {
    async getSFs() {
      const url = `/api/scheduledfreets?authorId=${this.$route.params.username}`;
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
