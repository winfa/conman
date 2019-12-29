function getNodeIndex(fullPath, nodePath) {
  if (fullPath === undefined || nodePath === undefined) return 0;
  fullPath = fullPath.replace(/\{\d*\}/g, '');
  nodePath = nodePath.replace(/\{\d*\}/g, '');

  const regResult = new RegExp(nodePath.replace(/[\[|\]|\.]/g, (match) => { return '\\' + match }) + '\\.?fields\\[(\\d+)\\].*').exec(fullPath);
  return regResult ? Number.parseInt(regResult[1]) : 0;
}

function getItemIndex(fullPath, arrayPath) {
  if (fullPath === undefined || arrayPath === undefined) return null;

  const regResult = new RegExp(arrayPath.replace(/[\[|\]|\.]/g, (match) => { return '\\' + match}) + '\\{(\\d+)\\}.*').exec(fullPath);
  return regResult ? Number.parseInt(regResult[1]) : null;
}

function getPathChains(mappingPath) {
  if(mappingPath === '' || mappingPath === 'root') return [''];

  const pathChains = [];
  mappingPath.split('.').reduce((previousPath, piece) => {
    pathChains.push(previousPath);

    if (!previousPath) return piece;
    return `${previousPath}.${piece}`;
  }, '');

  pathChains.push(mappingPath);

  return pathChains;
}

function getJsonPathes(schema, previousPath) {
  const subSchemas = schema?.properties || schema?.items?.properties;
  if (_.isEmpty(subSchemas)) return [];

  return Object.keys(subSchemas).reduce((jsonPathes, key) => {
    const subSchema = subSchemas[key];
    const split = subSchema.items ? '[].' : '.';
    const currentPath = previousPath === '' ? key : `${previousPath}${split}${key}`;

    jsonPathes.push({
      path: currentPath,
      schema: subSchema,
    });

    if(subSchema.properties || subSchema.items) {
      const subJsonPathes = getJsonPathes(subSchema, currentPath);
      return [...jsonPathes, ...subJsonPathes];
    }

    return jsonPathes;
  }, []);
}

function getSchemaByJsonPath(schema, jsonPath) {
  jsonPath.split('.').reduce((currentSchema, key) => {
    if(key.includes('[]')) {
      const pureKey = key.replace('[]', '');
      return currentSchema.items.properties[pureKey];
    }
    return currentSchema.properties[pureKey];
  }, schema);
}

export {
  getNodeIndex, getItemIndex, getPathChains, getJsonPathes, getSchemaByJsonPath
}
