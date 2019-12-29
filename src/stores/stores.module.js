import { WidgetMappingStore } from './widget-mapping.store';
import { WidgetViewStore } from './widget-view.store';
import { RootStore } from './root.store';

export const StoresModule = angular
.module('conman.stores', [])
.factory('widgetStore', WidgetStore)
.factory('rootStore', RootStore)
.factory('widgetMappingStore', WidgetMappingStore)
.factory('widgetViewStore', WidgetViewStore)
