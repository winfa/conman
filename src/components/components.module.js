import angular from 'angular';
import { SettingsModule } from './settings/settings.module';
import { WidgetModule } from './widgets/widgets.module';

export const ComponentsModule = angular
  .module('conman.components', [
    SettingsModule.name,
    WidgetModule.name,
  ])
