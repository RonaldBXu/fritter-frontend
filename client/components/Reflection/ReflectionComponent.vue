<!-- Reusable component representing a single scheduledfreet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <div>
    <v-card class="reflection" color="#4DB6AC">

      <header>
        <h3 class="author" @click="toUser">
          @{{ reflection.original_author }}
        </h3>
        <p>{{ reflection.freet_content }}</p>
      </header>
      <br />
      <v-card style="padding:20px" color="#abefe8">
        <div>
          <h3>Reflection:</h3>
          <p>
            {{ reflection.reflection_content }}
          </p>
        </div>

        <div v-if="$route.params.username === $store.state.username" style="text-align:end">
          <br />
          <v-btn v-if="reflection.pub" @click="makePrivate">
            Make Private
          </v-btn>
          <v-btn v-else @click="makePublic">
            Make Public
          </v-btn>
        </div>
      </v-card>


      <section class="alerts">
        <article v-for="(status, alert, index) in alerts" :key="index" :class="status">
          <p>{{ alert }}</p>
        </article>
      </section>
    </v-card>
    <br />
  </div>
</template>

<script>

export default {
  name: 'ReflectionComponent',
  props: {
    // Data from the stored scheduledfreet
    reflection: {
      type: Object,
      required: true
    },
    getRefs: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      alerts: {},
    };
  },
  methods: {
    toUser() {
      this.$router.push(`/user/${this.freet.author}`);
    },
    makePrivate() {
      this.editRef(false)
    },
    makePublic() {
      this.editRef(true)
    },
    async editRef(pub) {
      const r = await fetch(`/api/reflections/${this.reflection._id}`, { headers: { 'Content-Type': 'application/json' }, method: 'PATCH', body: JSON.stringify({ pub: pub }) });
      const res = await r.json();
      if (!r.ok) {
        this.$set(this.alerts, res.error, 'error');
        setTimeout(() => this.$delete(this.alerts, res.error), 3000);
        throw new Error(res.error);
      }
      this.$set(this.alerts, 'Success!', 'success');
      setTimeout(() => this.$delete(this.alerts, 'Success!'), 3000);
      this.getRefs();
    }
  }
};
</script>

<style scoped>
.reflection {
  padding: 20px;
  position: relative;
}
</style>
