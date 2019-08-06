import Vuex from "vuex";
import api from "~/service/api.js";
import { verify } from "crypto";
import { nextTick } from "q";

const createStore = () => {
  return new Vuex.Store({
    state: {
      playcategories: [],
      playgrounds: [],
      news: [],
      searchQuery: {},
      searchResults: [],
      playground: {},
      user: {},
      single_new: {},
      modals: {
        login: false,
        register: false
      },

      myBooks: [],
      success: {
        show: false,
        message: ""
      }
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
      },

      setSingle_new(state, payload) {
        state.single_new = {};
        state.single_new = payload;
      },

      setModals(state, payload) {
        state.modals = { login: false, register: false };
        state.modals = { ...payload };
      },

      setMyBooks(state, payload) {
        state.myBooks = [];
        state.myBooks = [...payload];
        state.myBooks.forEach(item => {
          item.clicked = false;
        });
      },

      setSuccess(state, payload) {
        state.success.show = payload.show;
        if (payload.message) state.success.message = payload.message;
      }
    },

    actions: {
      async nuxtServerInit({ state, commit, dispatch }, { req }) {
        if (req && req.headers && req.headers.cookie) {
          let cookieArray = req.headers.cookie;
          cookieArray = cookieArray.split("; ");
          let cookie = {};

          cookieArray.forEach(item => {
            cookie[item.split("=")[0]] = item.split("=")[1];
          });

          if (cookie.user_id) {
            try {
              await dispatch("getUser", cookie.user_id);
              let user = state.user;
              user.token = cookie.token;

              commit("setUser", user);
            } catch (error) {
              console.log(error.response);
            }
          }
        }
      },

      async getPlaycategories({ state, commit }) {
        try {
          let response = await api().get("playcategories");
          let { data } = response;

          commit("setPlaycategories", data.results);

          return data.results;
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

          return data;
        } catch (error) {
          throw error;
        }
      },

      async getPlaygroundBooking({ state, commit }, id) {
        try {
          let response = await api().get(`playgrounds/${id}/bookings/`, {
            headers: {
              Authorization: `Token ${state.user.token}`
            }
          });
          let { data } = response;

          return data;
        } catch (error) {
          throw error;
        }
      },

      async putPlayground({ state, commit }, payload) {
        try {
          let { id, data } = payload;
          let response = await api().put(`playgrounds/${id}/`, data, {
            headers: {
              Authorization: `Token ${state.user.token}`
            }
          });

          return response.data;
        } catch (error) {
          throw error;
        }
      },

      async register({ state, commit }, payload) {
        try {
          let response = await api().post("auth/users/", payload);
          let { data } = response;

          commit("setUser", data);
        } catch (error) {
          throw error;
        }
      },

      async sendVerify({ state }) {
        try {
          let response = await api().post(
            `/auth/users/${state.user.id}/verify/`
          );
        } catch (error) {
          throw error;
        }
      },

      async verify({ state }, payload) {
        let response = await api().post(
          `auth/users/${state.user.id}/enter_verify_code/`,
          payload
        );
      },

      async auth({ state, commit }, payload) {
        try {
          let response = await api().post("auth/login/", payload);
          let { data } = response;

          commit("setUser", data);
        } catch (error) {
          throw error;
        }
      },

      async getUser({ state, commit }, id) {
        try {
          let response = await api().get(`auth/users/${id}/`, {
            // headers: {
            //   Authorization: `Token ${state.user.token}`
            // }
          });
          let { data } = response;

          commit("setUser", data);
        } catch (error) {
          throw error;
        }
      },

      async updateUser({ state, commit }, payload) {
        try {
          let { id } = payload;
          payload = payload.form;

          let response = await api().put(`auth/users/${id}/`, payload, {
            headers: {
              Authorization: `Token ${state.user.token}`,
              "Content-Type": "multipart/form-data"
            }
          });

          let { data } = response;
        } catch (error) {
          throw error;
        }
      },

      async getSingle_new({ state, commit }, payload) {
        try {
          let response = await api().get(`news/${payload}/`);

          let { data } = response;
          commit("setSingle_new", data);
        } catch (error) {
          throw error;
        }
      },

      async Book({ state, commit }, payload) {
        try {
          let response = await api().post("/book/", payload, {
            headers: {
              Authorization: `Token ${state.user.token}`
            }
          });

          let { data } = response;

          return data;
        } catch (error) {
          throw error;
        }
      },

      async getMyBooks({ state, commit }) {
        try {
          let response = await api().get("/my_bookings/", {
            headers: {
              Authorization: `Token ${state.user.token}`
            }
          });

          let { data } = response;
          commit("setMyBooks", data.results);
        } catch (error) {
          throw error;
        }
      },

      async getMyObjects({ state, commit }) {
        try {
          let response = await api().get("playgrounds/my/", {
            headers: {
              Authorization: `Token ${state.user.token}`
            }
          });

          let { data } = response;
          return data.results;
        } catch (error) {
          throw error;
        }
      },

      async getCities() {
        try {
          let response = await api().get("cities/");

          let { data } = response;

          return data.results;
        } catch (error) {
          throw error;
        }
      },

      async changePassword({ state }, payload) {
        try {
          let response = await api().post(`auth/change_password/`, payload, {
            headers: {
              Authorization: `Token ${state.user.token}`
            }
          });

          return response.data;
        } catch (error) {
          throw error;
        }
      },

      async resetPassword({ state }, payload) {
        try {
          let response = await api().post(`auth/password_reset/`, payload);

          return response.data;
        } catch (error) {
          throw error;
        }
      },

      async addPlayground({ state }, { payload, form }) {
        try {
          let response = await api().post("playgrounds/", payload, {
            headers: {
              Authorization: `Token ${state.user.token}`
            }
          });

          let { data } = response;
          let { id } = data;

          form.forEach(async item => {
            let image = new FormData();
            let file = item.file;

            Object.defineProperty(file, "name", {
              writable: true,
              value: id + "_" + file.name
            });

            image.append("image0", file);

            let imageResponse = await api().post(
              `playgrounds/${id}/add_photo/`,
              image,
              {
                headers: {
                  Authorization: `Token ${state.user.token}`,
                  "Content-Type": "multipart/form-data"
                }
              }
            );
          });
        } catch (error) {
          throw error;
        }
      }
    }
  });
};

export default createStore;
