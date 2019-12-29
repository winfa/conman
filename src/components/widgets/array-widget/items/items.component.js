import template from './items.html';
import { Component } from 'vue-style-angularjs';
import { widgetMixin } from '../../../mixins/widget.mixin';

export const ArrayWidgetItemsComponent = new Component({
  mixins: [widgetMixin],

  injectors: ['$timeout', '$state'],

  props: [],

  data: {
    queryPath: '',
  },

  created: function() {
    this.queryPath = this.$state.params.path;
    this.selectedIndex = this.widgetStore.actions.getItemIndex(this.queryPath, this.mappingPath);
  },

  computed: {
    itemOverview: function() {
      return this?.mapping?.fragments?.itemOverview;
    }
  },

  methods: {
    getItemPath: function(index) {
      return this.mappingPath.replace(/(\{\d*\})?$/, `{${index}}`)
    },

    removeItem: function($event, itemIndex) {
      $event.stopPropagation();
      $event.preventDefault();
      this.source = this.source.filter((item, index) => index !== itemIndex);
      this.$timeout(() => {});
    },

    addNewItem: function() {
      const emptyItem = {};
      this.source.push(emptyItem);

      this.$state.go(this.$state.current.name, { path: this.getItemPath(this.source.length - 1) });
    },

    editItem: function(index) {
      this.$state.go(this.$state.current.name, { path: this.getItemPath(index) });
    }
  },

  template: function($element, $attrs, $compile, widgetStore) {
    const { mappingPath, sourcePath } = $attrs;
    const mapping = widgetStore.actions.getMapping(mappingPath);

    const itemOverview = mapping?.fragments?.itemOverview || '';
    return template.replace('$itemOverview$', itemOverview);
  }
});
