// SLIKS-Alike Interactive Key Software Plus (SAIKS+)
// Modified by Kobe Van de Sande (2017)
// Based on SLIKS-Alike Interactive Key Software (SAIKS)
// Inspired by SLIKS from http://stingersplace.com/SLIKS/ by Gerald F. Guala
// Copyright (c) 2006 Greg Alexander, to be distributed under the terms of
// the GPLv2 (COPYING), or the Apache License
// (http://www.apache.org/licenses/LICENSE-2.0), at your discretion

var footer_text = "SAIKS+ is based on <a href=\"http://www.galexander.org/saiks/\">SAIKS</a> by Greg Alexander, which is based on <a href=\"http://stingersplace.com/SLIKS/\">SLIKS</a> by Stinger.";

// defaults for things that can be overridden in data.js
var binary = false;
var exclusive_mode = true;
var remove_mode = false;		// remove taxa instead of reddening

var first_row = 1;	// to skip chars[0] and items[0] for SLIKS compat
var char_flags = [];
// == 0   --> initial state, is selectable
// == 1   --> currently selected characteristic (click to unselect)
// == 2   --> selected characteristic that triggers a most possible match
// == -1   --> grayed out (obviated characteristic)
var taxa_flags = [];
// == 0   --> not a possible match
// == 1   --> a possible match
// == 2   --> a most possible match

// hopefully eliminate some downstream substring processing by caching
// single-value item characteristics
var item_cache = [];

// used instead of scanning char_flags[row]
var char_row_state = [];
// == 0       --> nothing selected
// == -1      --> several selected
// == 1-35    --> just that col selected (great for exclusive/binary mode!)

// to support categories of characteristics
var char_titles = [];
var char_headers = [];
var char_header_run = [];
var any_char_headers = false;


// emit characteristics table
function chars_table() {
    var i, j;

    var col = $("<div></div>").addClass("col-sm-9");
    var table = create_char_table();

    for (i = first_row; i < chars.length; i++) {
        if (any_char_headers) {
            if (char_header_run[i] > 0) {
                if (i !== first_row) {
                    col.append(table);
                    table = create_char_table();
                }
                if (char_headers[i]) {
                    table.append("<tr><th class=\"active\" colspan=\"2\">" + char_headers[i] + "</th></tr>");
                }
            }
        }

        var char_tr = $("<tr></tr>");
        char_tr.append("<th>" + char_titles[i] + "</th>");

        var char_ul = $("<ul></ul>").addClass("nav nav-pills nav-nested nav-justified");
        char_tr.append($("<td></td>").append(char_ul));

        table.append(char_tr);

        for (j = first_row; j < chars[i].length; j++) {
            var value = $("<li></li>");
            value.attr("id", "char" + i + "m" + j);
            if (is_most_typical(i, j)) {
                value.addClass("typical");
            }
            value.append("<a onclick=\"toggle_char(" + i + "," + j + ");\">" + chars[i][j] + "</a>")
            char_ul.append(value);
        }
    }

    col.append(table);
    return col;
}

function create_char_table() {
    var table = $("<table></table>").addClass("table table-bordered table-chars");
    table.append($("<tbody></tbody>"));
    return table;
}

// emit taxa table
function taxa_table() {
    var i;

    var col = $("<div></div>").addClass("col-sm-3");
    var taxa_ul = $("<ul></ul>").addClass("nav nav-pills nav-stacked");

    for (i = first_row; i < items.length; i++) {
        var value = $("<li></li>");
        value.attr("id", "taxa" + i);
        if (items[i][chars.length]) {
            value.append("<a target=\"_blank\" href=\"" + items[i][chars.length] + "\">" + items[i][0] + "</a>");
        } else {
            value.append(items[i][0]);
        }
        taxa_ul.append(value);
    }

    col.append(taxa_ul);
    return col;
}

// inits the list of the currently selected characteristics
function init_char_flags() {
    for (var i = first_row; i < chars.length; i++) {
        char_flags[i] = [];
        for (var j = first_row; j < chars[i].length; j++) {
            char_flags[i][j] = 0;
        }
        char_row_state[i] = 0;
    }
}

// toggles characteristic (i,j) in the table
function toggle_char(i, j) {
    if (char_flags[i][j] > 0) {
        char_flags[i][j] = 0;
    } else if (char_flags[i][j] === 0) {
        if (exclusive_mode) {
            // in exclusive mode, selecting something unselects
            // the other characteristics
            for (k = first_row; k < char_flags[i].length; k++) {
                char_flags[i][k] = 0;
            }
        }
        char_flags[i][j] = 1;

    }

    // update char_row_state[i]
    char_row_state[i] = 0;
    for (var k = first_row; k < char_flags[i].length; k++) {
        if (char_flags[i][k] === 1) {
            if (char_row_state[i] === 0) {
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
    var j, k;

    init_char_flags();		// reset everything to defaults first

    for (j = first_row; j < chars.length; j++) {
        var x = item_cache[i][j];
        if (x) {
            char_flags[j][x] = 1;
            char_row_state[j] = x;
        } else if (items[i][j] === "?") {
            // wildcard -- set them all
            for (k = 0; k < char_flags[j].length; k++) {
                char_flags[j][k] = 1;
            }
            char_row_state[j] = -1;
        } else {
            // polymorphous subset...
            for (k = 0; k < items[i][j].length; k++) {
                var value = parseInt(items[i][j].charAt(k), 36);
                if (!isNaN(value)) {
                    if (items[i][j].charAt(k + 1) === "+") {
                        char_flags[j][value] = 2;
                    } else {
                        char_flags[j][value] = 1;
                    }
                }
            }
            char_row_state[j] = -1;
        }
    }

    update();
}

// checks if a characteristic has a most possible taxa match
function is_most_typical(i, j) {
    for (var k = first_row; k < items.length; k++) {
        if (!item_cache[k][i]) {
            for (var l = 0; l < items[j][i].length; l++) {
                var char_flag_index = parseInt(items[k][i].charAt(l), 36);
                if (char_flag_index === j && items[k][i].charAt(l + 1) === "+") {
                    return true;
                }
            }
        }
    }
    return false;
}

// update the visual aspect of the characteristics table from char_flags
function update_chars() {
    for (var i = first_row; i < chars.length; i++) {
        for (var j = first_row; j < char_flags[i].length; j++) {
            var elem = $("#char" + i + "m" + j);
            elem.removeClass("selected");
            elem.removeClass("selected-plus");
            elem.removeClass("disabled");
            switch (char_flags[i][j]) {
                case -1:
                    elem.addClass("disabled");
                    break;
                case 1:
                    elem.addClass("selected");
                    break;
                case 2:
                    elem.addClass("selected-plus");
                    break;
            }
        }
    }
}

// update the taxa table to visually match the taxa_flags array
function update_taxa() {
    for (var i = first_row; i < items.length; i++) {
        var elem = $("#taxa" + i);
        elem.removeClass("selected");
        elem.removeClass("selected-plus");
        elem.removeClass("mismatch");
        if (remove_mode) {
            elem.css("display", "block");
        }
        switch (taxa_flags[i]) {
            case 1:
                elem.addClass("selected");
                break;
            case 2:
                elem.addClass("selected-plus");
                break;
            default:
                if (remove_mode) {
                    elem.css("display", "none");
                } else {
                    elem.addClass("mismatch");
                }
        }
    }
}

// given the current state of char_flags, compute taxa_flags
// (possible matching taxa)
function compute_taxa() {
    var i, j, k;

    for (i = first_row; i < items.length; i++) {
        var disp = 1;
        var most_possible = false;
        for (j = first_row; j < chars.length; j++) {
            if (char_row_state[j] === 0) {
                // nothing selected, assume match
            } else if (item_cache[i][j]) {
                var value = char_flags[j][item_cache[i][j]];
                if (!value || value < 1) {
                    disp = 0;
                }
            } else if (items[i][j] === "?") {
                // wildcard, matches everything
            } else {
                // disp remains only if the corresponding
                // element of char_flags is set
                var sub_disp = 0;
                for (k = 0; k < items[i][j].length; k++) {
                    var value = parseInt(items[i][j].charAt(k), 36);
                    if (!isNaN(value) && char_flags[j][value] > 0) {
                        sub_disp = 1;
                        if (items[i][j].charAt(k + 1) === "+") {
                            most_possible = true;
                            char_flags[j][value] = 2;
                        }
                    }
                }
                if (sub_disp === 0) {
                    disp = 0;
                }
            }
        }
        if (most_possible) {
            if (disp === 1) {
                disp = 2;
            } else {
                // unmark the most typical characteristics
                for (j = first_row; j < chars.length; j++) {
                    var values = items[i][j].replace("+", "");
                    for (k = 0; k < values.length; k++) {
                        var value = parseInt(values.charAt(k), 36);
                        if (char_flags[j][value] === 2) {
                            char_flags[j][value] = 1;
                        }
                    }
                }
            }
        }

        taxa_flags[i] = disp;
    }
}

// some selections obviate others (set char_flags to -1 for obviated ones)
function compute_obviates_binary() {
    var i, j;

    for (i = first_row; i < chars.length; i++) {
        if (char_row_state[i] === 0) {
            var poss = 0;
            // == 1  --> Yes
            // == 2  --> No
            // == 3  --> Either
            for (j = first_row; j < items.length; j++) {
                if (taxa_flags[j] > 0) {
                    var x = item_cache[j][i];
                    if (x) {
                        poss |= x;
                        if (poss === 3) {
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
                if (poss && j) {
                    char_flags[i][j] = 0;
                } else {
                    char_flags[i][j] = -1;
                }
            }
        }
    }
}

function compute_obviates() {
    var i, j, k;

    if (binary) {
        // use optimized version instead
        compute_obviates_binary();
        return;
    }

    for (i = first_row; i < chars.length; i++) {
        if (char_row_state[i] === 0) {
            // really instead of using a private array for the possibilities, we
            // could use a bitmask...but frankly I don't trust javascript binary
            // arithmetic, so use the poss[] array instead
            var poss = [];
            var match_everything = false;
            // first mark all possibilities
            for (j = first_row; j < items.length; j++) {
                if (taxa_flags[j] > 0) {
                    if (item_cache[j][i]) {
                        poss[item_cache[j][i]] = true;
                    } else if (items[j][i] === "?") {
                        // wildcard - match everything
                        match_everything = true;
                        break;
                    } else {
                        var values = items[j][i].replace("+", "");
                        for (k = 0; k < values.length; k++) {
                            poss[parseInt(values.charAt(k), 36)] = true;
                        }
                    }
                }
            }

            // now mark remaining unpossibilities
            for (j = first_row; j < char_flags[i].length; j++) {
                if (match_everything || poss[j]) {
                    char_flags[i][j] = 0;
                } else {
                    char_flags[i][j] = -1;
                }
            }
        }
    }
}

function update() {
    compute_taxa();
    compute_obviates();
    update_chars();
    update_taxa();
}

function do_reset() {
    init_char_flags();
    update();
}

function cache_items() {
    for (var i = first_row; i < items.length; i++) {
        item_cache[i] = [];
        for (var j = first_row; j < items[i].length; j++) {
            var x = items[i][j];
            if (x.length === 1) {
                var value = parseInt(x, 36);
                if (!isNaN(value)) {
                    item_cache[i][j] = value;
                }
            }
        }
    }
}

// initialize the char_headers and char_titles arrays
function setup_char_headers() {
    var i, last_i;
    for (i = 0; i < chars.length; i++) {
        var s = chars[i][0];
        var x = s.indexOf("|");
        if (x === -1) {
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
        if (char_headers[i] === char_headers[last_i]) {
            char_header_run[last_i] = (i + 1) - last_i;
        } else {
            last_i = i;
            char_header_run[i] = 1;
        }
    }
}

$(document).ready(function () {
    cache_items();

    if (binary) {
        // binary is exclusive-only
        exclusive_mode = true;
    }

    setup_char_headers();

    var content = $("#content");
    var header = "<div class=\"well\">" + dataset + "</div>";
    content.append(header);

    var buttons = "<div class=\"row row-header\"><div class=\"col-sm-12\">";
    buttons += "<button type=\"button\" class=\"btn btn-default btn-lg\" onclick=\"do_reset();\">";
    buttons += "<span class=\"glyphicon glyphicon-repeat\"></span> RESET";
    buttons += "</button><button type=\"button\" class=\"btn btn-default btn-lg pull-right\" onclick=\"location.href='use.html';\">";
    buttons += "<span class=\"glyphicon glyphicon-info-sign\"></span> How to use SAIKS";
    buttons += "</button></div></div>";

    var well = $("<div></div>").addClass("well");
    well.append(buttons);

    var row = $("<div></div>").addClass("row");
    row.append(chars_table());
    row.append(taxa_table());

    well.append(row);
    content.append(well);

    var footer = "<footer class=\"navbar navbar-default navbar-footer navbar-fixed-bottom\">";
    footer += "<div class=\"container-fluid\"><span class=\"footer-text\">" + footer_text + "</span></div></footer>";

    $("body").append(footer);

    init_char_flags();
    update();
});
