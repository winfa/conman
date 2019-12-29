import { Store } from 'vue-style-angularjs';

function getWidgetMappings(mapping, path = '') {
  let widgetMappings = [{
    path,
    mapping: mapping
  }];

  (mapping.fields || []).forEach((subMapping, index) => {
    const subPath = path ? `${path}.fields[${index}]` : `fields[${index}]`;
    const subWidgetMappings = getWidgetMappings(subMapping, subPath);

    widgetMappings = [...widgetMappings, ...subWidgetMappings];
  });

  return widgetMappings;
}

export const WidgetMappingStore = new Store({
  injectors: [],

  state: {
    widgetMappings: []
  },

  getters: {

  },

  mutations: {
    setWidgetMappings(state, widgetMappings) {
      state.widgetMappings = widgetMappings;
    }
  },

  actions: {
    getWidgetMappings({ commit, state }, mapping) {
      const widgetMappings = getWidgetMappings(mapping, '');
      commit('setWidgetMappings', widgetMappings);
    }
  }
});

