/* -------------------------------------------------------------------------- */
/* Copyright 2002-2025, OpenNebula Project (OpenNebula.org), C12G Labs        */
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
  var Handlebars = require('hbs/handlebars');
  var Config = require('sunstone-config');

  var isProvisionTabEnabled = function(tabName, panel, options) {
    if (Config.isProvisionTabEnabled(tabName, panel)) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  };

  Handlebars.registerHelper('isProvisionTabEnabled', isProvisionTabEnabled);

  return isProvisionTabEnabled;
})
