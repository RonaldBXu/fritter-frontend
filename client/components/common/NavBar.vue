<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->
<template>
  <div>
    <v-card>
      <v-app-bar absolute color="#FFEFC3" elevate-on-scroll>
        <img src="../../public/logo.svg" />

        <v-toolbar-title>Fritter</v-toolbar-title>

        <v-spacer></v-spacer>
        <router-link to="/" style="text-decoration:none">
          <v-btn icon>
            <v-icon>mdi-home</v-icon>
          </v-btn>
        </router-link>
        <router-link v-if="$store.state.username" :to="{ path: `/user/${$store.state.username}` }"
          style="text-decoration:none">
          <v-btn icon>
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </router-link>
        <router-link v-else to="/login" style="text-decoration:none">
          <v-btn icon>
            <v-icon>mdi-key</v-icon>
          </v-btn>
        </router-link>
      </v-app-bar>
      <section class="alerts">
        <article v-for="(status, alert, index) in $store.state.alerts" :key="index" :class="status">
          <p>{{ alert }}</p>
        </article>
      </section>
    </v-card>
    <div>
      <br />
      <br />
      <br />
    </div>
  </div>
</template>

<style scoped>
nav {
  padding: 1vw 2vw;
  background-color: #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.title {
  font-size: 32px;
  margin: 0 5px;
}

img {
  height: 32px;
}

.left {
  display: flex;
  align-items: center;
}

.right {
  font-size: 20px;
  display: grid;
  gap: 16px;
  grid-auto-flow: column;
  align-items: center;
}

.right a {
  margin-left: 5px;
}

.alerts {
  width: 25%;
}
</style>
