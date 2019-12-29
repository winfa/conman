import angular from 'angular';

import { widgetSettingsComponent } from './widget-settings/widget-settings.component';
import { ChildrenSettingComponent } from './children-setting/children-setting.component';
import { PathChainsComponent } from './path-chains/path-chains.component';

import { SettingSpiritDirective } from './setting-spirit/setting-spirit.directive';

export const SettingsModule = angular
  .module('conman.settings', [])
  .component('widgetSettings', widgetSettingsComponent)
  .component('childrenSetting', ChildrenSettingComponent)
  .directive('settingSpirit', SettingSpiritDirective)
  .component('pathChains', PathChainsComponent)
