import * as templates from './templates';
import { Component } from 'vue-style-angularjs';
import { widgetMixin } from '../../mixins/widget.mixin';
import changeCase from 'change-case';
import _ from 'lodash';

export const TextWidgetComponent = new Component({
  mixins: [widgetMixin],

  require: {
    ngModel: '^ngModel'
  },

  injectors: ['$scope'],

  data: {
    value: '',
  },

  props: {
    options: '<',
  },

  created: function() {
    this.ngModel.$render = () => {
      this.value = this.ngModel.$viewValue;
    };

    this.$scope.$watch('vm.value', (value) => {
      this.ngModel.$setViewValue(value);
    });

    this.ngModel.$validators.startWithA = function(modelValue, viewValue) {
      if (_.isString(viewValue)) {
        return (viewValue || '').startsWith('a');
      }

      return true;
    }
  },

  template: function($element, $attrs, $stateParams, widgetStore) {
    const { mappingPath, viewType } = $attrs;
    const mapping = widgetStore.actions.getMapping(mappingPath);

    const showExpression = mapping.showExpression;
    const template = templates[`${changeCase.camelCase(viewType)}Template`] || templates.textTemplate;

    return widgetStore.actions.injectTemplateWithMapping(
      widgetStore.actions.injectTemplate(template, { showExpression }), mapping
    );;
  }
});
