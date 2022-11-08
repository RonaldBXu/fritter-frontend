<!-- Reusable component representing a single scheduledfreet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <div>
    <v-card class="scheduledfreet" color="#E3F2FD">
      <div>
        <div style="text-align:left">
          <h3 class="author">
            @{{ $store.state.username }}
          </h3>
        </div>
        <div style="text-align:end;position:absolute;top:15px;right:10px">

          <div v-if="editing">
            <v-btn @click="submitEdit">
              ✅ Save changes
            </v-btn>
            <v-btn @click="stopEditing">
              🚫 Discard changes
            </v-btn>
            <v-btn @click="deleteScheduledFreet">
              🗑️ Delete
            </v-btn>
          </div>
          <div v-else>
            <v-btn @click="startEditing">
              ✏️ Edit
            </v-btn>
            <v-btn @click="deleteScheduledFreet">
              🗑️ Delete
            </v-btn>
          </div>
        </div>

      </div>

      <br />
      <div v-if="editing">
        <v-textarea v-model="draft" outlined no-resize :rules="rules" counter/>
      </div>
      <div v-else>
        <p class="content">
          {{ scheduledfreet.content }}
        </p>
      </div>

      <div v-if="editing">
        <v-text-field v-model="draft_date" label="Publish Date" />
      </div>
      <div v-else style="text-align:end">
        <br />
        <p class="content">
          Scheduled for {{ draft_date }}
        </p>
      </div>


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

import moment from 'moment';

export default {
  name: 'ScheduledFreetComponent',
  props: {
    // Data from the stored scheduledfreet
    scheduledfreet: {
      type: Object,
      required: true
    },
    getSFs: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this scheduledfreet is in edit mode
      draft: this.scheduledfreet.content, // Potentially-new content for this scheduledfreet
      draft_date: this.dateToString(this.scheduledfreet.publish_date),
      alerts: {}, // Displays success/error messages encountered during scheduledfreet modification
      rules: [v => (v.length <= 140) && (v.length > 0) || 'Must be between 1 and 140 characters'],
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this scheduledfreet.
       */
      this.editing = true; // Keeps track of if a scheduledfreet is being edited
      this.draft = this.scheduledfreet.content; // The content of our current "draft" while being edited
      this.draft_date = this.dateToString(this.scheduledfreet.publish_date);
    },
    stopEditing() {
      /**
       * Disables edit mode on this scheduledfreet.
       */
      this.editing = false;
      this.draft = this.scheduledfreet.content;
      this.draft_date = this.dateToString(this.scheduledfreet.publish_date);
    },
    deleteScheduledFreet() {
      /**
       * Deletes this scheduledfreet.
       */
      const params = {
        method: 'DELETE',
        callback: async () => {
          await this.getSFs();
          this.$store.commit('alert', {
            message: 'Successfully deleted scheduledfreet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    dateToString(d) {
      return moment(d).format('MM-DD-YYYY HH:mm').toString();
    },
    submitEdit() {
      /**
       * Updates scheduledfreet to have the submitted draft content.
       */
      if (this.scheduledfreet.content === this.draft && this.dateToString(this.scheduledfreet.publish_date) === this.dateToString(this.draft_date)) {
        const error = 'Error: Edited scheduledfreet content or publish date should be different.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited scheduledfreet!',
        body: JSON.stringify({ content: this.draft, publish_date: this.draft_date }),
        callback: async () => {
          await this.getSFs();
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the scheduledfreet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: { 'Content-Type': 'application/json' }
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/scheduledfreets/${this.scheduledfreet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshScheduledFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.scheduledfreet {
  padding: 20px;
  position: relative;
}
</style>
