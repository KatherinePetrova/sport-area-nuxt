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
      playground: {},
      user: {}
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
      },

      setUser(state, payload) {
        (state.user = {}), (state.user = { ...payload });
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
      },

      async register({ state, commit }, payload) {
        try {
          let response = await api().get("auth/users/");
          let { data } = response;

          commit("setUser", data);

          // // response = await api().post(
          // //   `/auth/users/${state.user.id}/verify/api/auth/`
          // // );
          // response = await api().post(`auth/users/18/enter_verify_code/`);

          console.log(response);
        } catch (error) {
          throw error;
        }
      },

      async auth({ state, commit }, payload) {
        try {
          let response = await api().post("auth/login/", payload);
          let { data } = response;

          commit("setUser", data);
        } catch (error) {
          console.log(error);
        }
      },

      async getUser({ state, commit }, id) {
        try {
          let response = await api().get(`auth/users/${id}/`);
          let { data } = response;

          commit("setUser", data);
        } catch (error) {
          throw error;
        }
      },

      async updateUser({ state, commit }, payload) {
        try {
          let response = await api().get(`auth/users/${payload.id}/`, payload);
          let { data } = response;

          console.log(data);
        } catch (error) {
          throw error;
        }
      }
    }
  });
};

export default createStore;
