# coding=utf-8
from __future__ import absolute_import

### (Don't forget to remove me)
# This is a basic skeleton for your plugin's __init__.py. You probably want to adjust the class name of your plugin
# as well as the plugin mixins it's subclassing from. This is really just a basic skeleton to get you started,
# defining your plugin as a template plugin.
#
# Take a look at the documentation on what other plugin mixins are available.

import octoprint.plugin
import octoprint.settings

class Right_SidebarPlugin(octoprint.plugin.StartupPlugin,
                      octoprint.plugin.TemplatePlugin,
                      octoprint.plugin.SettingsPlugin,
                      octoprint.plugin.AssetPlugin,
                      octoprint.plugin.ReloadNeedingPlugin):
    def get_assets(self):
        return dict(
            js=["js/right_sidebar.js"]
        )
        
    def get_settings_defaults(self):
        return dict(
            leftside="",
            rightside=""
        )

    def get_settings_version(self):
        return 1
 
    def get_template_configs(self):
        return [
            dict(type="settings", custom_bindings=True)
        ]
        
    def on_settings_save(self, data):
        octoprint.plugin.SettingsPlugin.on_settings_save(self, data)
        
    def get_update_information(self):
        return dict(
            systemcommandeditor=dict(
                displayName="Right Sidebar",
                displayVersion=self._plugin_version,

                # version check: github repository
                type="github_release",
                user="amsbr",
                repo="OctoPrint-Right-Sidebar",
                current=self._plugin_version,

                # update method: pip
                pip="https://github.com/amsbr/OctoPrint-Right-Sidebar/archive/{target_version}.zip"
            )
        )

__plugin_name__ = "Right Sidebar"

def __plugin_load__():
    global __plugin_implementation__
    __plugin_implementation__ = Right_SidebarPlugin()

    global __plugin_hooks__
    __plugin_hooks__ = {
        "octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information
    }
