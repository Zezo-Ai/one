/* -------------------------------------------------------------------------- */
/* Copyright 2002-2025, OpenNebula Project, OpenNebula Systems                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */

define(function(require) {
  /*
    DEPENDENCIES
   */

  var Locale = require('utils/locale');
  var Config = require('sunstone-config');
  var QuotaDefaults = require('utils/quotas/quota-defaults');
  var QuotaWidgets = require('utils/quotas/quota-widgets');

  /*
    CONSTANTS
   */

  var TAB_ID = require('../tabId');
  var PANEL_ID = require('./quotas/panelId');
  var RESOURCE = "Group";
  var XML_ROOT = "GROUP";

  /*
    CONSTRUCTOR
   */

  function Panel(info) {
    this.title = Locale.tr("Quotas");
    this.icon = "fa-align-left";

    this.element = info[XML_ROOT];

    return this;
  }

  Panel.PANEL_ID = PANEL_ID;
  Panel.prototype.html = _html;
  Panel.prototype.setup = _setup;

  return Panel;

  /*
    FUNCTION DEFINITIONS
   */

  function _html() {
    return QuotaWidgets.initQuotasPanel(
      this.element,
      QuotaDefaults.getDefaultQuotas(RESOURCE),
      Config.isTabActionEnabled(TAB_ID, RESOURCE+".quotas_dialog"));
  }

  function _setup(context) {
    QuotaWidgets.setupQuotasPanel(
      this.element,
      context,
      Config.isTabActionEnabled(TAB_ID, RESOURCE+".quotas_dialog"),
      RESOURCE);

    return false;
  }
});
