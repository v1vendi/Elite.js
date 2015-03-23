var SCR_INTRO_ONE = 1;
var SCR_INTRO_TWO = 2;
var SCR_GALACTIC_CHART = 3;
var SCR_SHORT_RANGE = 4;
var SCR_PLANET_DATA = 5;
var SCR_MARKET_PRICES = 6;
var SCR_CMDR_STATUS = 7;
var SCR_FRONT_VIEW = 8;
var SCR_REAR_VIEW = 9;
var SCR_LEFT_VIEW = 10;
var SCR_RIGHT_VIEW = 11;
var SCR_BREAK_PATTERN = 12;
var SCR_INVENTORY = 13;
var SCR_EQUIP_SHIP = 14;
var SCR_OPTIONS = 15;
var SCR_LOAD_CMDR = 16;
var SCR_SAVE_CMDR = 17;
var SCR_QUIT = 18;
var SCR_GAME_OVER = 19;
var SCR_SETTINGS = 20;
var SCR_ESCAPE_POD = 21;


var PULSE_LASER = 0x0F;
var BEAM_LASER = 0x8F;
var MILITARY_LASER = 0x97;
var MINING_LASER = 0x32;


var FLG_DEAD = 1;
var FLG_REMOVE = 2;
var FLG_EXPLOSION = 4;
var FLG_ANGRY = 8;
var FLG_FIRING = 16;
var FLG_HAS_ECM = 32;
var FLG_HOSTILE = 64;
var FLG_CLOAKED = 128;
var FLG_FLY_TO_PLANET = 256;
var FLG_FLY_TO_STATION = 512;
var FLG_INACTIVE = 1024;
var FLG_SLOW = 2048;
var FLG_BOLD = 4096;
var FLG_POLICE = 8192;

var MAX_UNIV_OBJECTS = 20;


var curr_galaxy_num = 1;
var curr_fuel = 70;
var carry_flag = 0;
var current_screen = 0;
var witchspace;

var wireframe = 0;
var anti_alias_gfx = 0;
var hoopy_casinos = 0;
var speed_cap = 75;
var instant_dock = 0;


var scanner_filename = "";
var scanner_cx;
var scanner_cy;
var compass_centre_x;
var compass_centre_y;

var planet_render_style = 0;

var game_over;
var docked;
var finish;
var flight_speed;
var flight_roll;
var flight_climb;
var front_shield;
var aft_shield;
var energy;
var laser_temp;
var detonate_bomb;
var auto_pilot;

var cmdr = {
    market_rnd: rand255(),
    current_cargo: {

    },

}

saved_cmdr = new commander(
    "JAMESON",									/* Name 			*/
	0,											/* Mission Number 	*/
    0x14,0xAD,									/* Ship X,Y			*/
{0x4a, 0x5a, 0x48, 0x02, 0x53, 0xb7},		/* Galaxy Seed		*/
1000,										/* Credits * 10		*/
    70,											/* Fuel	* 10		*/
	0,
    0,											/* Galaxy - 1		*/
	PULSE_LASER,								/* Front Laser		*/
    0,											/* Rear Laser		*/
	0,											/* Left Laser		*/
    0,											/* Right Laser		*/
	0, 0,
	20,											/* Cargo Capacity	*/
{0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0},		/* Current Cargo	*/
0,											/* ECM				*/
    0,											/* Fuel Scoop		*/
	0,											/* Energy Bomb		*/
    0,											/* Energy Unit		*/
	0,											/* Docking Computer */
    0,											/* Galactic H'Drive	*/
	0,											/* Escape Pod		*/
    0,0,0,0,
    3,											/* No. of Missiles	*/
	0,											/* Legal Status		*/
{0x10, 0x0F, 0x11, 0x00, 0x03, 0x1C,		/* Station Stock	*/
	 0x0E, 0x00, 0x00, 0x0A, 0x00, 0x11,
	 0x3A, 0x07, 0x09, 0x08, 0x00},
	0,											/* Fluctuation		*/
    0,											/* Score			*/
	0x80										/* Saved			*/
);

function player_ship(max_speed, max_roll, max_climb, max_fuel, altitude, cabtemp) {
    this.max_speed = max_speed;
    this.max_roll = max_roll;
    this.max_climb = max_climb;
    this.max_fuel = max_fuel;
    this.altitude = altitude;
    this.cabtemp = cabtemp;

    return this;
};

function commander(name, mission, ship_x, ship_y, galaxy, credits, fuel,
    unused1, galaxy_number, front_laser, rear_laser, left_laser, right_laser, unused2,
    unused3, cargo_capacity, current_cargo, ecm, fuel_scoop, energy_bomb, energy_unit,
    docking_computer, galactic_hyperdrive, escape_pod, unused4, unused5, unused6,
    unused7, missiles, legal_status, station_stock, market_rnd, score, saved) {

    this.name = name;
    this.mission = mission;
    this.ship_x = ship_x;
    this.ship_y = ship_y;
    this.galaxy = galaxy;
    this.credits = credits;
    this.fuel = fuel;
    this.unused1 = unused1;
    this.galaxy_number = galaxy_number;
    this.front_laser = front_laser;
    this.rear_laser = rear_laser;
    this.left_laser = left_laser;
    this.right_laser = right_laser;
    this.unused2 = unused2;
    this.unused3 = unused3;
    this.cargo_capacity = cargo_capacity;
    this.current_cargo = current_cargo;
    this.ecm = ecm;
    this.fuel_scoop = fuel_scoop;
    this.energy_bomb = energy_bomb;
    this.energy_unit = energy_unit;
    this.docking_computer = docking_computer;
    this.galactic_hyperdrive = galactic_hyperdrive;
    this.escape_pod = escape_pod;
    this.unused4 = unused4;
    this.unused5 = unused5;
    this.unused6 = unused6;
    this.unused7 = unused7;
    this.missiles = missiles;
    this.legal_status = legal_status;
    this.station_stock = station_stock;
    this.market_rnd = market_rnd;
    this.score = score;
    this.saved = saved;

    return this;
};

function restore_saved_commander() {
    cmdr = saved_cmdr;

    docked_planet = find_planet(cmdr.ship_x, cmdr.ship_y);
    hyperspace_planet = docked_planet;

    generate_planet_data(current_planet_data, docked_planet);
    generate_stock_market();
    set_stock_quantities(cmdr.station_stock);
}