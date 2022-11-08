<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <div>
    <v-card class="freet">
      <header>
        <h3 class="author" @click="toUser">
          @{{ freet.author }}
        </h3>
        <div v-if="$store.state.username === freet.author" class="actions">
          <br />
          <div v-if="editing">
            <v-btn @click="submitEdit">
              ✅ Save changes
            </v-btn>
            <v-btn @click="stopEditing">
              🚫 Discard changes
            </v-btn>
            <v-btn @click="deleteFreet">
              🗑️ Delete
            </v-btn>
          </div>
          <div v-else>
            <v-btn @click="startEditing">
              ✏️ Edit
            </v-btn>
            <v-btn @click="deleteFreet">
              🗑️ Delete
            </v-btn>
          </div>
        </div>
      </header>
      <br />
      <v-textarea v-if="editing" class="content" v-model="draft" outlined />
      <div v-else>
        <p class="content">
          {{ freet.content }}
        </p>
        <br />
      </div>
      <div v-if="!editing">
        <v-btn @click="reply">
          ↩️ Reply
        </v-btn>
        <br />
        <br />
      </div>

      <p class="info">
        Posted at {{ freet.dateModified }}
        <i v-if="freet.dateModified !== freet.dateCreated">(edited)</i>
      </p>

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
  name: 'FreetComponent',
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    reply() {
      console.log('open modal for reply')
    },
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    toUser() {
      this.$router.push(`/user/${this.freet.author}`);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({ content: this.draft }),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
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
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

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
.freet {
  border: 1px solid #111;
  padding: 20px;
  position: relative;
}

.author {
  color: rgb(62, 62, 253);
  text-decoration: underline;
  cursor: pointer;
}
</style>
