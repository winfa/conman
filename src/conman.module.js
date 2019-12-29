import angular from 'angular';
import { ComponentsModule } from './components/components.module';
import { StoresModule } from './stores/stores.module';

export const WidgetsModule = angular
  .module('conman', [
    ComponentsModule.name,
    StoresModule.name,
  ])
