import { Component } from 'vue-style-angularjs';
import { widgetMixin } from '../../mixins/widget.mixin';
import template from './setting-spirit.html';
import { getSettingModal } from '../setting-modal/setting-modal.component';
import './setting-spirit.css';

export function SettingSpiritDirective($timeout, widgetStore, $uibModal) {

  return {
    restrict: 'A',
    controllerAs: 'vm',
    transclude: true,
    bindToController: true,
    scope: {
      mappingPath: '<'
    },

    controller: function() {
      this.$onInit = () => {
        this.mapping = widgetStore.actions.getMapping(this.mappingPath);
      }

      this.open = () => {
        $uibModal.open(getSettingModal(this.mappingPath));
      }
    },

    link: function(scope, element, attrs, vm) {
      element[0].style.position = 'relative';
    },

    template: function($element, $attrs, $compile) {
      if(widgetStore.state.isSettingMode) {
        return template;
      }

      return '<ng-transclude></ng-transclude>';
    }
  }
}

