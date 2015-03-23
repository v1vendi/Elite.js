var rand_seed;

function randint ()
{
    var k1;
    var ix = rand_seed;
	
    k1 = ix / 127773;
    ix = 16807 * (ix - k1 * 127773) - k1 * 2836;
    if (ix < 0)
        ix += 2147483647;
    rand_seed = ix;

    return ix; 
} 

function set_rand_seed (seed)
{
	rand_seed = seed;
}

function get_rand_seed ()
{
    return rand_seed;
}

function rand255 ()
{
    return randint() & 255;
}
