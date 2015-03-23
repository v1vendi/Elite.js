var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.font = '16px serif';

var GFX_SCALE = 2;
var GFX_X_CENTRE = 256;
var GFX_Y_CENTRE = 192;

var GFX_VIEW_TX = 1;
var GFX_VIEW_TY = 1;
var GFX_VIEW_BX = 509;
var GFX_VIEW_BY = 381;


var GFX_SCALE = 1;
var GFX_X_OFFSET = 0;
var GFX_Y_OFFSET = 0;
var GFX_X_CENTRE = 128;
var GFX_Y_CENTRE = 96;


var GFX_COL_BLACK = 'black';
var GFX_COL_DARK_RED = 28;
var GFX_COL_WHITE = 'white';
var GFX_COL_GOLD = 39;
var GFX_COL_RED = 'red';
var GFX_COL_CYAN = 11;

var GFX_COL_GREY_1 = 248;
var GFX_COL_GREY_2 = 235;
var GFX_COL_GREY_3 = 234;
var GFX_COL_GREY_4 = 237;

var GFX_COL_BLUE_1 = 45;
var GFX_COL_BLUE_2 = 46;
var GFX_COL_BLUE_3 = 133;
var GFX_COL_BLUE_4 = 4;

var GFX_COL_RED_3 = 1;
var GFX_COL_RED_4 = 71;

var GFX_COL_WHITE_2 = 242;
var GFX_COL_YELLOW_1 = 37;
var GFX_COL_YELLOW_2 = 39;
var GFX_COL_YELLOW_3 = 89;
var GFX_COL_YELLOW_4 = 160;
var GFX_COL_YELLOW_5 = 251;

var GFX_ORANGE_1 = 76;
var GFX_ORANGE_2 = 77;
var GFX_ORANGE_3 = 122;

var GFX_COL_GREEN_1 = 2;
var GFX_COL_GREEN_2 = 17;
var GFX_COL_GREEN_3 = 86;

var GFX_COL_PINK_1 = 183;

var IMG_GREEN_DOT = 1;
var IMG_RED_DOT = 2;
var IMG_BIG_S = 3;
var IMG_ELITE_TXT = 4;
var IMG_BIG_E = 5;
var IMG_DICE = 6;
var IMG_MISSILE_GREEN = 7;
var IMG_MISSILE_YELLOW = 8;
var IMG_MISSILE_RED = 9;
var IMG_BLAKE = 10;

var gfx_screen;
var frame_count;
var datafile;
var scanner_image;

var start_poly;
var total_polys;

var poly_chain = [];

function frame_timer() {
    frame_count++;
}

function gfx_graphics_startup() {
    var the_palette;
    var rv;

    datafile = load_datafile("elite.dat");
    if (!datafile) {
        set_gfx_mode(GFX_TEXT, 0, 0, 0, 0);
        return 1;
    }

    scanner_image = load_bitmap(scanner_filename, the_palette);
    if (!scanner_image) {
        return 1;
    }

    /* select the scanner palette */
    set_palette(the_palette);

    /* Create the screen buffer bitmap */
    gfx_screen = create_bitmap(SCREEN_W, SCREEN_H);

    clear(gfx_screen);

    blit(scanner_image, gfx_screen, 0, 0, GFX_X_OFFSET, 385 + GFX_Y_OFFSET, scanner_image.w, scanner_image.h);
    gfx_draw_line(0, 0, 0, 384);
    gfx_draw_line(0, 0, 511, 0);
    gfx_draw_line(511, 0, 511, 384);

    /* Install a timer to regulate the speed of the game... */

    frame_count = 0;
    install_int(frame_timer, speed_cap);

    return 0;
}

/*
 * Blit the back buffer to the screen.
 */

function gfx_update_screen() {
    while (frame_count < 1)
        rest(10);
    frame_count = 0;

    blit(gfx_screen, screen, GFX_X_OFFSET, GFX_Y_OFFSET, GFX_X_OFFSET, GFX_Y_OFFSET, 512, 512);
}

function gfx_plot_pixel(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
}
var gfx_fast_plot_pixel = gfx_plot_pixel;

function gfx_draw_filled_circle(x, y, radius, circle_colour) {

    ctx.beginPath();
    ctx.fillStyle = circle_colour;
    ctx.arc(x, y, radius, 0, 6)
    ctx.fill();
}

function trunc(x) {
    return (x) & ~65535;
}
function frac(x) {
    ((x) & 65535)
}
function invfrac(x) {
    (65535 - frac(x))
}

function gfx_draw_circle(x, y, radius, circle_colour) {
    ctx.beginPath();
    ctx.fillStyle = circle_colour;
    ctx.arc(x, y, radius, 0, 7)
    ctx.stroke();
}

function gfx_draw_line(x1, y1, x2, y2) {
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
}

function gfx_draw_colour_line(x1, y1, x2, y2, line_colour) {
    ctx.strokeStyle = line_colour;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
}

function gfx_draw_triangle(x1, y1, x2, y2, x3, y3, col) {
    ctx.strokeStyle = line_colour;
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.lineTo(x3,y3);
    ctx.closePath();
    ctx.stroke();
}

function gfx_display_text(x, y, txt) {
    ctx.fillStyle = 'white';
    ctx.fillText(txt, x,y);
}

function gfx_display_colour_text(x, y, txt, col) {
    ctx.fillStyle = col;
    ctx.fillText(txt, x, y);
}

function gfx_display_centre_text(y, str, psize, col) {
    var txt_size;
    var txt_colour;

    if (psize == 140) {
        txt_size = ELITE_2;
        txt_colour = -1;
    }
    else {
        txt_size = ELITE_1;
        txt_colour = col;
    }

    text_mode(-1);
    textout_centre(gfx_screen, datafile[txt_size].dat, str, (128 * GFX_SCALE) + GFX_X_OFFSET, (y / (2 / GFX_SCALE)) + GFX_Y_OFFSET, txt_colour);
}


function gfx_clear_display() {
    rectfill(gfx_screen, GFX_X_OFFSET + 1, GFX_Y_OFFSET + 1, 510 + GFX_X_OFFSET, 383 + GFX_Y_OFFSET, GFX_COL_BLACK);
}

function gfx_clear_text_area() {
    rectfill(gfx_screen, GFX_X_OFFSET + 1, GFX_Y_OFFSET + 340, 510 + GFX_X_OFFSET, 383 + GFX_Y_OFFSET, GFX_COL_BLACK);
}


function gfx_clear_area(tx, ty, width, height) {
    ctx.fillStyle = 'black';
    ctx.fillRect(tx, ty, width, height);
}

function gfx_draw_rectangle(tx, ty, width, height, col) {
    ctx.fillStyle = col;
    ctx.fillRect(tx, ty, width, height);
}

function gfx_display_pretty_text(tx, ty, bx, by, txt) {
    var strbuf;
    var str;
    var bptr;
    var len;
    var pos;
    var maxlen;

    maxlen = (bx - tx) / 8;

    str = txt;
    len = strlen(txt);

    while (len > 0) {
        pos = maxlen;
        if (pos > len)
            pos = len;

        while ((str[pos] != ' ') && (str[pos] != ',') &&
               (str[pos] != '.') && (str[pos] != '\0')) {
            pos--;
        }

        len = len - pos - 1;

        for (bptr = strbuf; pos >= 0; pos--)
            bptr = str++;

        bptr = '\0';

        text_mode(-1);
        textout(gfx_screen, datafile[ELITE_1].dat, strbuf, tx + GFX_X_OFFSET, ty + GFX_Y_OFFSET, GFX_COL_WHITE);
        ty += (8 * GFX_SCALE);
    }
}


function gfx_draw_scanner() {
    blit(scanner_image, gfx_screen, 0, 0, GFX_X_OFFSET, 385 + GFX_Y_OFFSET, scanner_image.w, scanner_image.h);
}

function gfx_set_clip_region(tx, ty, bx, by) {
    set_clip(gfx_screen, tx + GFX_X_OFFSET, ty + GFX_Y_OFFSET, bx + GFX_X_OFFSET, by + GFX_Y_OFFSET);
}


function gfx_start_render() {
    start_poly = 0;
    total_polys = 0;
}


function gfx_render_polygon(num_points, point_list, face_colour, zavg) {
    var x = total_polys;
    total_polys++;

    poly_chain[x].no_points = num_points;
    poly_chain[x].face_colour = face_colour;
    poly_chain[x].z = zavg;
    poly_chain[x].next = -1;

    for (var i = 0; i < 16; i++) {
        poly_chain[x].point_list[i] = point_list[i];
    }

    if (x == 0)
        return;

    if (zavg > poly_chain[start_poly].z) {
        poly_chain[x].next = start_poly;
        start_poly = x;
        return;
    }

    var next;

    for (var i = start_poly; poly_chain[i].next != -1; i = poly_chain[i].next) {
        next = poly_chain[i].next;

        if (zavg > poly_chain[next].z) {
            poly_chain[i].next = x;
            poly_chain[x].next = next;
            return;
        }
    }

    poly_chain[i].next = x;
}


function gfx_render_line(x1, y1, x2, y2, dist, col) {
    var point_list;

    point_list[0] = x1;
    point_list[1] = y1;
    point_list[2] = x2;
    point_list[3] = y2;

    gfx_render_polygon(2, point_list, col, dist);
}


function gfx_finish_render() {
    var num_points;
    var pl;
    var i;
    var col;

    if (total_polys == 0)
        return;

    for (i = start_poly; i != -1; i = poly_chain[i].next) {
        num_points = poly_chain[i].no_points;
        pl = poly_chain[i].point_list;
        col = poly_chain[i].face_colour;

        if (num_points == 2) {
            gfx_draw_colour_line(pl[0], pl[1], pl[2], pl[3], col);
            continue;
        }

        gfx_polygon(num_points, pl, col);
    };
}

function gfx_polygon(num_points, poly_list, face_colour) {
    var i;
    var x, y;

    x = 0;
    y = 1;
    for (i = 0; i < num_points; i++) {
        poly_list[x] += GFX_X_OFFSET;
        poly_list[y] += GFX_Y_OFFSET;
        x += 2;
        y += 2;
    }
    z
    polygon(gfx_screen, num_points, poly_list, face_colour);
}


function gfx_draw_sprite(sprite_no, x, y) {
    var sprite_bmp;

    switch (sprite_no) {
        case IMG_GREEN_DOT:
            sprite_bmp = datafile[GRNDOT].dat;
            break;

        case IMG_RED_DOT:
            sprite_bmp = datafile[REDDOT].dat;
            break;

        case IMG_BIG_S:
            sprite_bmp = datafile[SAFE].dat;
            break;

        case IMG_ELITE_TXT:
            sprite_bmp = datafile[ELITETXT].dat;
            break;

        case IMG_BIG_E:
            sprite_bmp = datafile[ECM].dat;
            break;

        case IMG_BLAKE:
            sprite_bmp = datafile[BLAKE].dat;
            break;

        case IMG_MISSILE_GREEN:
            sprite_bmp = datafile[MISSILE_G].dat;
            break;

        case IMG_MISSILE_YELLOW:
            sprite_bmp = datafile[MISSILE_Y].dat;
            break;

        case IMG_MISSILE_RED:
            sprite_bmp = datafile[MISSILE_R].dat;
            break;

        default:
            return;
    }

    if (x == -1)
        x = ((256 * GFX_SCALE) - sprite_bmp.w) / 2;

    draw_sprite(gfx_screen, sprite_bmp, x + GFX_X_OFFSET, y + GFX_Y_OFFSET);
}


function gfx_request_file(title, path, ext) {
    var okay;

    show_mouse(screen);
    okay = file_select(title, path, ext);
    show_mouse(NULL);

    return okay;
}

