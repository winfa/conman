import listGroupTemplate from './templates/list-group.html';
import tabSetTemplate from './templates/tab-set.html';
import { Component } from 'vue-style-angularjs';
import { widgetMixin } from '../../mixins/widget.mixin';

export const ObjectWidgetComponent = new Component({
  mixins: [widgetMixin],

  injectors: ['$state', '$scope'],

  data: {
    queryPath: '',
    activeIndex: 0,
  },

  created: function() {
    this.queryPath = this.$state.params.path;
    this.activeIndex = this.widgetStore.actions.getNodeIndex(this.queryPath, this.mappingPath);

    this.formName = `object_${btoa(this.mappingPath)}`;
  },

  computed: {
    activeSubMapping: function() {
      return this.mapping.fields[this.activeIndex];
    },

    activeSubMappingPath: function() {
      return `${this.mappingPath}[${this.activeIndex}]`
    },

    activeChildName: function() {
      return this.widgetStore.actions.convertPathToProperty(this.activeSubMapping.sourcePath);
    }
  },

  methods: {
    isActive: function(index) {
      return this.activeIndex === index;
    },
  },

  template: function($element, $attrs, $stateParams, widgetStore, rootStore) {
    const { mappingPath, sourcePath, viewType } = $attrs;

    const activeIndex = widgetStore.actions.getNodeIndex($stateParams.path, mappingPath);
    const subTemplate = widgetStore.actions.getSubTemplateByPathAndIndex(mappingPath, activeIndex);
    const mapping = widgetStore.actions.getMapping(mappingPath);

    if (viewType === 'tab-set' || viewType === 'tab') {
      return widgetStore.actions.injectTemplate(tabSetTemplate, { subTemplate, mappingPath, sourcePath });
    }

    if (viewType === 'list-group') {
      return widgetStore.actions.injectTemplate(listGroupTemplate, { subTemplate, mappingPath, sourcePath });
    }

    const subTemplates = mapping.fields.map(subMapping => {
      const widgetView = rootStore.getters.getWidgetViewByPath(subMapping.mappingPath);
      return widgetView;
    }).join('');

    const formName = `object_${btoa(mappingPath)}`;
    return `<div setting-spirit ng-form="${formName}" mapping-path='vm.mapping.mappingPath'>
      {{ vm.$scope[vm.formName].$error }}
      ${subTemplates}
    </div>`
  }

});
