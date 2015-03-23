var hyperspace_planet;

var rnd_seed = {
    a: null,
    b: null,
    c: null,
    d: null
};

var digrams = "ABOUSEITILETSTONLONUTHNOALLEXEGEZACEBISOUSESARMAINDIREA?ERATENBERALAVETIEDORQUANTEISRION";

var inhabitant_size = ["Large ", "Fierce ", "Small "];

var inhabitant_color = ["Green ", "Red ", "Yellow ", "Blue ", "Black ", "Harmless "];

var inhabitant_desc3 = ["Slimy ", "Bug-Eyed ", "Horned ", "Bony ", "Fat ", "Furry "];

var inhabitant_type = ["Rodent", "Frog", "Lizard", "Lobster", "Bird", "Humanoid", "Feline", "Insect"];


var planet_description;
var desc_ptr;

var desc_list = [
    /*  0	*/["fabled", "notable", "well known", "famous", "noted"],
    /*  1	*/["very", "mildly", "most", "reasonably", ""],
    /*  2	*/["ancient", "<20>", "great", "vast", "pink"],
    /*  3	*/["<29> <28> plantations", "mountains", "<27>", "<19> forests", "oceans"],
    /*  4	*/["shyness", "silliness", "mating traditions", "loathing of <5>", "love for <5>"],
    /*  5	*/["food blenders", "tourists", "poetry", "discos", "<13>"],
    /*  6	*/["talking tree", "crab", "bat", "lobst", "%R"],
    /*  7	*/["beset", "plagued", "ravaged", "cursed", "scourged"],
    /*  8	*/["<21> civil war", "<26> <23> <24>s", "a <26> disease", "<21> earthquakes", "<21> solar activity"],
    /*  9	*/["its <2> <3>", "the %I <23> <24>", "its inhabitants' <25> <4>", "<32>", "its <12> <13>"],
    /* 10	*/["juice", "brandy", "water", "brew", "gargle blasters"],
    /* 11	*/["%R", "%I <24>", "%I %R", "%I <26>", "<26> %R"],
    /* 12	*/["fabulous", "exotic", "hoopy", "unusual", "exciting"],
    /* 13	*/["cuisine", "night life", "casinos", "sit coms", " <32> "],
    /* 14	*/["%H", "The planet %H", "The world %H", "This planet", "This world"],
    /* 15	*/["n unremarkable", " boring", " dull", " tedious", " revolting"],
    /* 16	*/["planet", "world", "place", "little planet", "dump"],
    /* 17	*/["wasp", "moth", "grub", "ant", "%R"],
    /* 18	*/["poet", "arts graduate", "yak", "snail", "slug"],
    /* 19	*/["tropical", "dense", "rain", "impenetrable", "exuberant"],
    /* 20	*/["funny", "wierd", "unusual", "strange", "peculiar"],
    /* 21	*/["frequent", "occasional", "unpredictable", "dreadful", "deadly"],
    /* 22	*/["<1> <0> for <9>", "<1> <0> for <9> and <9>", "<7> by <8>", "<1> <0> for <9> but <7> by <8>", " a<15> <16>"],
    /* 23	*/["<26>", "mountain", "edible", "tree", "spotted"],
    /* 24	*/["<30>", "<31>", "<6>oid", "<18>", "<17>"],
    /* 25	*/["ancient", "exceptional", "eccentric", "ingrained", "<20>"],
    /* 26	*/["killer", "deadly", "evil", "lethal", "vicious"],
    /* 27	*/["parking meters", "dust clouds", "ice bergs", "rock formations", "volcanoes"],
    /* 28	*/["plant", "tulip", "banana", "corn", "%Rweed"],
    /* 29	*/["%R", "%I %R", "%I <26>", "inhabitant", "%I %R"],
    /* 30	*/["shrew", "beast", "bison", "snake", "wolf"],
    /* 31	*/["leopard", "cat", "monkey", "goat", "fish"],
    /* 32	*/["<11> <10>", "%I <30> <33>", "its <12> <31> <33>", "<34> <35>", "<11> <10>"],
    /* 33	*/["meat", "cutlet", "steak", "burgers", "soup"],
    /* 34	*/["ice", "mud", "Zero-G", "vacuum", "%I ultra"],
    /* 35	*/["hockey", "cricket", "karate", "polo", "tennis"]
];


/*
 * Generate a random number between 0 and 255.
 * This is the version used in the 6502 Elites.
 */

function gen_rnd_number() {
    var a, x;

    x = (rnd_seed.a * 2) & 0xFF;
    a = x + rnd_seed.c;
    if (rnd_seed.a > 127)
        a++;
    rnd_seed.a = a & 0xFF;
    rnd_seed.c = x;

    a = a / 256;	/* a = any carry left from above */
    x = rnd_seed.b;
    a = (a + x + rnd_seed.d) & 0xFF;
    rnd_seed.b = a;
    rnd_seed.d = x;
    return a;
}


/*
 * Generate a random number between 0 and 255.
 * This is the version used in the MSX and 16bit Elites.
 */


function gen_msx_rnd_number() {
    var a, b;

    a = rnd_seed.a;
    b = rnd_seed.b;

    rnd_seed.a = rnd_seed.c;
    rnd_seed.b = rnd_seed.d;

    a += rnd_seed.c;
    b = (b + rnd_seed.d) & 255;
    if (a > 255) {
        a &= 255;
        b++;
    }

    rnd_seed.c = a;
    rnd_seed.d = b;

    return rnd_seed.c / 0x34;
}


function waggle_galaxy(glx_ptr) {
    var x;
    var y;
    var carry_flag;

    x = glx_ptr.a + glx_ptr.c;
    y = glx_ptr.b + glx_ptr.d;


    if (x > 0xFF)
        y++;

    x &= 0xFF;
    y &= 0xFF;

    glx_ptr.a = glx_ptr.c;
    glx_ptr.b = glx_ptr.d;
    glx_ptr.c = glx_ptr.e;
    glx_ptr.d = glx_ptr.f;

    x += glx_ptr.c;
    y += glx_ptr.d;


    if (x > 0xFF)
        y++;

    if (y > 0xFF)
        carry_flag = 1;
    else
        carry_flag = 0;

    x &= 0xFF;
    y &= 0xFF;

    glx_ptr.e = x;
    glx_ptr.f = y;
}




function find_planet(cx, cy) {
    var min_dist = 10000;
    var glx;
    var planet;
    var distance;
    var dx, dy;
    var i;

    glx = cmdr.galaxy;

    for (i = 0; i < 256; i++) {

        dx = abs(cx - glx.d);
        dy = abs(cy - glx.b);

        if (dx > dy)
            distance = (dx + dx + dy) / 2;
        else
            distance = (dx + dy + dy) / 2;

        if (distance < min_dist) {
            min_dist = distance;
            planet = glx;
        }

        waggle_galaxy(glx);
        waggle_galaxy(glx);
        waggle_galaxy(glx);
        waggle_galaxy(glx);
    }

    return planet;
}


function find_planet_number(planet) {
    var glx;
    var i;

    glx = cmdr.galaxy;

    for (i = 0; i < 256; i++) {

        if ((planet.a == glx.a) &&
            (planet.b == glx.b) &&
            (planet.c == glx.c) &&
            (planet.d == glx.d) &&
            (planet.e == glx.e) &&
            (planet.f == glx.f))
            return i;

        waggle_galaxy(glx);
        waggle_galaxy(glx);
        waggle_galaxy(glx);
        waggle_galaxy(glx);
    }

    return -1;
}



function name_planet(planetName, glx) {
    var size;
    var i;
    var gp;
    var x;


    if ((glx.a & 64) == 0)
        size = 3;
    else
        size = 4;

    for (i = 0; i < size; i++) {
        x = glx.f & 31;
        if (x != 0) {
            x += 12;
            x *= 2;
            planetName += digrams[x];
            if (digrams[x + 1] != '?')
                planetName += digrams[x + 1];
        }

        waggle_galaxy(glx);
    }

}


function capitalise_name(name) {
    name = name.toUpperCase();
}


function describe_inhabitants(str, planet) {
    var inhab;

    str += "(";

    if (planet.e < 128) {
        strcat(str, "Human Colonial");
    }
    else {
        inhab = (planet.f / 4) & 7;
        if (inhab < 3)
            str += inhabitant_size[inhab];

        inhab = planet.f / 32;
        if (inhab < 6)
            str += inhabitant_color[inhab];

        inhab = (planet.d ^ planet.b) & 7;
        if (inhab < 6)
            str += inhabitant_desc3[inhab];

        inhab = (inhab + (planet.f & 3)) & 7;
        str += inhabitant_type[inhab];
    }

    str += "s)";
}



function expand_description(source) {
    var str;
    var ptr;
    var num;
    var rnd;
    var option;
    var i, len, x;

    for (var j = 0; j < source.length; j++) {
        var letter = source[i];

        if (letter == '<') {
            var k = j;

            while (source[k] != '>')
                ptr += source[k++];

            num = atoi(str);

            if (hoopy_casinos) {
                option = gen_msx_rnd_number();
            }
            else {
                rnd = gen_rnd_number();
                option = 0;
                if (rnd >= 0x33) option++;
                if (rnd >= 0x66) option++;
                if (rnd >= 0x99) option++;
                if (rnd >= 0xCC) option++;
            }

            expand_description(desc_list[num][option]);
            continue;
        }

        if (letter == '%') {
            i++;
            letter = source[i];
            switch (letter) {
                case 'H':
                    desc_ptr = ptr;
                    break;

                case 'I':
                    name_planet(str, hyperspace_planet);
                    capitalise_name(str);
                    desc_ptr = ptr;
                    desc_ptr += "ian";
                    break;

                case 'R':
                    len = gen_rnd_number() & 3;
                    for (i = 0; i <= len; i++) {
                        x = gen_rnd_number() & 0x3e;
                        if (i == 0)
                            desc_ptr += digrams[x];
                        else
                            desc_ptr += tolower(digrams[x]);
                        desc_ptr += tolower(digrams[x + 1]);
                    }
            }
        }
    }




}



function describe_planet(planet) {
    var mission_text;

    if (cmdr.mission == 1) {
        mission_text = mission_planet_desc(planet);
        if (mission_text != null)
            return mission_text;
    }

    rnd_seed.a = planet.c;
    rnd_seed.b = planet.d;
    rnd_seed.c = planet.e;
    rnd_seed.d = planet.f;

    if (hoopy_casinos) {
        rnd_seed.a ^= planet.a;
        rnd_seed.b ^= planet.b;
        rnd_seed.c ^= rnd_seed.a;
        rnd_seed.d ^= rnd_seed.b;
    }

    desc_ptr = planet_description;

    expand_description("<14> is <22>.");

    return planet_description;
}



function generate_planet_data(pl, planet_seed) {

    pl.government = (planet_seed.c / 8) & 7;

    pl.economy = planet_seed.b & 7;

    if (pl.government < 2)
        pl.economy = pl.economy | 2;

    pl.techlevel = pl.economy ^ 7;
    pl.techlevel += planet_seed.d & 3;
    pl.techlevel += (pl.government / 2) + (pl.government & 1);


    pl.population = pl.techlevel * 4;
    pl.population += pl.government;
    pl.population += pl.economy;
    pl.population++;

    pl.productivity = (pl.economy ^ 7) + 3;
    pl.productivity *= pl.government + 4;
    pl.productivity *= pl.population;
    pl.productivity *= 8;

    pl.radius = (((planet_seed.f & 15) + 11) * 256) + planet_seed.d;
}



