<!-- Reusable component for a form in an inline style (input and button on same line) -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit">
    <div style="position: absolute; top: -30px; left: -360px">
      <v-text-field v-model="value" :placeholder="placeholder" />
      <div style="position: absolute; top:10px; left: 200px;">
        <v-btn @click="submit">
          {{ button }}
        </v-btn>
      </div>
      <section class="alerts">
        <article v-for="(status, alert, index) in alerts" :key="index" :class="status">
          <p>{{ alert }}</p>
        </article>
      </section>
    </div>
  </form>
</template>

<script>
export default {
  name: 'InlineForm',
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    button: {
      type: String,
      default: 'Submit'
    },
  },
  data() {
    return { value: '', alerts: {} };
  }
};
</script>

<style scoped>
form {
  display: flex;
  position: relative;
}

input {
  padding: 0 5px;
  min-width: 200px;
}
</style>
