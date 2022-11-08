<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <main>
    <section>
      <br/>
      <header>
        <h2>New to Fritter?</h2>
      </header>
      <br/>
      <RegisterForm />
    </section>
    <section>
      <br/>
      <header>
        <h2>Have an account?</h2>
      </header>
      <br/>
      <LoginForm />
    </section>
  </main>
</template>

<script>
import RegisterForm from '@/components/Login/RegisterForm.vue';
import LoginForm from '@/components/Login/LoginForm.vue';

export default {
  name: 'LoginPage',
  components: {
    RegisterForm,
    LoginForm
  }
};
</script>
