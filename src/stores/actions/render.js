import changeCase from 'change-case';
import _ from 'lodash';
import * as templates from '../../components/widgets/text-widget/templates'

function render(mapping) {
  const widgetName = getWidgetName(mapping.sourceType);
  const attributes = getWidgetAttributes(mapping);

  return createWidget(widgetName, attributes);
}

function renderWidget(mapping) {
  const sourceType = mapping.sourceType;
  const viewType = mapping.viewType;

  if (!isLeaf(mapping.sourceType)) return render(mapping);

  const showExpression = mapping.showExpression;
  const template = templates[`${changeCase.camelCase(viewType)}Template`] || templates.textTemplate;

  return injectTemplateWithMapping(
    injectTemplate(template, { showExpression }), mapping
  );;
}

function injectTemplate(template, data) {
  return Object.keys(data).reduce((currentTemplate, injectorKey) => {
    return currentTemplate.replace(new RegExp(`\\$${injectorKey}\\$`, 'g'), data[injectorKey])
  }, template);
}

function injectTemplateWithMapping(template, mapping) {
  let outputTemplate = template;

  if (mapping?.expressions) {
    const exprKeys = Object.keys(mapping?.expressions);

    exprKeys.forEach(exprKey => {
      outputTemplate = outputTemplate.replace(`$expressions.${exprKey}$`, mapping?.expressions[exprKey]);
    });

    outputTemplate = outputTemplate.replace(/vm\.mapping\.expressions\.(\w+)/, (match, f1) => {
      if(!mapping?.expressions?.[f1]) return '';

      return mapping?.expressions?.[f1];
    })
  }

  if (mapping.title) {
    outputTemplate = outputTemplate.replace(/\{\s*\{([^\}]*)\}\s*\}/, (match, f1) => {
      if (f1.includes('title')) {
        return mapping.title;
      }
    })
  }

  if (mapping.sourcePath) {
    const sourceProperty = convertPathToProperty(mapping.sourcePath);
    outputTemplate = outputTemplate.replace(/vm\.value/, (match, f1) => {
      return `vm.source['${sourceProperty}']`;
    });

    outputTemplate = outputTemplate.replace('ng-model', `name='${sourceProperty}' ng-model`);
  }

  outputTemplate = outputTemplate.replace(/vm\.mapping\.((\w+\.?)+)/, function(match, s1, s3) {
    return _.get(mapping, s1);
  });

  return outputTemplate;
}

function createWidgetWithMapping(mapping, subWidgets) {
  const widgetName = getWidgetName(mapping.sourceType);
  const attributes = getWidgetAttributes(mapping);

  return createWidget(widgetName, attributes, subWidgets);
}

function createWidget(widgetName, attributes, subWidgets) {
  const attributesHtml = createAttributesHtml(attributes);
  return `<${widgetName} ${attributesHtml}>${subWidgets}</${widgetName}>`;
}

function createAttributesHtml(attributes) {
  return Object.keys(attributes).reduce((previous, attrName) => {
    let attrValue = attributes[attrName];
    if (attrValue === undefined || attrValue === null) return previous;

    const hyphenAttrName = changeCase.hyphenCase(attrName);
    if ((typeof attrValue) === 'string') {
      attrValue = attrValue.replace(/['|"]/g, matcher=> '\\' + matcher);
    } else {
      attrValue = JSON.stringify(attrValue);
    }

    return `${previous} ${hyphenAttrName}='${attrValue}'`;
  }, '');
}

function getWidgetAttributes(mapping) {
  const { viewType, sourceType, sourcePath, mappingPath, title, description, display } = mapping;

  const attributes = {
    viewType,
    sourcePath,
    mappingPath,
    options: {
      title,
      description,
      display,
    },
  }

  if (isLeaf(sourceType) && sourcePath) {
    const propertyName = convertPathToProperty(sourcePath);
    attributes.ngModel = `vm.source.${propertyName}`;
  }

  return attributes;
}

function convertPathToProperty(path) {
  if (path && path.includes('.')) {
    return path.split('.').reverse()[0];
  }
  return path;
}

function isLeaf(type) {
  if (type === 'object' || type === 'array') {
    return false;
  }
  return true;
}

function getWidgetName(sourceType) {
  console.log(sourceType, 'sourceType called........');
  const hyphenCasedType = changeCase.hyphenCase(sourceType);

  if (hyphenCasedType === 'array') {
    return 'array-widget';
  }

  if (hyphenCasedType === 'object') {
    return 'object-widget';
  }

  return 'text-widget';
}

export {
  render,
  createWidgetWithMapping,
  createWidget,
  injectTemplate,
  injectTemplateWithMapping,
  convertPathToProperty,
  renderWidget,
};
