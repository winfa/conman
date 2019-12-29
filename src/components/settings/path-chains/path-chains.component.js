import template from './path-chains.html';
import { Component } from 'vue-style-angularjs';

export const PathChainsComponent = new Component({
  injectors: ['widgetStore', '$scope', '$timeout'],

  props: {
    'mappingPath': '<',
  },

  data: {
    // mapping: {},
    mappingChains: [],
  },

  created: function() {
    // this.mapping = this.widgetStore.actions.getMapping(this.mappingPath);
    this.mappingChains = this.widgetStore.actions.getMappingChains(this.mappingPath);
  },

  computed: {

  },

  methods: {
  },

  template,

});
