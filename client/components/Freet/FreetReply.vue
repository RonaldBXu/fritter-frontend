<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <div data-app>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="11">
        <v-card class="freet" color="#F3E5F5">

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
          <v-textarea v-if="editing" class="content" v-model="draft" outlined no-resize :rules="rules" counter />
          <div v-else style="">
            <v-row>
              <v-col cols="9">
                <p class="content">
                  {{ freet.content }}
                </p>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="2.5">
                <CooldownComponent :freet="freet" :cooldownCallback="set_cooldown" />
              </v-col>
            </v-row>
            <br />
          </div>
          <div v-if="!editing">
            <v-btn @click="reflect_dialog = true;">
              💾 Save & Reflect
            </v-btn>
            <br />
            <br />
          </div>
          <v-row>
            <v-col cols="9">
              <p class="info">
                Posted at {{ freet.dateModified }}
                <i v-if="freet.dateModified !== freet.dateCreated">(edited)</i>
              </p>
            </v-col>
            <v-spacer></v-spacer>
            <v-col v-if="inflammatory" cols="2">
              <h3 class="info">
                🔥 Inflammatory!
              </h3>
            </v-col>
          </v-row>
          <section class="alerts">
            <article v-for="(status, alert, index) in alerts" :key="index" :class="status">
              <p>{{ alert }}</p>
            </article>
          </section>
        </v-card>
      </v-col>
    </v-row>


    <br />

    <v-dialog v-model="reflect_dialog" width="750">
      <v-card style="padding:20px">
        <h4>Reflect</h4>
        <br />
        <v-textarea v-model="reflect_draft" outlined no-resize />

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#E57373" text @click="() => {
            reflect_dialog = false;
            reflect_draft = '';
          }">
            Cancel
          </v-btn>
          <v-btn color="#00E676" text @click="submit_reflect">
            Reflect
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

</template>

<script>
import CooldownComponent from '@/components/Cooldown/Cooldown.vue';
export default {
  name: 'FreetReply',
  components: { CooldownComponent },
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true,
    },
    fcUpdate: {
      type: Function,
      required: true,
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {}, // Displays success/error messages encountered during freet modification
      rules: [v => (v.length <= 140) && (v.length > 0) || 'Must be between 1 and 140 characters'],
      reply_dialog: false,
      reflect_dialog: false,
      reply_draft: '',
      reflect_draft: '',
      inflammatory: false,
      cooldown_dialog: false,
      replies: [],
    };
  },
  methods: {
    onScroll() {
      fetch(`/api/cooldowns/${this.freet._id}`, { headers: { 'Content-Type': 'application/json' }, method: 'PATCH', body: JSON.stringify({ provocative: 'no' }) });
    },
    set_cooldown(inflam) {
      this.inflammatory = inflam;
    },
    navReply() {
      this.$router.push(`/reply/${this.freet._id}`)
    },
    async submit_reflect() {
      this.reflect_dialog = false;
      this.reflect_draft = '';
      const r = await fetch(`/api/reflections`, { headers: { 'Content-Type': 'application/json' }, method: 'POST', body: JSON.stringify({ freet_content: this.freet.content, oa: this.freet.author, content: this.reflect_draft }) });
      const res = await r.json();
      if (!r.ok) {
        this.$set(this.alerts, res.error, 'error');
        setTimeout(() => this.$delete(this.alerts, res.error), 3000);
        throw new Error(res.error);
      }
      this.$set(this.alerts, 'Success!', 'success');
      setTimeout(() => this.$delete(this.alerts, 'Success!'), 3000);
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
        this.$forceUpdate();
        this.fcUpdate();
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
