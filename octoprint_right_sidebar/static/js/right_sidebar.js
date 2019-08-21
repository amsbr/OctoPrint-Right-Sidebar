/**
* Created by Anderson Silva on 16.08.2019.
*/
$(function() {
    function RightSidebarViewModel(parameters) {
        var self = this;
 
        self.settings = parameters[0];

		self.leftside = new ko.observable("");
        self.rightside = new ko.observable("");

        self.onBeforeBinding = function() {
            self.leftside(self.settings.settings.plugins.right_sidebar.leftside());
            self.rightside(self.settings.settings.plugins.right_sidebar.rightside());
        };

        self.onSettingsBeforeSave = function() {
            self.settings.settings.plugins.right_sidebar.leftside(self.leftside());
            self.settings.settings.plugins.right_sidebar.rightside(self.rightside());
        };

        self.onEventSettingsUpdated = function(payload) {
            self.leftside(self.settings.settings.plugins.right_sidebar.leftside());
            self.rightside(self.settings.settings.plugins.right_sidebar.rightside());

            $.each( self.leftside().split(" "), function(index, value) {
                if (value != "") {
                    $('#' + value).appendTo($("#leftsidebar"));
                }
            });

            $.each( self.rightside().split(" "), function(index, value) {
                if (value != "") {
                    $('#' + value).appendTo($("#rightsidebar"));
                }
            });
        };

        self.onStartup = function() {
            // Apply fluid
            $(".container.octoprint-container").addClass("container-fluid").removeClass("container");
            $(".container").addClass("container-fluid").removeClass("container");
            $(".container-fluid.octoprint-container").find(".row").addClass("row-fluid").removeClass("row").attr("id", "rowfluid");

            // Add sidebar
            $("#rowfluid").find(".accordion.span4").addClass("span3").removeClass("span4").attr("id", "leftsidebar");
            $("#rowfluid").find(".tabbable.span8").addClass("span6").removeClass("span8");
            $("#rowfluid").append("<div id='rightsidebar' class='accordion span3'></div>");
        };

        self.onStartupComplete = function() {
            console.debug('Move Sidebar Panels');

            // Adjust GCode Tab
            $("#gcode").find("#canvas_container").addClass("text-center");

            // Check empty config
            if (self.leftside() == "" && self.rightside() == "") {
                var left_values = '';
                $("#leftsidebar").find(".accordion-group").each(function() {
                    sideid = $(this).attr("id");
                    if (sideid != 'state_wrapper')
                        left_values += sideid + ' ';
                });
                var right_values = 'state_wrapper ';

                self.rightside(right_values);
                self.leftside(left_values);        
            }


            // Move to right sidebar
            $.each( self.rightside().split(" "), function(index, value) {
                if (value != "") {
                    $('#' + value).appendTo($("#rightsidebar"));
                }
            });

            // Populate Left Select
            $("#leftsidebar").find(".accordion-group").each(function() {
                sideid = $(this).attr("id");
                sidename = $(this).find(".accordion-heading").find(".accordion-toggle").text().trim();
                $("#setting_leftside_list").append(new Option(sidename, sideid));
            });

            // Populate Right Select
            $("#rightsidebar").find(".accordion-group").each(function() {
                sideid = $(this).attr("id");
                sidename = $(this).find(".accordion-heading").find(".accordion-toggle").text().trim();
                $("#setting_rightside_list").append(new Option(sidename, sideid));
            });
        };

        self.moveRightSide = function() {
            console.debug('toRight');
            var right_values = self.rightside();
            var left_values = self.leftside();
            $("#setting_leftside_list").children('option:selected').each(function() {
                $("#setting_rightside_list").append(new Option($(this).text(), $(this).val()));
                right_values += $(this).val() + ' ';
                left_values = left_values.replace($(this).val() + ' ', '');
            });
            $("#setting_leftside_list").children('option:selected').remove();
            self.rightside(right_values);
            self.leftside(left_values);
        };

        self.moveLeftSide = function() {
            console.debug('toLeft');
            var right_values = self.rightside();
            var left_values = self.leftside();
            $("#setting_rightside_list").children('option:selected').each(function() {
                $("#setting_leftside_list").append(new Option($(this).text(), $(this).val()));
                left_values += $(this).val() + ' ';
                right_values = right_values.replace($(this).val() + ' ', '');
            });
            $("#setting_rightside_list").children('option:selected').remove();
            self.rightside(right_values);
            self.leftside(left_values);
        };      
    }

    OCTOPRINT_VIEWMODELS.push([
        RightSidebarViewModel,
        ["settingsViewModel"],
        ["#settings_plugin_right_sidebar_form"]
    ]);
});
