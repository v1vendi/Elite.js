var kbd_F1_pressed;
var kbd_F2_pressed;
var kbd_F3_pressed;
var kbd_F4_pressed;
var kbd_F5_pressed;
var kbd_F6_pressed;
var kbd_F7_pressed;
var kbd_F8_pressed;
var kbd_F9_pressed;
var kbd_F10_pressed;
var kbd_F11_pressed;
var kbd_F12_pressed;
var kbd_y_pressed;
var kbd_n_pressed;
var kbd_fire_pressed;
var kbd_ecm_pressed;
var kbd_energy_bomb_pressed;
var kbd_hyperspace_pressed;
var kbd_ctrl_pressed;
var kbd_jump_pressed;
var kbd_escape_pressed;
var kbd_dock_pressed;
var kbd_d_pressed;
var kbd_origin_pressed;
var kbd_find_pressed;
var kbd_fire_missile_pressed;
var kbd_target_missile_pressed;
var kbd_unarm_missile_pressed;
var kbd_pause_pressed;
var kbd_resume_pressed;
var kbd_inc_speed_pressed;
var kbd_dec_speed_pressed;
var kbd_up_pressed;
var kbd_down_pressed;
var kbd_left_pressed;
var kbd_right_pressed;
var kbd_enter_pressed;
var kbd_backspace_pressed;
var kbd_space_pressed;


function kbd_keyboard_startup ()
{
    //	set_keyboard_rate(2000, 2000);
    return 0;
}

function kbd_keyboard_shutdown ()
{
    return 0;
}

function kbd_poll_keyboard ()
{
    poll_keyboard();

    kbd_F1_pressed = key[KEY_F1];
    kbd_F2_pressed = key[KEY_F2];
    kbd_F3_pressed = key[KEY_F3];
    kbd_F4_pressed = key[KEY_F4];
    kbd_F5_pressed = key[KEY_F5];
    kbd_F6_pressed = key[KEY_F6];
    kbd_F7_pressed = key[KEY_F7];
    kbd_F8_pressed = key[KEY_F8];
    kbd_F9_pressed = key[KEY_F9];
    kbd_F10_pressed = key[KEY_F10];
    kbd_F11_pressed = key[KEY_F11];
    kbd_F12_pressed = key[KEY_F12];

    kbd_y_pressed = key[KEY_Y];
    kbd_n_pressed = key[KEY_N];

    kbd_fire_pressed = key[KEY_A];
    kbd_ecm_pressed = key[KEY_E];
    kbd_energy_bomb_pressed = key[KEY_TAB];
    kbd_hyperspace_pressed = key[KEY_H];
    kbd_ctrl_pressed = (key[KEY_LCONTROL]) || (key[KEY_RCONTROL]);
    kbd_jump_pressed = key[KEY_J];
    kbd_escape_pressed = key[KEY_ESC];

    kbd_dock_pressed = key[KEY_C];
    kbd_d_pressed = key[KEY_D];
    kbd_origin_pressed = key[KEY_O];
    kbd_find_pressed = key[KEY_F];

    kbd_fire_missile_pressed = key[KEY_M];
    kbd_target_missile_pressed = key[KEY_T];
    kbd_unarm_missile_pressed = key[KEY_U];
	
    kbd_pause_pressed = key[KEY_P];
    kbd_resume_pressed = key[KEY_R];
	
    kbd_inc_speed_pressed = key[KEY_SPACE];
    kbd_dec_speed_pressed = key[KEY_SLASH];
	
    kbd_up_pressed = key[KEY_S] || key[KEY_UP];
    kbd_down_pressed = key[KEY_X] || key[KEY_DOWN];
    kbd_left_pressed = key[KEY_COMMA] || key[KEY_LEFT];
    kbd_right_pressed = key[KEY_STOP] || key[KEY_RIGHT];
	
    kbd_enter_pressed = key[KEY_ENTER];
    kbd_backspace_pressed = key[KEY_BACKSPACE];
    kbd_space_pressed = key[KEY_SPACE];

    while (keypressed())
        readkey();
}


function kbd_read_key ()
{
    var keynum;
    var keycode;
    var keyasc;

    kbd_enter_pressed = 0;
    kbd_backspace_pressed = 0;
	
    keynum = readkey();
    keycode = keynum >> 8;
    keyasc = keynum & 255;

    if (keycode == KEY_ENTER)
    {
        kbd_enter_pressed = 1;
        return 0;
    } 

    if (keycode == KEY_BACKSPACE)
    {
        kbd_backspace_pressed = 1;
        return 0;
    } 

    return keyasc;
}


function kbd_clear_key_buffer ()
{
    while (keypressed())
        readkey();
}