<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section v-if="$store.state.username === $route.params.username">
      <br />
      <div>
        <div style="margin:auto; text-align:center">
          <h2>General Content</h2>
        </div>
        <br />
        <div style="margin:auto; text-align:center">
          <v-row>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-col>
              <v-btn @click="$router.push(`/scheduledfreets/${$store.state.username}`)">
                📅 My Scheduled Freets
              </v-btn>
            </v-col>
            <v-col>
              <v-btn @click="$router.push(`/reflections/${$store.state.username}`)">
                📝 My Reflections
              </v-btn>
            </v-col>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
          </v-row>
        </div>
      </div>
      <br />
      <header>
        <h2>Account settings for @{{ $store.state.username }}</h2>
      </header>
      <br />
      <ChangeUsernameForm />
      <br />
      <ChangePasswordForm />
      <br />
      <header>
        <h2>Account management</h2>
      </header>
      <br />
      <LogoutForm />
      <br />
      <DeleteAccountForm />
    </section>
    <section v-else>
      <br />
      <header>
        <h2>@{{ $route.params.username }}</h2>
      </header>
      <br />
      <EditCredit :username="$route.params.username" />
      <div style="margin-left:auto;margin-right:0;width:70%">
        <UserReflections />
      </div>
    </section>
  </main>
</template>

<script>
import ChangeUsernameForm from '@/components/Account/ChangeUsernameForm.vue';
import ChangePasswordForm from '@/components/Account/ChangePasswordForm.vue';
import DeleteAccountForm from '@/components/Account/DeleteAccountForm.vue';
import LogoutForm from '@/components/Account/LogoutForm.vue';
import UserScheduledFreets from '@/components/ScheduledFreet/UserScheduledFreets.vue';
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import EditCredit from '@/components/Credit/EditCredit.vue';
import UserReflections from '@/components/Reflection/UserReflections.vue';

export default {
  name: 'AccountPage',
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    DeleteAccountForm,
    LogoutForm,
    UserScheduledFreets,
    EditCredit,
    FreetComponent,
    UserReflections,
  },
  mounted() {
    this.$store.commit('resetInterval')
  },

};
</script>
