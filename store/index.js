import Vuex from "vuex";
import api from "~/service/api.js";

const createStore = () => {
  return new Vuex.Store({
    state: {
      playcategories: [],
      playgrounds: [],
      news: [],
      searchQuery: {},
      searchResults: [],
      playground: {}
    },

    getters: {},

    mutations: {
      setPlaycategories(state, payload) {
        state.playcategories = [];
        state.playcategories = [...payload];
      },

      setPlaygrounds(state, payload) {
        state.playgrounds = [];
        state.playgrounds = [...payload];
      },

      setNews(state, payload) {
        state.news = [];
        state.news = [...payload];
      },

      setSearchResults(state, payload) {
        state.searchResults = [];
        state.searchResults = [...payload];
      },

      setSearchQuery(state, payload) {
        state.searchQuery = {};
        state.searchQuery = { ...payload };
      },

      setPlayground(state, payload) {
        state.playground = {};
        state.playground = { ...payload };
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
      },

      async getNews({ state, commit }) {
        try {
          let response = await api().get("news");
          let { data } = response;

          commit("setNews", data.results);
        } catch (error) {
          throw error;
        }
      },

      async getSearchResults({ state, commit }) {
        try {
          let query = "";
          for (let key in state.searchQuery) {
            query += `${key}=${state.searchQuery[key]}&`;
          }
          let response = await api().get("playgrounds/?" + query);
          let { data } = response;

          commit("setSearchResults", data.results);
        } catch (error) {
          throw error;
        }
      },

      async getPlayground({ state, commit }, id) {
        try {
          let response = await api().get("playgrounds/" + id);
          let { data } = response;

          commit("setPlayground", data);
        } catch (error) {
          throw error;
        }
      }
    }
  });
};

export default createStore;
