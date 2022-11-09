<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <div>
    <v-btn v-if="toggled" @click="toggleProvocative">
      😊 Not Provocative
    </v-btn>
    <v-btn v-else @click="toggleProvocative">
      😠 Provocative
    </v-btn>
    <section class="alerts">
      <article v-for="(status, alert, index) in alerts" :key="index" :class="status">
        <p>{{ alert }}</p>
      </article>
    </section>
  </div>
</template>

<script>
export default {
  name: 'CooldownComponent',
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    },
    cooldownCallback: {
      type: Function,
      required: true
    },
  },
  data() {
    return {
      alerts: {}, // Displays success/error messages encountered during freet modification
      toggled: false,
    };
  },
  async created() {
    await this.getInflam();
  },
  methods: {
    async toggleProvocative() {
      const r = await fetch(`/api/cooldowns/${this.freet._id}`, { headers: { 'Content-Type': 'application/json' }, method: 'PATCH', body: JSON.stringify({ provocative: this.toggled ? 'no' : 'yes' }) });
      const res = await r.json();
      if (!r.ok) {
        throw new Error(res.error);
      }
      this.$set(this.alerts, 'Success!', 'success');
      setTimeout(() => this.$delete(this.alerts, 'Success!'), 3000);
      await this.getInflam();
    },
    async getInflam() {
      const url = `/api/cooldowns/${this.freet._id}`;
      const r = await fetch(url);
      const res = await r.json();
      if (!r.ok) {
        throw new Error(res.error);
      }
      this.cooldownCallback(res.cooldown.inflammatory_designation);
      this.toggled = this.$store.state.username ? res.cooldown.provocative.includes(this.$store.state.username) : false;
    }
  }
};
</script>

