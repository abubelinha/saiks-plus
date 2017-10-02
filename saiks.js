// SLIKS-Alike Interactive Key Software (SAIKS)
// Inspired by SLIKS from http://stingersplace.com/SLIKS/ by Gerald F. Guala
// Copyright (c) 2006 Greg Alexander, to be distributed under the terms of
// the GPLv2 (COPYING)

// defaults for things that can be overriden in data.js
var binary = false;
var exclusive_mode = true;
var remove_mode = false;		// remove taxa instead of reddening

var first_row = 1;	// to skip chars[0] and items[0] for SLIKS compat
var char_flags = new Array();
// == 0   -->  initial state, is selectable
// == 1   -->  currently selected characteristic (click to unselect)
// == 2   -->  grayed out (obviated characteristic)
var taxa_flags = new Array();
// == 0   -->  not a possible match
// == 1   --> a possible match

// hopefully eliminate some downstream substring processing by caching
// single-value item characteristics
var item_cache = new Array();

// used instead of scanning char_flags[row] (as in any_in_row_selected())
var char_row_state = new Array();
// == 0       --> nothing selected
// == -1      --> several selected
// == 1-35    --> just that col selected (great for exclusive/binary mode!)

// these are initialized by *_table() to work around the fact that MSIE
// (et al?) have a distinct lack of document.getElementById()
var char_elems = new Array();
var taxa_elems = new Array();

// to support categories of characteristics
var char_titles = new Array();
var char_headers = new Array();
var char_header_run = new Array();
var any_char_headers = false;


function get_elem_by_tag_id(tag, id) {
    var elemlist = document.getElementsByTagName(tag);
    var len = elemlist.length;
    var i;
    for (i = 0; i < len; i++) {
        if (elemlist[i].id == id) {
            return elemlist[i];
        }
    }
}

// find width of characteristics table
function find_max_char_cols() {
    var i;
    var max = 0;
    for (i = first_row; i < chars.length; i++) {
        if (chars[i].length > max) {
            max = chars[i].length;
        }
    }
    return max;
}

// emit characteristics table
function chars_table() {
    var max_char_cols = find_max_char_cols();
    var i;
    var j;
    var k;

    document.write("<table border=1 cellspacing=0 cellpadding=0 class=\"ct\">\n");

    for (i = first_row; i < chars.length; i++) {
        var percent;
        document.write("<tr>");
        if (any_char_headers) {
            if (char_header_run[i] > 0) {
                document.write("<td rowspan=" + char_header_run[i] + "><div class=\"ct_cat\">" + char_headers[i] + "</div></td>\n");
            }
        }
        document.write("<td><div class=\"ct_title\">" + char_titles[i] + "</div></td>\n");
        document.write("<td><table border=1 cellspacing=0 width=100% class=\"ctt\"><tr>\n");
        percent = 100 / (chars[i].length - 1);
        for (j = 1; j < chars[i].length; j++) {
            document.write("<td width=" + percent + "% id=\"char" + i + "m" + j + "\" onClick=\"toggle_char(" + i + "," + j + ");\"><div class=\"ctt_char\">" + chars[i][j] + "</div></td>\n");
        }
        document.write("</tr></table></td></tr>\n");
    }

    document.write("</table>\n");

    // this could be improved slightly by getting just the tds
    // associated with the table we want, but it seems that simply not
    // referencing document.all is enough to guarantee decent performance,
    // even on firefox!
    var elemlist = document.getElementsByTagName("td");
    var len = elemlist.length;
    for (i = 0; i < len; i++) {
        if (elemlist[i].id.substr(0, 4) == "char") {
            var s;
            s = elemlist[i].id.substr(4);
            k = s.indexOf("m");
            j = s.substr(0, k) - 0;
            k = s.substr(k + 1) - 0;
            if (!char_elems[j]) {
                char_elems[j] = new Array();
            }
            char_elems[j][k] = elemlist[i];
        }
    }
}

// emit taxa table
function taxa_table() {
    document.write("<table class=\"tt\">");
    for (i = first_row; i < items.length; i++) {
        document.write("<tr><td id=\"taxa" + i + "\">");
        if (items[i][chars.length]) {
            document.write("<a class=\"tt_name\" href=\"" + items[i][chars.length] + "\">" + items[i][0] + "</a>");
        } else {
            document.write(items[i][0]);
        }
        document.write("</td><td onClick=\"select_taxa(" + i + ");\"><img class=\"tt_show\" src=\"char-button.gif\"></td></tr>");
    }

    document.write("</table>");

    var elemlist = document.getElementsByTagName("td");
    var len = elemlist.length;
    for (i = 0; i < len; i++) {
        if (elemlist[i].id.substr(0, 4) == "taxa") {
            taxa_elems[elemlist[i].id.substr(4) - 0] = elemlist[i];
        }
    }
}

// inits the list of the currently selected characteristics
function init_char_flags() {
    var i;
    var j;
    for (i = first_row; i < chars.length; i++) {
        char_flags[i] = new Array();
        for (j = 1; j < chars[i].length; j++) {
            char_flags[i][j] = 0;
        }
        char_row_state[i] = 0;
    }
}

// toggles characteristic (i,j) in the table
function toggle_char(i, j) {
    var k;

    if (char_flags[i][j] == 1) {
        char_flags[i][j] = 0;
    } else {
        if (exclusive_mode) {
            // in exclusive mode, selecting something unselects
            // the other characteristics
            for (k = 1; k < char_flags[i].length; k++) {
                char_flags[i][k] = 0;
            }
        }
        char_flags[i][j] = 1;
    }

    // update char_row_state[i]
    char_row_state[i] = 0;
    for (k = 1; k < char_flags[i].length; k++) {
        if (char_flags[i][k] == 1) {
            if (char_row_state[i] == 0) {
                char_row_state[i] = k;
            } else {
                char_row_state[i] = -1;
            }
        }
    }

    update();
}

// sets the characteristics for a specific taxa
function select_taxa(i) {
    var j;
    var k;

    init_char_flags();		// reset everything to defaults first

    for (j = first_row; j < chars.length; j++) {
        var x = item_cache[i][j];
        if (x) {
            char_flags[j][x] = 1;
            char_row_state[j] = x;
        } else if (items[i][j] == "?") {
            // wildcard -- set them all
            for (k = 0; k < char_flags[j].length; k++) {
                char_flags[j][k] = 1;
            }
            char_row_state[j] = -1;
        } else {
            // polymorphous subset...
            for (k = 0; k < items[i][j].length; k++) {
                char_flags[j][parseInt(items[i][j].charAt(k), 36)] = 1;
            }
            char_row_state[j] = -1;
        }
    }

    update();
}

// do whatever appropriate browser magic to set the background color of
// the specified CSS ID
function set_bgcolor(elem, color) {
    var i;

    if (!elem) return;
    elem.setAttribute("bgColor", color);
}

// update the visual aspect of the characteristics table from char_flags
function update_chars() {
    var i;
    var j;

    for (i = first_row; i < chars.length; i++) {
        for (j = 1; j < char_flags[i].length; j++) {
            if (char_flags[i][j] == 2) {
                set_bgcolor(char_elems[i][j], "#7777AA");
            } else if (char_flags[i][j] == 1) {
                set_bgcolor(char_elems[i][j], "#00FF00");
            } else {
                set_bgcolor(char_elems[i][j], "#AAAAFF");
            }
        }
    }
}

// see if anything in the characteristics row i is selected
function any_in_row_selected(i) {
    return (char_row_state[i] != 0);
}

// update the taxa table to visually match the taxa_flags array
function update_taxa() {
    var i;
    var j;

    for (i = first_row; i < items.length; i++) {
        if (remove_mode) {
            // XXX - to make remove_mode work, I think we change
            // taxa table to not be a table, but rather a list of
            // divs...and then we can do this display="none" hack.
            if (taxa_flags[i] == 1) {
                set_bgcolor(taxa_elems[i], "#0088ff");
                taxa_elems[i].display = "block";
            } else {
                taxa_elems[i].style.display = "none";
                set_bgcolor(taxa_elems[i], "#888800");
            }
        } else {
            if (taxa_flags[i] == 1) {
                set_bgcolor(taxa_elems[i], "#00FF00");
            } else {
                set_bgcolor(taxa_elems[i], "#FF4444");
            }
        }
    }
}

// given the current state of char_flags, compute taxa_flags
// (possible matching taxa)
function compute_taxa() {
    var i;
    var j;
    var k;
    var disp;
    var sub_disp;

    for (i = first_row; i < items.length; i++) {
        disp = 1;
        for (j = first_row; j < chars.length; j++) {
            if (char_row_state[j] == 0) {
                // nothing selected, assume match
            } else if (item_cache[i][j]) {
                if (char_flags[j][item_cache[i][j]] != 1) {
                    disp = 0;
                }
            } else if (items[i][j] == "?") {
                // wildcard, matches everything
            } else {
                // disp remains only if the corresponding
                // element of char_flags is set
                sub_disp = 0;
                for (k = 0; k < items[i][j].length; k++) {
                    if (char_flags[j][parseInt(items[i][j].charAt(k), 36)] == 1) {
                        sub_disp = 1;
                    }
                }
                if (sub_disp == 0) {
                    disp = 0;
                }
            }

        }
        taxa_flags[i] = disp;
    }
}

// some selections obviate others (set char_flags to 2 for obviated ones)
function compute_obviates_binary() {
    var i;
    var j;
    var k;

    for (i = first_row; i < chars.length; i++) {
        if (char_row_state[i] == 0) {
            var poss;
            poss = 0;
            // == 1  --> Yes
            // == 2  --> No
            // == 3  --> Either
            for (j = first_row; j < items.length; j++) {
                if (taxa_flags[j] == 1) {
                    var x = item_cache[j][i];
                    if (x) {
                        poss |= x;
                        if (poss == 3) {
                            // yes and no both possible
                            break;
                        }
                    } else {
                        // must be "?"
                        poss = 3;
                        break;
                    }
                }
            }
            for (j = first_row; j < char_flags[i].length; j++) {
                if (poss & j) {
                    char_flags[i][j] = 0;
                } else {
                    char_flags[i][j] = 2;
                }
            }
        }
    }
}

function compute_obviates() {
    var i;
    var j;
    var k;
    var match_everything;

    if (binary) {
        // use optimized version instead
        compute_obviates_binary();
        return;
    }

    for (i = first_row; i < chars.length; i++) {
        if (char_row_state[i] == 0) {
            // really instead of using a private array for the possibilities, we
            // could use a bitmask...but frankly I don't trust javascript binary
            // arithmetic, so use the poss[] array instead
            var poss;
            poss = new Array();
            match_everything = false;
            // first mark all possibilities
            for (j = first_row; j < items.length; j++) {
                if (taxa_flags[j] == 1) {
                    if (item_cache[j][i]) {
                        poss[item_cache[j][i]] = true;
                    } else if (items[j][i] == "?") {
                        // wildcard - match everything
                        match_everything = true;
                        break;
                    } else {
                        for (k = 0; k < items[j][i].length; k++) {
                            poss[parseInt(items[j][i].charAt(k), 36)] = true;
                        }
                    }
                }
            }

            // now mark remaining unpossibilities
            for (j = first_row; j < char_flags[i].length; j++) {
                if (match_everything || poss[j]) {
                    char_flags[i][j] = 0;
                } else {
                    char_flags[i][j] = 2;
                }
            }
        }
    }
}

var dbg_elem;

function dbg_out(s) {
    if (!dbg_elem) {
        dbg_elem = get_elem_by_tag_id("div", "dbg");
    }
    dbg_elem.innerHTML += "<p>" + s + "</p>\n";
}

function dbg_reset() {
    if (!dbg_elem) {
        dbg_elem = get_elem_by_tag_id("div", "dbg");
    }
    dbg_elem.innerHTML = "";
}

var last_timeout = 0;

function timeout(s) {
    return;
    var t = (new Date()).getTime();
    dbg_out("" + s + ":" + (t - last_timeout) + ";\n");
    last_timeout = t;
}

function update() {
    timeout("upd1");
    compute_taxa();
    timeout("upd2");
    compute_obviates();
    timeout("upd3");
    update_chars();
    timeout("upd4");
    update_taxa();
    timeout("upd5");
}

function do_reset() {
    init_char_flags();
    update();
}

function cache_items() {
    var i;
    var j;

    for (i = first_row; i < items.length; i++) {
        item_cache[i] = new Array();
        for (j = first_row; j < items[i].length; j++) {
            var x = items[i][j];
            if (x != "?" && x.length == 1) {
                item_cache[i][j] = parseInt(x, 36);
            }
        }
    }
}

// initialize the char_headers and char_titles arrays
function setup_char_headers() {
    var i;
    var last_i;
    for (i = 0; i < chars.length; i++) {
        var s = chars[i][0];
        var x = s.indexOf("|");
        if (x == -1) {
            // no header
            char_headers[i] = "";
            char_titles[i] = s;
        } else {
            any_char_headers = true;
            char_headers[i] = s.substr(0, x);
            char_titles[i] = s.substr(x + 1);
        }
    }
    last_i = 0;
    for (i = 0; i < chars.length; i++) {
        if (char_headers[i] == char_headers[last_i]) {
            char_header_run[last_i] = (i + 1) - last_i;
        } else {
            last_i = i;
            char_header_run[i] = 1;
        }
    }
}

function gotouse() {
    window.location = "use.html";
}


function main() {
    cache_items();

    if (binary) {
        // binary is exclusive-only
        exclusive_mode = true;
    }

    setup_char_headers();

    // output the button bar along the top
    document.write("<form onSubmit=\"return false;\">\n");
    document.write("<table width=100%><tr>\n");
    document.write("<td width=10%><input type=\"submit\" value=\"RESET\" onClick=\"do_reset();\"></td>\n");
    document.write("<td align=right width=100%><input type=\"submit\" value=\"How to use SAIKS\" onClick=\"gotouse();\"></td>\n");
    document.write("</table></form><br>\n");
    document.write("</form>\n");

    document.write("<table width=100%><tr><td width=70% valign=top align=center>\n");
    chars_table();
    document.write("</td><td width=30% valign=top align=center>\n");
    taxa_table();
    document.write("</td></tr></table>\n");

    init_char_flags();
    update();
}
