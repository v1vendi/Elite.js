var SND_LAUNCH = 0;
var SND_CRASH = 1;
var SND_DOCK = 2;
var SND_GAMEOVER = 3;
var SND_PULSE = 4;
var SND_HIT_ENEMY = 5;
var SND_EXPLODE = 6;
var SND_ECM = 7;
var SND_MISSILE = 8;
var SND_HYPERSPACE = 9;
var SND_INCOMMING_FIRE_1 = 10;
var SND_INCOMMING_FIRE_2 = 11;
var SND_BEEP = 12;
var SND_BOOP = 13;

var SND_ELITE_THEME = 0;
var SND_BLUE_DANUBE = 1;

var NUM_SAMPLES = 14;

var sound_on;

function sound_sample(sample, filename, runtime, timeleft) {
    this.sample = sample;
    this.filename = sample;
    this.runtime = sample;
    this.timeleft = sample;
};

var sample_list =
[
    new sound_sample(null, "launch.wav", 32, 0),
	new sound_sample(null, "crash.wav", 7, 0),
	new sound_sample(null, "dock.wav", 36, 0),
	new sound_sample(null, "gameover.wav", 24, 0),
	new sound_sample(null, "pulse.wav", 4, 0),
	new sound_sample(null, "hitem.wav", 4, 0),
	new sound_sample(null, "explode.wav", 23, 0),
	new sound_sample(null, "ecm.wav", 23, 0),
	new sound_sample(null, "missile.wav", 25, 0),
	new sound_sample(null, "hyper.wav", 37, 0),
	new sound_sample(null, "incom1.wav", 4, 0),
	new sound_sample(null, "incom2.wav", 5, 0),
	new sound_sample(null, "beep.wav", 2, 0),
	new sound_sample(null, "boop.wav", 7, 0),
];

function snd_sound_startup() {
    var i;

    /* Install a sound driver.. */
    sound_on = 1;

    if (install_sound(DIGI_AUTODETECT, MIDI_AUTODETECT, ".") != 0) {
        sound_on = 0;
        return;
    }

    /* Load the sound samples... */

    for (i = 0; i < NUM_SAMPLES; i++) {
        sample_list[i].sample = load_sample(sample_list[i].filename);
    }
}

function snd_sound_shutdown() {
    var i;

    if (!sound_on)
        return;

    for (i = 0; i < NUM_SAMPLES; i++) {
        if (sample_list[i].sample != NULL) {
            destroy_sample(sample_list[i].sample);
            sample_list[i].sample = NULL;
        }
    }
}
function snd_play_sample(sample_no) {
    if (!sound_on)
        return;

    if (sample_list[sample_no].timeleft != 0)
        return;

    sample_list[sample_no].timeleft = sample_list[sample_no].runtime;

    play_sample(sample_list[sample_no].sample, 255, 128, 1000, FALSE);
}

function snd_update_sound() {
    var i;

    for (i = 0; i < NUM_SAMPLES; i++) {
        if (sample_list[i].timeleft > 0)
            sample_list[i].timeleft--;
    }
}

function snd_play_midi(midi_no, repeat) {
    if (!sound_on)
        return;

    switch (midi_no) {
        case SND_ELITE_THEME:
            play_midi(datafile[THEME].dat, repeat);
            break;

        case SND_BLUE_DANUBE:
            play_midi(datafile[DANUBE].dat, repeat);
            break;
    }
}

function snd_stop_midi() {
    if (sound_on);
    play_midi(NULL, TRUE);
}