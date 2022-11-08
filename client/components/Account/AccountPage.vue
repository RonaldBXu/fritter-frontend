<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section v-if="$store.state.username === $route.params.username">
      <br/>
      <UserScheduledFreets />
      <br/>
      <header>
        <h2>Account settings for @{{ $store.state.username }}</h2>
      </header>
      <br/>
      <ChangeUsernameForm />
      <br/>
      <ChangePasswordForm />
      <br/>
      <header>
        <h2>Account management</h2>
      </header>
      <br/>
      <LogoutForm />
      <br/>
      <DeleteAccountForm />
    </section>
    <section v-else>
      <br/>
      <header>
        <h2>@{{ $route.params.username }}</h2>
      </header>
      <br/>
      <EditCredit :username="$route.params.username"/>
    </section>
  </main>
</template>

<script>
import ChangeUsernameForm from '@/components/Account/ChangeUsernameForm.vue';
import ChangePasswordForm from '@/components/Account/ChangePasswordForm.vue';
import DeleteAccountForm from '@/components/Account/DeleteAccountForm.vue';
import LogoutForm from '@/components/Account/LogoutForm.vue';
import UserScheduledFreets from '@/components/ScheduledFreet/UserScheduledFreets.vue';
import EditCredit from '@/components/Credit/EditCredit.vue';

export default {
  name: 'AccountPage',
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    DeleteAccountForm,
    LogoutForm,
    UserScheduledFreets,
    EditCredit,
  }
};
</script>
