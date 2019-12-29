export const widgetMixin = {
  injectors: ['widgetStore'],

  props: ['sourcePath', 'mappingPath', 'viewType'],

  data: {
    source: {},
    rootSource: {},
    mapping: {},
  },

  created: function() {
    this.source = this.widgetStore.actions.getWithDefault(this.sourcePath, []);
    this.mapping = this.widgetStore.actions.getMapping(this.mappingPath);
    this.systemSettings = this.widgetStore.state.systemSettings;
  }
}
