import Vuex from "vuex";
import api from "~/service/api.js";

const createStore = () => {
  return new Vuex.Store({
    state: {
      playcategories: [],
      playgrounds: []
    },

    getters: {},

    mutations: {
      setPlaycategories(state, payload) {
        state.playcategories = [];
        let result = [...payload];
        result.forEach(item => {
          item.show = false;
        });

        state.playcategories = [...result];
      },

      setPlaygrounds(state, payload) {
        state.playgrounds = [];
        state.playgrounds = [...payload];
      }
    },

    actions: {
      async getPlaycategories({ state, commit }) {
        try {
          let response = await api().get("playcategories");
          let { data } = response;

          commit("setPlaycategories", data.results);
        } catch (error) {
          throw error;
        }
      },

      async getPlaygrounds({ state, commit }) {
        try {
          let response = await api().get("playgrounds");
          let { data } = response;

          commit("setPlaygrounds", data.results);
        } catch (error) {
          throw error;
        }
      }
    }
  });
};

export default createStore;
