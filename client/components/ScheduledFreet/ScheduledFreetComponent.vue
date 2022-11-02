<!-- Reusable component representing a single scheduledfreet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="scheduledfreet">
    <header>
      <h3 class="author">
        @{{ $store.state.username }}
      </h3>
      <div class="actions">
        <button v-if="editing" @click="submitEdit">
          ✅ Save changes
        </button>
        <button v-if="editing" @click="stopEditing">
          🚫 Discard changes
        </button>
        <button v-if="!editing" @click="startEditing">
          ✏️ Edit
        </button>
        <button @click="deleteScheduledFreet">
          🗑️ Delete
        </button>
      </div>
    </header>
    <div v-if="editing">
      <p class="info">
        Content
      </p>
      <textarea class="content" :value="draft" @input="draft = $event.target.value" />
    </div>

    <p v-else class="content">
      {{ scheduledfreet.content }}
    </p>
    <div v-if="editing">
      <p class="info">
        Publish Date
      </p>
      <textarea class="content" :value="draft_date" @input="draft_date = $event.target.value" />
    </div>
    <p v-else class="content">
      Scheduled for {{ this.dateToString(scheduledfreet.publish_date) }}
    </p>

    <section class="alerts">
      <article v-for="(status, alert, index) in alerts" :key="index" :class="status">
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
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
    }
  },
  data() {
    return {
      editing: false, // Whether or not this scheduledfreet is in edit mode
      draft: this.scheduledfreet.content, // Potentially-new content for this scheduledfreet
      draft_date: this.scheduledfreet.publish_date,
      alerts: {} // Displays success/error messages encountered during scheduledfreet modification
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this scheduledfreet.
       */
      this.editing = true; // Keeps track of if a scheduledfreet is being edited
      this.draft = this.scheduledfreet.content; // The content of our current "draft" while being edited
      this.draft_date = this.scheduledfreet.publish_date;
    },
    stopEditing() {
      /**
       * Disables edit mode on this scheduledfreet.
       */
      this.editing = false;
      this.draft = this.scheduledfreet.content;
      this.draft_date = this.scheduledfreet.publish_date;
    },
    deleteScheduledFreet() {
      /**
       * Deletes this scheduledfreet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted scheduledfreet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    dateToString(d) {
      return moment(d).toString();
    },
    submitEdit() {
      /**
       * Updates scheduledfreet to have the submitted draft content.
       */
      if (this.scheduledfreet.content === this.draft && this.scheduledfreet.publish_date === this.draft_date) {
        const error = 'Error: Edited scheduledfreet content or publish date should be different.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited scheduledfreet!',
        body: JSON.stringify({ content: this.draft, publish_date: this.draft_date }),
        callback: () => {
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
  border: 1px solid #111;
  padding: 20px;
  position: relative;
}
</style>
