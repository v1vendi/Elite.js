
var ship_no;
var show_time;
var direction;


var min_dist = [0, 200, 800, 200,   200, 200, 300, 384,   200,
								  200, 200, 420, 900, 500, 800, 384, 384,
							      384, 384, 384, 200, 384, 384, 384,   0,
								  384,   0, 384, 384, 700, 384,   0,   0,
							 	  900];


var intro_ship_matrix = new Matrix();


function initialise_intro1 ()
{
    clear_universe();
    set_init_matrix (intro_ship_matrix);
    add_new_ship (SHIP_COBRA3, 0, 0, 4500, intro_ship_matrix, -127, -127);
}


function initialise_intro2 ()
{
    ship_no = 0;
    show_time = 0;
    direction = 100;

    clear_universe();
    create_new_stars();
    set_init_matrix (intro_ship_matrix);
    add_new_ship (1, 0, 0, 5000, intro_ship_matrix, -127, -127);
}

function update_intro1 ()
{
    universe[0].location.z -= 100;

    if (universe[0].location.z < 384)
        universe[0].location.z = 384;

    gfx_clear_display();

    flight_roll = 1;
    update_universe();
	
    gfx_draw_sprite(IMG_ELITE_TXT, -1, 10);

    gfx_display_centre_text (310, "Original Game (C) I.Bell & D.Braben.", 120, GFX_COL_WHITE);
    gfx_display_centre_text (330, "Re-engineered by C.J.Pinder.", 120, GFX_COL_WHITE);
    gfx_display_centre_text (360, "Load New Commander (Y/N)?", 140, GFX_COL_GOLD);
}

function update_intro2 ()
{
    show_time++;

    if ((show_time >= 140) && (direction < 0))
        direction = -direction;

    universe[0].location.z += direction;

    if (universe[0].location.z < min_dist[ship_no])
        universe[0].location.z = min_dist[ship_no];

    if (universe[0].location.z > 4500)
    {
        do
        {
            ship_no++;
            if (ship_no > NO_OF_SHIPS)
                ship_no = 1;
        } while (min_dist[ship_no] == 0);

        show_time = 0;
        direction = -100;

        ship_count[universe[0].type] = 0;
        universe[0].type = 0;		

        add_new_ship (ship_no, 0, 0, 4500, intro_ship_matrix, -127, -127);
    }


    gfx_clear_display();
    update_starfield();
    update_universe();

    gfx_draw_sprite (IMG_ELITE_TXT, -1, 10);

    gfx_display_centre_text (360, "Press Fire or Space, Commander.", 140, GFX_COL_GOLD);
    gfx_display_centre_text (330, ship_list[ship_no]->name, 120, GFX_COL_WHITE);
}

