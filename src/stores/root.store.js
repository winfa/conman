import { commit, dispatch } from 'vue-style-angularjs';

const injectNames = ['widgetMappingStore', 'widgetViewStore'];

const RootStore = function (...injects) {
  const rootStore = {};
  const stores = injects;

  Object.defineProperty(rootStore, 'state', {
    get() {
      return Object.assign({}, ...stores.map(store => store.state));
    },

    set(value) {
      console.log(value, 'tring to set state');
    }
  });

  Object.defineProperty(rootStore, 'getters', {
    get() {
      return Object.assign({}, ...stores.map(store => store.getters));
    },
  });

  const dispatch = (actionPath, ...params) => {
    const [storeName, actionName] = actionPath.split('/');
    const store = getInjectedStore(storeName, injectNames, injects);

    if(!store) {
      throw new Error(`${actionPath} is not a valid store path`);
    }

    return store.actions[actionName]({
      commit: commit.bind(store),
      state: store.state,
      dispatch: dispatch.bind(store),
      rootState: rootStore.state,
    }, ...params);
  }

  return {
    dispatch,
    state: rootStore.state,
    getters: rootStore.getters,
  };
}

function getInjectedStore(storeName, injectNames, injects) {
  const storeIndex = injectNames.findIndex(name => name.startsWith(storeName));
  return storeIndex !== -1 ? injects[storeIndex] : null;
}

RootStore.$inject = injectNames;

export { RootStore };
