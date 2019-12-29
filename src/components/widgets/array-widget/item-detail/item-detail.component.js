import template from './item-detail.html';
import { Component } from 'vue-style-angularjs';
import { widgetMixin } from '../../../mixins/widget.mixin';

export const ArrayWidgetItemDetailComponent = new Component({
  mixins: [widgetMixin],

  props: {
    sourcePath: '<',
  },

  transclude: true,

  template: function($element, $attrs, $compile, widgetStore, $state, rootStore) {
    const { mappingPath, sourcePath } = $attrs;
    // const subTemplate = widgetStore.actions.getSubTemplatesByPath(mappingPath);
    // return widgetStore.actions.injectTemplate(template, { subTemplate });

    const mapping = widgetStore.actions.getMapping(mappingPath);
    const subTemplate = mapping.fields.map(subMapping => {
      const widgetView = rootStore.getters.getWidgetViewByPath(subMapping.mappingPath);
      return widgetView;
    }).join('');

    return widgetStore.actions.injectTemplate(template, { subTemplate });
  }
});
