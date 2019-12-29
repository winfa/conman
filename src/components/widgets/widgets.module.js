import angular from 'angular';
import {
  ArrayWidgetComponnet,
  ArrayWidgetItemsComponent,
  ArrayWidgetItemDetailComponent
} from './array-widget';

import { ObjectWidgetComponent } from './object-widget/object-widget.component';
import { TextWidgetComponent } from './text-widget/text-widget.component';

export const ConmanWidgetsModule = angular
  .module('conman.widgets', [])
  .component('arrayWidget', ArrayWidgetComponnet)
  .component('arrayWidgetItems', ArrayWidgetItemsComponent)
  .component('arrayWidgetItemDetail', ArrayWidgetItemDetailComponent)
  .component('objectWidget', ObjectWidgetComponent)
  .component('textWidget', TextWidgetComponent)
