import _ from 'lodash';
import {
  render,
  createWidget,
  injectTemplate,
  getSubTemplates,
  injectTemplateWithMapping,
  convertPathToProperty,
  renderWidget
 } from './actions/render';

import { convertToNewMapping, applyPath } from './actions/converter';
import { getNodeIndex, getItemIndex, getPathChains, getJsonPathes, getSchemaByJsonPath } from './actions/path';

export const WidgetStore = (preferenceService, $stateParams) => {
  const state = {};

  async function init(source) {
    if (!source) {
      source = {};
    }

    const mapping = await preferenceService.getContent({ name: 'form', version: '2.0.0', type: 'tn-light' });
    const schema = await preferenceService.getContent({ name: 'schema', version: '2.0.0', type: 'tn-light' });
    const systemData = await preferenceService.getContent({ name: 'system-data', version: '2.0.0', type: 'tn-light' });

    const pathSchemas = [{ path: '', schema }, ...getJsonPathes(schema, '')];

    // rootStore.dispatch('widgetMapping/init', mapping);

    applyPath(mapping);

    // const newMapping = convertToNewMapping(applyPath({
    //   "type": "list-group",
    //   "title": "",
    //   "fields": mapping
    // }));

    const isSettingMode = _.isEmpty(source);
    Object.assign(state, {
      source,
      mapping,
      schema,
      systemSettings: systemData,
      pathSchemas,
      isSettingMode
    });
  }

  const actions = {
    getWithDefault(path, defaultValue) {
      let result = actions.getSource(path);
      if (result === null || result === undefined) {
        actions.setSource(path, defaultValue);
      }

      return actions.getSource(path);
    },

    getSource(path) {
      if (!path) return undefined;

      if(path === 'root') return state.mapping
      return _.get(state.source, path);
    },

    setSource(path, value) {
      if (!path) return;

      return _.set(state.source, path, value);
    },

    getSchema(path) {
      return getSchemaByJsonPath(state.schema, path);
    },

    getMapping(path) {
      if(path === 'root' || path === '') return state.mapping
      if (!path) return undefined;

      return _.get(state.mapping, path);
    },

    getParentMapping(path) {
      if(path === 'root' || path === '') return state.mapping
      if (!path) return undefined;

      const parentPath = path.replace(/\.?fields\[\d*\]$/, '');
      return actions.getMapping(parentPath);
    },

    getMappingChains(path) {
      const pathChains = getPathChains(path);

      return pathChains.map(path => {
        const mapping = actions.getMapping(path);

        return {
          path,
          mapping,
        }
      });
    },

    setMapping(path, value) {
      if (!path) return;

      return _.set(state.mapping, path, value);
    },

    getSubTemplatesByPath(path) {
      const mapping = actions.getMapping(path);
      return (mapping?.fields || []).map(actions.render).join('') || '';
    },

    getSubTemplateByPathAndIndex(path, index) {
      const mapping = actions.getMapping(path);

      if (!mapping?.fields?.length) return '';
      return actions.render(mapping.fields[index]);
    },

    shouldShow(mapping, value) {
      if (!mapping.displayConfig) return true;

      const { stringValues, arrayLength, formula } = mapping.displayConfig;
      if (stringValues && stringValues.length) {
        if (!stringValues.includes(value)) {
          return false;
        }
      }

      if (formula) {
        return execFormula();
      }
    },

    updateMapping() {
      const { name, version, type } = {
        name: 'form',
        version: '2.0.0',
        type: 'tn-light'
      };

      return preferenceService.updateContent({ name, version, type }, JSON.stringify(state.mapping));
    },

    render,

    createWidget,

    getNodeIndex,

    getItemIndex,

    injectTemplate,

    injectTemplateWithMapping,

    convertPathToProperty,

    renderWidget,
  };

  function execFormula(formula, parentSource, rootSource) {
    const executableFormula = formula.replace(/\$\{parent\}/g, 'parentSource').replace(/\$\{root\}/g, 'rootSource')
    return eval(execFormula);
  }

  function applyState(vm, keys) {
    keys.forEach(key => {
      Object.defineProperty(vm, key, {
        get: function() {
          return state[key];
        }
      });
    });
  }

  return {
    init, state, actions, applyState
  }
};
