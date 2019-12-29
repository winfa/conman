import './templates/list.css';
import listTemplate from './templates/list.html';

export const ArrayWidgetComponnet = {
  controllerAs: 'vm',
  bindToController: true,
  transclude: true,
  bindings: {
    viewType: '@',
    sourcePath: '@',
    mappingPath: '@',
    options: '<',
  },

  controller: class ArrayWidgetCotroller {
    constructor($timeout, $state, widgetStore) {
      this.widgetStore = widgetStore;

      this.selectedIndex = null;
      this.queryPath = $state.params.path;
    }

    $onInit() {
      this.selectedIndex = this.widgetStore.actions.getItemIndex(this.queryPath, this.mappingPath);
    }

    get itemSourcePath() {
      return `${this.sourcePath}[${this.selectedIndex}]`;
    }

    get showList() {
      return this.selectedIndex === null || this.selectedIndex === undefined;
    }
  },

  template: function($element, $attrs, $compile, widgetStore) {
    const { mappingPath, sourcePath } = $attrs;
    const subTemplate = widgetStore.actions.getSubTemplatesByPath(mappingPath);

    // const subTemplates = mapping.fields.map(subMapping => {
    //   return rootStore.getters.getWidgetViewByPath(subMapping.mappingPath);
    // }).join('');

    return widgetStore.actions.injectTemplate(listTemplate, { subTemplate, mappingPath, sourcePath });
  }
}

function compile(model, template) {
  return (template || '').replace(/\{\s?\{\s?(\w+)\s?\}\s?\}/, (matcher, s1) => {
    if (s1) {
      return model[s1];
    }
    return matcher;
  });
}
