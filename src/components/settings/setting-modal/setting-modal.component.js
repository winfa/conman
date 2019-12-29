import template from './setting-modal.html';
import * as monaco from 'monaco-editor';
// import '../../../../assets/images/code.png';
import _ from 'lodash';

export const getSettingModal = (mappingPath) => {

  return {
    animation: true,
    ariaLabelledBy: 'Title',
    ariaDescribedBy: 'Body',

    template,
    controllerAs: 'vm',

    controller: class SettingModalComponnet {
      constructor(widgetStore, $state, $scope, $timeout, $uibModalInstance) {
        this.widgetStore = widgetStore;
        this.$state = $state;
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$uibModalInstance = $uibModalInstance;

        this.mapping = {};
        this.mappingPath = mappingPath;
      }

      $onInit() {
        this.mapping = this.widgetStore.actions.getMapping(this.mappingPath);
      }

      saveMapping() {
        this.widgetStore.actions.updateMapping();
        this.$uibModalInstance.close(true);
      }

      close() {
        this.$uibModalInstance.close(true);
      }

    }
  }
}
