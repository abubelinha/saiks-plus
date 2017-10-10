var dataset = "<h2>Binary</h2><p>Taxons are prime numbers, characters are individual bits in the binary sequence.</p>";

var binary = false;
var exclusive_mode = true;
var remove_mode = false;

var chars = [["unused"],
    ["space 1", "Yes", "No"],
    ["space 2", "Yes", "No"],
    ["space 3", "Yes", "No"],
    ["space 4", "Yes", "No"]
];


var items = [[""],
    ["YYYN", "1", "1", "1", "2"],
    ["YYNY", "1", "1", "2", "1"],
    ["YYNN", "1", "1", "2", "2"],
    ["YNYN", "1", "2", "1", "2"],
    ["YNNN", "1", "2", "2", "2"],
    ["NYNN", "2", "1", "2", "2"],
    ["NNYN", "2", "2", "1", "2"]
];
