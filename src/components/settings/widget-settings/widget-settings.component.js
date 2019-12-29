import { Component } from 'vue-style-angularjs';
import template from './widget-settings.html';
import _ from 'lodash';

export const widgetSettingsComponent = new Component({
  injectors: ['$state', 'widgetStore', '$uibModal', '$scope', '$timeout'],

  props: {
    'mappingPath': '<',
  },

  data: {
    mapping: {},
    parentMapping: {},
    parentSchema: [],
    directChildSchemas: [],
    modalInstance: {},
    mappingChains: [],
    pathSchemas: [],
    schemaPathes: [],
  },

  created: function() {
    this.pathSchemas = this.widgetStore.state.pathSchemas;
    this.mapping = this.widgetStore.actions.getMapping(this.mappingPath);
    this.parentMapping = this.widgetStore.actions.getParentMapping(this.mappingPath);
    this.directChildSchemas = this.getDirectChildPathSchemas(this.pathSchemas, this.parentMapping.sourcePath);

    this.mappingChains = this.widgetStore.actions.getMappingChains(this.mappingPath);
    this.schemaPathes = this.widgetStore.state.pathSchemas.map(pathSchema => pathSchema.path);

    this.mapping.expressions = this.mapping.expressions || {};
  },

  computed: {
    hasChildren: function() {
      return !!this.mapping?.fields?.length;
    },

    schema: function() {
      return this.getSchemaByPath(this.mapping?.sourcePath)?.schema;
    },

    availableViewTypes: function() {
      return this.getAvailableViewTypes(this.schema?.type);
    },

    overview: function() {
      if(!this.mapping?.fragments?.itemOverview) {
        _.set(this.mapping, 'fragments.itemOverview', '')
      }

      return this.mapping?.fragments?.itemOverview;
    }

    // directChildSchemas: function() {
    //   if (!_.isString(this.parentMapping?.sourcePath)) return this.pathSchemas;
    //   return this.getDirectChildPathSchemas(this.pathSchemas, this.parentMapping.sourcePath);
    // }
  },

  methods: {
    getSchemaByPath: function(path) {
      if (!path) return {};
      return this.pathSchemas.find(pathSchema => pathSchema.path === path);
    },

    filterByPath: function(filter) {
      return this.pathSchemas.filter(pathSchema => pathSchema.path.includes(filter));
    },

    groupSchemaPathByParent: function(pathSchema) {
      if (!_.isString(this.parentMapping?.sourcePath)) return '';

      if (this.isDirectChildPath(pathSchema.path, this.parentMapping.sourcePath)) {
        return 'Relative Pathes: ';
      }

      return 'Global Pathes: ';
    },

    isDirectChildPath: function(path, parentPath) {
      if (!_.isString(path) || !_.isString(parentPath)) return false;

      if(path === parentPath) return true;

      const formatedParentPath = parentPath.replace(/[\.|\[|\]]/g, (match) => { return '/' + match });
      return new RegExp(`^${formatedParentPath}(\\.)?[^\\.]+$`).test(path);
    },

    getDirectChildPathSchemas: function(pathSchemas, parentSourcePath) {
      const schemas = pathSchemas.filter(pathSchema => {
        return this.isDirectChildPath(pathSchema.path, parentSourcePath);
      });

      return schemas;
    },

    getAvailableViewTypes: function(sourceType) {
      if (!sourceType) return [];

      if (sourceType === 'array') {
        return ['array'];
      }

      if (sourceType === 'object') {
        return ['list-group', 'tab', 'pure-object'];
      }

      return ['checkbox', 'color', 'image-upload', 'label', 'link', 'text', 'textarea'];
    }
  },

  template,
});
