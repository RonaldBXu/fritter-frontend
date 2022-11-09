import Vue from 'vue';
import VueRouter from 'vue-router';
import FreetsPage from './components/Freet/FreetsPage.vue';
import AccountPage from './components/Account/AccountPage.vue';
import LoginPage from './components/Login/LoginPage.vue';
import ReplyPage from './components/Freet/ReplyPage.vue';
import UserScheduledFreets from './components/ScheduledFreet/UserScheduledFreets.vue';
import UserReflections from './components/Reflection/UserReflections.vue';
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Home', component: FreetsPage},
  {path: '/user/:username', name: 'User', component: AccountPage},
  {path: '/login', name: 'Login', component: LoginPage},
  {path: '/reply/:freetid', name: 'Reply', component: ReplyPage},
  {path: '/scheduledfreets/:username', name: 'ScheduledFreets', component: UserScheduledFreets},
  {path: '/reflections/:username', name: 'Reflections', component: UserReflections},
  {path: '*', name: 'Not Found', component: NotFound}
];

const router = new VueRouter({routes});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    if (to.name === 'Login' && router.app.$store.state.username) {
      next({name: 'Account'}); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if (to.name === 'Account' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Account and are not signed in
      return;
    }
  }

  next();
});

export default router;
