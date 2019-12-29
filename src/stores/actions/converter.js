function convertToNewMapping(mapping) {
  const newMapping = {
    sourcePath: mapping.binding,
    mappingPath: mapping.path,
    viewType: getType(mapping),
    sourceType: getSourceType(mapping.type),
    required: mapping.required,
    description: mapping.description,
    display: mapping.formula,
    title: mapping.title,
    fragments: {},
  };

  if(mapping.displayName) {
    const propertyName = convertPathToProperty(mapping.displayName);
    newMapping.fragments['itemOverview'] = `{{ vm.source[$index]["${propertyName}"] }}`;
  }

  if (mapping.displayConfig?.formula) {
    newMapping.showExpression = convertFormulaToExpression(mapping.displayConfig?.formula);
  }

  if (mapping.fields && mapping.fields.length) {
    newMapping.fields = (mapping.fields || []).map((subMapping, index) => {
      return convertToNewMapping(subMapping);
    });
  }

  return newMapping;
}

function convertFormulaToExpression(formula) {
  return formula.replace(/\$\{root\}/g, 'vm.rootSource')
    .replace(/\@parent\{([\w|\s]+)\}\.value\.value/g, function(matcher, s1) {
      return 'vm.source[vm.getPropertyByTitle(s1)]';
    })
}

function applyPath(mapping, path = '') {
  mapping.mappingPath = path;

  (mapping.fields || []).forEach((subMapping, index) => {
    const subPath = path ? `${path}.fields[${index}]` : `fields[${index}]`;
    applyPath(subMapping, subPath)
  });

  return mapping;
}

function convertPathToProperty(path) {
  if (path && path.includes('.')) {
    return path.split('.').reverse()[0];
  }
}

function getType(mapping) {
  if (mapping.type === 'text' && mapping.inputType === 'color') {
    return 'color';
  }

  if (mapping.title === 'Swimlanes' && mapping.type === "customised-array") {
    return 'distinct-array';
  }

  if (mapping.type === 'customised-array' || mapping.type === 'array'
      || mapping.type === 'indelible-array') {

    return 'array';
  }

  return mapping.type;
}

function getSourceType(type) {
  if (type === 'customised-array' || type === 'array'
      || type === 'indelible-array') {

    return 'array';
  }

  if (type === 'object' || type === 'tab-set' || type === 'tab' || type === 'tab-item' || type === 'list-group') {
    return 'object';
  }

  return 'text';
}

function mapProps(mapping) {
  const props = {
    cgTitle: mapping.title, // string
    cgDescription: mapping.description, // string
    cgType: mapping.type,
    cgSourcePath: mapping.binding, // string JSONPath
    cgMappingPath: mapping.path,
    cgReqired: mapping.required, // boolean
    cgDisplay: mapping.formula,
    cgType: getType(mapping),
  };

  if (mapping.displayName) {
    props.cgOverview = `{{ ${convertPathToProperty(mapping.displayName)} }}`;
  }

  if (isLeaf(mapping.type) && mapping.binding) {
    const propertyName = convertPathToProperty(mapping.binding);
    props.ngModel = `vm.model.${propertyName}`;
  }

  return props;
}

export {
  convertToNewMapping, applyPath
}

