function stock_item(name, current_quantity, current_price, base_price, eco_adjust, base_quantity, mask, units) {
    return {
        name: name,
        current_quantity: current_quantity,
        current_price: current_price,
        base_price: base_price,
        eco_adjust: eco_adjust,
        base_quantity: base_quantity,
        mask: mask,
        units: units
    };
}

var NO_OF_STOCK_ITEMS = 17;
var ALIEN_ITEMS_IDX = 16;

var SLAVES = 3;
var NARCOTICS = 6;
var FIREARMS = 10;

var TONNES = 0;
var KILOGRAMS = 1;
var GRAMS = 2;

var stock_market = [
    new stock_item("Food", 0, 0, 19, -2, 6, 0x01, TONNES),
	new stock_item("Textiles",	 0, 0,  20, -1,  10, 0x03, TONNES),
	new stock_item("Radioactives", 0, 0,  65, -3,   2, 0x07, TONNES),
	new stock_item("Slaves",		 0, 0,  40, -5, 226, 0x1F, TONNES),
	new stock_item("Liquor/Wines", 0, 0,  83, -5, 251, 0x0F, TONNES),
	new stock_item("Luxuries",	 0, 0, 196,  8,  54, 0x03, TONNES),
	new stock_item("Narcotics",	 0, 0, 235, 29,   8, 0x78, TONNES),
	new stock_item("Computers",	 0, 0, 154, 14,  56, 0x03, TONNES),
	new stock_item("Machinery",	 0, 0, 117,  6,  40, 0x07, TONNES),
	new stock_item("Alloys",		 0, 0,  78,  1,  17, 0x1F, TONNES),
	new stock_item("Firearms",	 0, 0, 124, 13,  29, 0x07, TONNES),
	new stock_item("Furs",		 0, 0, 176, -9, 220, 0x3F, TONNES),
	new stock_item("Minerals",	 0, 0,  32, -1,  53, 0x03, TONNES),
	new stock_item("Gold",		 0, 0,  97, -1,  66, 0x07, KILOGRAMS),
	new stock_item("Platinum",	 0, 0, 171, -2,  55, 0x1F, KILOGRAMS),
	new stock_item("Gem-Stones",	 0, 0,  45, -1, 250, 0x0F, GRAMS),
    new stock_item("Alien Items", 0, 0, 53, 15, 192, 0x07, TONNES)
];

function generate_stock_market (){
    var quant;
    var price;

    for (var i = 0; i < NO_OF_STOCK_ITEMS; i++)    {
        price  = stock_market[i].base_price;								/* Start with the base price	*/
        price += cmdr.market_rnd & stock_market[i].mask;					/* Add in a random amount		*/
        price += current_planet_data.economy * stock_market[i].eco_adjust;	/* Adjust for planet economy	*/
        price &= 255;														/* Only need bottom 8 bits		*/

        quant  = stock_market[i].base_quantity;								/* Start with the base quantity */
        quant += cmdr.market_rnd & stock_market[i].mask;					/* Add in a random amount		*/
        quant -= current_planet_data.economy * stock_market[i].eco_adjust;	/* Adjust for planet economy	*/
        quant &= 255;														/* Only need bottom 8 bits		*/

        if (quant > 127)	/* In an 8-bit environment '>127' would be negative */
            quant = 0;		/* So we set it to a minimum of zero. */

        quant &= 63;		/* Quantities range from 0..63 */

        stock_market[i].current_price = price * 4;
        stock_market[i].current_quantity = quant;
    }

    /* Alien Items are never available for purchase... */
    stock_market[ALIEN_ITEMS_IDX].current_quantity = 0;
}

function set_stock_quantities(quant){

    for (var i = 0; i < NO_OF_STOCK_ITEMS; i++) {
        stock_market[i].current_quantity = quant[i];
    }

    stock_market[ALIEN_ITEMS_IDX].current_quantity = 0;
}

function carrying_contraband () {
    return (cmdr.current_cargo[SLAVES] + cmdr.current_cargo[NARCOTICS]) * 2 +
			cmdr.current_cargo[FIREARMS];
}

function total_cargo (){

    var cargo_held = 0;
    for (var i = 0; i < 17; i++) {
        if ((cmdr.current_cargo[i] > 0) && (stock_market[i].units == TONNES)) {
            cargo_held += cmdr.current_cargo[i];
        }
    }

    return cargo_held;
}

function scoop_item ( un){
    var type;
    var trade;

    if (universe[un].flags & FLG_DEAD)
        return;
	
    type = universe[un].type;
	
    if (type == SHIP_MISSILE)
        return;

    if ((cmdr.fuel_scoop == 0) || (universe[un].location.y >= 0) ||
        (total_cargo() == cmdr.cargo_capacity))
    {
        explode_object (un);
        damage_ship (128 + (universe[un].energy / 2), universe[un].location.z > 0);
        return;
    }

    if (type == SHIP_CARGO)
    {
        trade = rand255() & 7;
        cmdr.current_cargo[trade]++;
        info_message (stock_market[trade].name);
        remove_ship (un);
        return;					
    }

    if (ship_list[type].scoop_type != 0)
    {
        trade = ship_list[type].scoop_type + 1;
        cmdr.current_cargo[trade]++;
        info_message (stock_market[trade].name);
        remove_ship (un);
        return;					
    }
	
    explode_object (un);
    damage_ship (universe[un].energy / 2, universe[un].location.z > 0);
}