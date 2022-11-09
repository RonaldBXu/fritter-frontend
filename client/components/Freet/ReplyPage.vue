<!-- Default page that also displays freets -->

<template>
  <div style="margin-top:5%;margin-left:10%;margin-right:10%" data-app>
    <v-card v-if="freet" style="padding:20px" color="#E3F2FD">
      <header>
        <h3 class="author" @click="toUser">
          @{{ freet.author }}
        </h3>
      </header>
      <br />
      <div>
        <p class="content">
          {{ freet.content }}
        </p>
        <br />
      </div>
      <v-row>
        <v-col cols="9.5">
          <p class="info">
            Posted at {{ freet.dateModified }}
            <i v-if="freet.dateModified !== freet.dateCreated">(edited)</i>
          </p>
        </v-col>
        <v-spacer></v-spacer>
        <v-col v-if="inflammatory" cols="3" style="position:absolute;right:-80px">
          <h3 class="info">
            🔥 Inflammatory!
          </h3>
        </v-col>
      </v-row>
      <br />
      <h4>Reply</h4>
      <br />
      <v-textarea v-model="reply_draft" outlined no-resize :rules="rules" counter />

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#E57373" text @click="() => {
          reply_dialog = false;
          reply_draft = '';
        }">
          Cancel
        </v-btn>
        <v-btn color="#00E676" text @click="submit_reply">
          Reply to Freet
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="cooldown_dialog" width="500">
      <v-card style="padding:20px">

        <p>Are you sure you would like to reply:</p>
        <br />
        <v-divider></v-divider>
        <br />
        <p>{{ reply_draft }}</p>
        <br />
        <v-divider></v-divider>
        <br />
        <p>Please wait a cooldown period of 5 seconds before publishing.</p>
        <br />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#E57373" text @click="() => {
            cooldown_dialog = false;
          }">
            Cancel
          </v-btn>
          <v-btn color="#00E676" text @click="publish_reply" :disabled="disabled" :loading="disabled">
            Publish Reply
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

</template>

<script>

export default {
  name: 'ReplyPage',
  data() {
    return {
      freet: null,
      date: null,
      alerts: {}, // Displays success/error messages encountered during freet modification
      rules: [v => (v.length <= 140) && (v.length > 0) || 'Must be between 1 and 140 characters'],
      reply_dialog: false,
      reply_draft: '',
      inflammatory: false,
      cooldown_dialog: false,
      disabled: false,
    };
  },
  async created() {
    const r = await fetch(`/api/freets/${this.$route.params.freetid}`);
    const res = await r.json();
    if (!r.ok) {
      throw new Error(res.error);
    }
    const i = await fetch(`/api/cooldowns/${this.$route.params.freetid}`);
    const ires = await i.json();
    if (!i.ok) {
      throw new Error(ires.error);
    }
    this.inflammatory = ires.cooldown.inflammatory_designation;
    const first = res.thread[0];
    this.freet = first;
  },
  methods: {
    toUser() {
      this.$router.push(`/user/${this.freet.author}`);
    },
    async submit_reply() {
      if (!this.inflammatory) {
        this.reply_dialog = false;
        await this.publish_reply();
        return;
      }
      this.cooldown_dialog = true;
      this.disabled = true;
      setTimeout(() => this.disabled = false, 5000);
    },
    async publish_reply() {

      this.reply_dialog = false;
      this.cooldown_dialog = false;
      const r = await fetch(`/api/freets`, { headers: { 'Content-Type': 'application/json' }, method: 'POST', body: JSON.stringify({ content: this.reply_draft, replyingTo: this.freet._id }) });
      const res = await r.json();
      if (!r.ok) {
        this.$set(this.alerts, res.error, 'error');
        setTimeout(() => this.$delete(this.alerts, res.error), 3000);
        throw new Error(res.error);
      }
      this.$set(this.alerts, 'Success!', 'success');
      setTimeout(() => this.$delete(this.alerts, 'Success!'), 3000);
      this.$store.commit('refreshFreets');
      this.$router.push(`/`);
    },
  },
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
