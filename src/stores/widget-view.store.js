import { Store } from 'vue-style-angularjs';
import { renderWidget } from './actions/render';
import { RootStore } from './root.store';

export const WidgetViewStore = new Store({
  injectors: [],

  state: {
    widgetViews: []
  },

  getters: {
    getWidgetViewByPath: ({ state }) => (path) => {
      const widgetView = state.widgetViews.find(wv => wv.path === path);
      return widgetView.view;
    }
  },

  mutations: {
    pushWidgetView(state, { path, view }) {
      state.widgetViews.push({ path, view });
    },

    getWidgetView(state, path) {
      return state.widgetViews.find(wv => wv.path === path);
    },

    removeWidgetView(state, path) {
      state.widgetViews = state.widgetViews.filter(wm => wm.path!== path);
    },

    setWidgetViews(state, widgetViews) {
      state.widgetViews = widgetViews;
    }
  },

  actions: {
    getWidgetViews({ commit, rootState }) {
      const widgetViews = rootState.widgetMappings.map(wm => {
        return {
          path: wm.path,
          view: renderWidget(wm.mapping)
        }
      });

      commit('setWidgetViews', widgetViews);
    },

    getWidgetView({ commit }, path) {
      commit('getWidgetView', path);
    }

  }
});
