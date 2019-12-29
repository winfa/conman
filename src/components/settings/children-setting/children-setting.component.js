import { Component } from 'vue-style-angularjs';
import { widgetMixin } from '../../mixins/widget.mixin';
import template from './children-setting.html';
// import '../../../../assets/images/sort.svg';
import { getSettingModal } from '../setting-modal/setting-modal.component';

export const ChildrenSettingComponent = new Component({
  injectors: ['$state', 'widgetStore', '$uibModal', '$scope'],

  props: {
    'mappingPath': '<'
  },

  data: {
    mapping: {},
  },

  created: function() {
    this.mapping = this.widgetStore.actions.getMapping(this.mappingPath);

    this.sortableOptions = {
      dragEnd() {
      },
      accept(sourceItemHandleScope, destSortableScope) {
        return true;
      }
    };
  },

  computed: {
    childrenMappings: function() {
      return this.mapping.fields;
    }
  },

  methods: {
    removeItem: function(item) {
      this.mapping.fields = this.mapping.fields.filter(subMapping => subMapping.$$hashKey !== item.$$hashKey);
    },

    editItem: function(item) {
      this.$uibModal.open(getSettingModal(item.mappingPath));
    }
  },

  template,

});
