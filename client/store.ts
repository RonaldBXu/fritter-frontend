import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import * as CONSTANT from './components/common/constants'

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    username: null, // Username of the logged in user
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    scheduledfreets: [],
    refreshInterval: null,
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    updateScheduledFreets(state, scheduledfreets) {
      /**
       * Update the stored scheduled freets
       * @param scheduledfreets - scheduled Freets to store
       */
      state.scheduledfreets = scheduledfreets;
    },
    setStateInterval(state) {
      /**
       * Update the stored scheduled freets
       * @param scheduledfreets - scheduled Freets to store
       */
      if (state.refreshInterval) clearInterval(state.refreshInterval);
      state.refreshInterval = setInterval(async () => {
        const url = state.filter ? `/api/users/${state.filter}/freets` : '/api/freets';
        const res = await fetch(url).then(async r => r.json());
        const fts = [];
        for (const ft of res) {
          if (!ft.isReply) {
            fts.push(ft);
          }
        }
        state.freets = [...fts];
      }, CONSTANT.UPDATE_INTERVAL)
    },
    resetInterval(state) {
      /**
       * Update the stored scheduled freets
       * @param scheduledfreets - scheduled Freets to store
       */
      if (state.refreshInterval) clearInterval(state.refreshInterval);
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/users/${state.filter}/freets` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      const fts = [];
      for (const ft of res) {
        if (!ft.isReply) {
          fts.push(ft);
        }
      }
      state.freets = [...fts];
    },
    async refreshScheduledFreets(state) {
      /**
       * Request the server for the currently available freets.
       */

      const url = `/api/scheduledfreets?authorId=${state.username}`;
      const res = await fetch(url).then(async r => r.json());
      state.scheduledfreets = [...res];
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
