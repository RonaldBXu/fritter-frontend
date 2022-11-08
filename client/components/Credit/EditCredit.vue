<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <div>
    <v-card color="#84FFFF" class="credit">
      <p>
        <v-icon>mdi-credit-card</v-icon> Credit: {{ credit }}
      </p>

      <br/>
      <v-btn @click="modifyCredit">
        <p v-if="given">
          <v-icon>mdi-credit-card-minus</v-icon> Take Away Credit
        </p>
        <p v-else>
          <v-icon>mdi-credit-card-plus</v-icon> Give Credit
        </p>
      </v-btn>
      <section class="credit-alerts">
        <article v-for="(status, alert, index) in alerts" :key="index" :class="status">
          <p>{{ alert }}</p>
        </article>
      </section>
    </v-card>
  </div>


</template>

<script>

export default {
  name: 'EditCredit',
  props: {
    // Data from the stored scheduledfreet
    username: {
      type: String,
      required: true
    },
  },
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      credit: 0,
      given: false,
      alerts: {},
    };
  },
  async created() {
    await this.refreshCredit();
  },
  methods: {
    async modifyCredit() {
      const params = {
        method: 'PATCH',
        message: 'Successfully edited credit!',
        callback: async () => {
          await this.refreshCredit();
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      const options = {
        method: params.method, headers: { 'Content-Type': 'application/json' }
      };
      try {
        const r = await fetch(`/api/credits/${this.username}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async refreshCredit() {
      if (!this.$store.state.username) this.$router.push({ name: 'Home' });
      const url = `/api/credits/${this.username}`;
      const r = await fetch(url);
      const res = await r.json();
      if (!r.ok) throw new Error(res.error);
      this.credit = res.credit.credit;
      this.given = res.credit.credit_received.includes(res.currentUser)
    }
  }
};
</script>

<style scoped>
.credit {
  padding: 20px;
  position: absolute;
  width: 17%;
  text-align: center;
}

.credit-alerts {
  text-align: center;
  position: absolute;
  z-index: 99;
  left: 50%;
  transform: translate(-50%, 10%);
  width: 100%;
}

.credit-alerts article {
  border-radius: 5px;
  padding: 10px 20px;
  color: #fff;
}

.credit-alerts p {
  margin: 0;
}

.credit-alerts .error {
  background-color: rgb(166, 23, 33);
}

.credit-alerts .success {
  background-color: rgb(45, 135, 87);
}
</style>
