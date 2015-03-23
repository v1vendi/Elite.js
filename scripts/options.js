var hilite_item;

var NUM_OPTIONS = 4
var NUM_SETTINGS = 6

var OPTION_BAR_WIDTH = 400
var OPTION_BAR_HEIGHT = 15

function option(text, docked_only) {
    this.text = text;
    this.docked_only = docked_only;
};

var option_list =
[
	new option("Save Commander", 1),
	new option("Load Commander", 1),
	new option("Game Settings", 0),
	new option("Quit", 0)
];

function setting(name, value) {
    this.name = name;
    this.value = value;
};

setting_list = [
	new setting("Graphics:", ["Solid", "Wireframe", "", "", ""]),
	new setting("Anti Alias:", ["Off", "On", "", "", ""]),
	new setting("Planet Style:", ["Wireframe", "Green", "SNES", "Fractal", ""]),
	new setting("Planet Desc.:", ["BBC", "MSX", "", "", ""]),
	new setting("Instant Dock:", ["Off", "On", "", "", ""]),
	new setting("Save Settings", ["", "", "", "", ""])
];

function quit_screen() {
    current_screen = SCR_QUIT;

    gfx_clear_display();
    gfx_display_centre_text(10, "GAME OPTIONS", 140, GFX_COL_GOLD);
    gfx_draw_line(0, 36, 511, 36);

    gfx_display_centre_text(175, "QUIT GAME (Y/N)?", 140, GFX_COL_GOLD);
}





function display_setting_item(item) {
    var x, y;
    var v;

    if (item == (NUM_SETTINGS - 1)) {
        y = ((NUM_SETTINGS + 1) / 2) * 30 + 96 + 32;
        gfx_display_centre_text(y, setting_list[item].name, 120, GFX_COL_WHITE);
        return;
    }

    switch (item) {
        case 0:
            v = wireframe;
            break;

        case 1:
            v = anti_alias_gfx;
            break;

        case 2:
            v = planet_render_style;
            break;

        case 3:
            v = hoopy_casinos;
            break;

        case 4:
            v = instant_dock;
            break;

        default:
            v = 0;
            break;
    }

    x = (item & 1) * 250 + 32;
    y = (item / 2) * 30 + 96;

    gfx_display_colour_text(x, y, setting_list[item].name, GFX_COL_WHITE);
    gfx_display_colour_text(x + 120, y, setting_list[item].value[v], GFX_COL_WHITE);
}


function highlight_setting(item) {
    var x, y;
    var width;

    if ((hilite_item != -1) && (hilite_item != item)) {
        if (hilite_item == (NUM_SETTINGS - 1)) {
            x = GFX_X_CENTRE - (OPTION_BAR_WIDTH / 2);
            y = ((NUM_SETTINGS + 1) / 2) * 30 + 96 + 32;
            width = OPTION_BAR_WIDTH;
        }
        else {
            x = (hilite_item & 1) * 250 + 32 + 120;
            y = (hilite_item / 2) * 30 + 96;
            width = 100;
        }

        gfx_clear_area(x, y, x + width, y + OPTION_BAR_HEIGHT);
        display_setting_item(hilite_item);
    }

    if (item == (NUM_SETTINGS - 1)) {
        x = GFX_X_CENTRE - (OPTION_BAR_WIDTH / 2);
        y = ((NUM_SETTINGS + 1) / 2) * 30 + 96 + 32;
        width = OPTION_BAR_WIDTH;
    }
    else {
        x = (item & 1) * 250 + 32 + 120;
        y = (item / 2) * 30 + 96;
        width = 100;
    }

    gfx_draw_rectangle(x, y, x + width, y + OPTION_BAR_HEIGHT, GFX_COL_DARK_RED);
    display_setting_item(item);
    hilite_item = item;
}



function select_left_setting() {
    if ((hilite_item & 1) != 0)
        highlight_setting(hilite_item - 1);
}

function select_right_setting() {
    if (((hilite_item & 1) == 0) && (hilite_item < (NUM_SETTINGS - 1)))
        highlight_setting(hilite_item + 1);
}


function select_up_setting() {
    if (hilite_item == (NUM_SETTINGS - 1)) {
        highlight_setting(NUM_SETTINGS - 2);
        return;
    }

    if (hilite_item > 1)
        highlight_setting(hilite_item - 2);
}


function select_down_setting() {
    if (hilite_item == (NUM_SETTINGS - 2)) {
        highlight_setting(NUM_SETTINGS - 1);
        return;
    }

    if (hilite_item < (NUM_SETTINGS - 2))
        highlight_setting(hilite_item + 2);
}

function toggle_setting() {
    if (hilite_item == (NUM_SETTINGS - 1)) {
        write_config_file();
        display_options();
        return;
    }

    switch (hilite_item) {
        case 0:
            wireframe ^= 1;
            break;

        case 1:
            anti_alias_gfx ^= 1;
            break;

        case 2:
            planet_render_style = (planet_render_style + 1) % 4;
            break;

        case 3:
            hoopy_casinos ^= 1;
            break;

        case 4:
            instant_dock ^= 1;
            break;
    }

    highlight_setting(hilite_item);
}


function game_settings_screen() {
    var i;

    current_screen = SCR_SETTINGS;

    gfx_clear_display();
    gfx_display_centre_text(10, "GAME SETTINGS", 140, GFX_COL_GOLD);
    gfx_draw_line(0, 36, 511, 36);

    for (i = 0; i < NUM_SETTINGS; i++) {
        display_setting_item(i);
    }

    hilite_item = -1;
    highlight_setting(0);
}


function display_option_item(i) {
    var y;
    var col;

    y = (384 - (30 * NUM_OPTIONS)) / 2;
    y += i * 30;
    col = ((!docked) && option_list[i].docked_only) ? GFX_COL_GREY_1 : GFX_COL_WHITE;

    gfx_display_centre_text(y, option_list[i].text, 120, col);
}


function highlight_option(i) {
    var y;
    var x;

    if ((hilite_item != -1) && (hilite_item != i)) {
        x = GFX_X_CENTRE - (OPTION_BAR_WIDTH / 2);
        y = (384 - (30 * NUM_OPTIONS)) / 2;
        y += hilite_item * 30;
        gfx_clear_area(x, y, x + OPTION_BAR_WIDTH, y + OPTION_BAR_HEIGHT);
        display_option_item(hilite_item);
    }

    x = GFX_X_CENTRE - (OPTION_BAR_WIDTH / 2);
    y = (384 - (30 * NUM_OPTIONS)) / 2;
    y += i * 30;

    gfx_draw_rectangle(x, y, x + OPTION_BAR_WIDTH, y + OPTION_BAR_HEIGHT,
                        GFX_COL_DARK_RED);
    display_option_item(i);

    hilite_item = i;
}

function select_previous_option() {
    if (hilite_item > 0)
        highlight_option(hilite_item - 1);
}

function select_next_option() {
    if (hilite_item < (NUM_OPTIONS - 1))
        highlight_option(hilite_item + 1);
}


function do_option() {
    if ((!docked) && option_list[hilite_item].docked_only)
        return;

    switch (hilite_item) {
        case 0:
            save_commander_screen();
            break;

        case 1:
            load_commander_screen();
            display_commander_status();
            break;

        case 2:
            game_settings_screen();
            break;

        case 3:
            quit_screen();
            break;
    }
}


function display_options() {
    var i;

    current_screen = SCR_OPTIONS;

    gfx_clear_display();
    gfx_display_centre_text(10, "GAME OPTIONS", 140, GFX_COL_GOLD);
    gfx_draw_line(0, 36, 511, 36);
    gfx_display_centre_text(300, "Version: Release 1.0", 120, GFX_COL_WHITE);
    gfx_display_centre_text(320, "www.newkind.co.uk", 120, GFX_COL_WHITE);
    gfx_display_centre_text(340, "Written by Christian Pinder 1999-2001", 120, GFX_COL_WHITE);
    gfx_display_centre_text(360, "Based on original code by Ian Bell & David Braben", 120, GFX_COL_WHITE);

    for (i = 0; i < NUM_OPTIONS; i++)
        display_option_item(i);

    hilite_item = -1;
    highlight_option(0);
}
