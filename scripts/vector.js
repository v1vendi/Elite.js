/*
 * Elite - The New Kind.
 *
 * Reverse engineered from the BBC disk version of Elite.
 * Additional material by C.J.Pinder.
 *
 * The original Elite code is (C) I.Bell & D.Braben 1984.
 * This version re-engineered in C by C.J.Pinder 1999-2001.
 *
 * email: <christian@newkind.co.uk>
 *
 */


/*
 * The original Elite code did all the vector calculations using 8-bit integers.
 *
 * Writing all the routines in C to use 8 bit ints would have been fairly pointless.
 * I have, therefore, written a new set of routines which use floating point math.
 */


#include "config.h"
#include "vector.h"

function Vector(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;

    return this;
}

function Matrix(vec1, vec2, vec3){
    this['0'] = vec1;
    this['1'] = vec2;
    this['2'] = vec3;

    return this;
}

var start_matrix = new Matrix(
    new Vector(1.0, 0.0, 0.0),
	new Vector(0.0, 1.0, 0.0),
	new Vector(0.0, 0.0,-1.0)
    );



/*
 * Multiply first matrix by second matrix.
 * Put result into first matrix.
 */
function mult_matrix (firstVector, secondVector){
    var rv = new Matrix();

    for (var i = 0; i < 3; i++){

        rv[i].x =	(first[0].x * second[i].x) +
				 	(first[1].x * second[i].y) +
					(first[2].x * second[i].z);

        rv[i].y =	(first[0].y * second[i].x) +
					(first[1].y * second[i].y) +
					(first[2].y * second[i].z);

        rv[i].z =	(first[0].z * second[i].x) +
					(first[1].z * second[i].y) +
					(first[2].z * second[i].z);
    }

    for (i = 0; i < 3; i++){
        first[i] = rv[i];
    }
}

void mult_vector ( vec, mat){
    var x;
    var y;
    var z;

    x = (vec.x * mat[0].x) +
		(vec.y * mat[0].y) +
		(vec.z * mat[0].z);

    y = (vec.x * mat[1].x) +
		(vec.y * mat[1].y) +
		(vec.z * mat[1].z);

    z = (vec.x * mat[2].x) +
		(vec.y * mat[2].y) +
		(vec.z * mat[2].z);

    vec.x = x;
    vec.y = y;
    vec.z = z;
}


/*
 * Calculate the dot product of two vectors sharing a common point.
 * Returns the cosine of the angle between the two vectors.
 */
function vector_dot_product (first, second){
    return (first.x * second.x) + (first.y * second.y) + (first.z * second.z);	
}

/*
 * Convert a vector into a vector of unit (1) length.
 */
function unit_vector (vec){
    var lx,ly,lz;
    var uni;
    var res = new Vector();

    lx = vec.x;
    ly = vec.y;
    lz = vec.z;

    uni = sqrt (lx * lx + ly * ly + lz * lz);

    res.x = lx / uni;
    res.y = ly / uni;
    res.z = lz / uni;
	
    return res;
}

function set_init_matrix (mat){

    for (var i = 0; i < 3; i++){
        mat[i] = start_matrix[i];
    }
}


function tidy_matrix (mat)
{
    mat[2] = unit_vector (mat[2]);

    if ((mat[2].x > -1) && (mat[2].x < 1))    {
        if ((mat[2].y > -1) && (mat[2].y < 1))        {
            mat[1].z = -(mat[2].x * mat[1].x + mat[2].y * mat[1].y) / mat[2].z;
        } else {
            mat[1].y = -(mat[2].x * mat[1].x + mat[2].z * mat[1].z) / mat[2].y;
        }
    } else {
        mat[1].x = -(mat[2].y * mat[1].y + mat[2].z * mat[1].z) / mat[2].x;
    }
	
    mat[1] = unit_vector (mat[1]);	

    /* xyzzy... nothing happens. :-)*/	
    mat[0].x = mat[1].y * mat[2].z - mat[1].z * mat[2].y;
    mat[0].y = mat[1].z * mat[2].x - mat[1].x * mat[2].z;
    mat[0].z = mat[1].x * mat[2].y - mat[1].y * mat[2].x;
}

