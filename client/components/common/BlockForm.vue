<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <v-card style="padding: 10px;" color="#9BEBFF">
    <form @submit.prevent="submit">
      <h3>{{ title }}</h3>
      <div v-if="fields.length">
        <div v-for="field in fields" :key="field.id">
          <v-textarea v-if="field.id === 'content'" v-model="field.value" counter :rules="rules" :label="field.label"
            no-resize class="form-input" />
          <v-text-field v-else-if="field.id === 'publish_date'" :name="field.id" v-model="field.value"
            :label="field.label" :rules="drules" class="form-input" />
          <v-text-field v-else :type="field.id === 'password' ? 'password' : 'text'" :name="field.id"
            v-model="field.value" :label="field.label" :rules="prules" class="form-input" />
        </div>
      </div>
      <article v-else>
        <p>{{ content }}</p>
      </article>
      <v-btn @click="submit">
        {{ title }}
      </v-btn>
      <section class="alerts">
        <article v-for="(status, alert, index) in alerts" :key="index" :class="status">
          <p>{{ alert }}</p>
        </article>
      </section>
    </form>
  </v-card>

</template>

<script>
import moment from 'moment';
export default {
  name: 'BlockForm',
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      url: '', // Url to submit form to
      method: 'GET', // Form request method
      hasBody: false, // Whether or not form request has a body
      setUsername: false, // Whether or not stored username should be updated after form submission
      refreshFreets: false, // Whether or not stored freets should be updated after form submission
      alerts: {}, // Displays success/error messages encountered during form submission
      callback: null, // Function to run after successful form submission
      rules: [v => (v.length <= 140) && (v.length > 0) || 'Must be between 1 and 140 characters'],
      prules: [v => (v.length > 0) || 'Must be at least 1 character'],
      drules: [date => (!(moment(date, "MM-DD-YYYY HH:mm", true) == null || !moment(date, "MM-DD-YYYY HH:mm", true).isValid())) || 'Must be valid date in <MM-DD-YYYY HH:mm> format'],
    };
  },

  methods: {
    async submit() {

      /**
        * Submits a form with the specified options from data().
        */
      const options = {
        method: this.method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin' // Sends express-session credentials with request
      };
      if (this.hasBody) {
        options.body = JSON.stringify(Object.fromEntries(
          this.fields.map(field => {
            const { id, value } = field;
            field.value = '';
            return [id, value];
          })
        ));
      }

      try {
        const r = await fetch(this.url, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        if (this.setUsername) {
          const text = await r.text();
          const res = text ? JSON.parse(text) : { user: null };
          this.$store.commit('setUsername', res.user ? res.user.username : null);
        }

        if (this.refreshFreets) {
          this.$store.commit('refreshFreets');
        }

        if (this.callback) {
          this.callback();
        }
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.form-input>>>.error--text {
  color: rgb(255, 0, 0) !important;
}

form {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}

article>div {
  display: flex;
  flex-direction: column;
}

form>article p {
  margin: 0;
}

form h3,
form>* {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}

textarea {
  font-family: inherit;
  font-size: inherit;
}
</style>
