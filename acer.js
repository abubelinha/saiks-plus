var dataset = "<h2><b>Maples</b> (<b><i>Acer</i></b>) of Michigan: a Leaf Key</h2><p>Dataset originally published in <b>IDENT</b> (Morse 1969) format, 13 March 1969 by L.E. Morse, then transferred to <b>DELTA</b> (Dallwitz 1971) format for use in <b>ONLINE</b> (Pankhurst 1986) 26 February 1987 by G.F. Guala, then transferred to <b>SLIKS</b> (Guala 2004) format 11 July 2005 by G.F. Guala.</p>";

var binary = false;
var exclusive_mode = true;
var remove_mode = false;

var chars = [["Latin Name"],
    ["CAT1|Leaf arrangement", "compound", "simple"],
    ["CAT1|Leaf surface color", "whitened beneath", "light green beneath"],
    ["CAT1|Leaf surface reflectance", "shiny beneath", "dull beneath - whitened or not"],
    ["CAT1|Leaf margin serrations", "regularly serrate with at least 2 teeth per centimeter", "Entire or only very coursely toothed"],
    ["CAT1|Leaf blade lower half lobing", "unlobed on the lower half", "lobed on the lower half"],
    ["Leaf blade lobe tips", "long and tapering", "rounded or blunt"],
    ["Leaf lobe depth", "lobes deep - cleft more than half way to the base of the leaf", "lobed shallowly"],
    ["Stipules", "present", "absent"],
    ["Vestiture of the petioles", "densely pubescent", "glabrous to glabrate"],
    ["CAT2|Vestiture of the lower leaf surface", "noticeably pubescent", "glabrous or nearly so"],
    ["CAT2|Leaf terminal lobe form", "with distinct shoulders", "not shouldered - tapering uniformly from base to apex"],
    ["CAT2|Leaf lobe number", "mostly three", "mostly five"],
    ["CAT2|Leaf lobe sinus shape", "bottom of sinuses U shaped", "bottom of sinuses V shaped"],
    ["Basal leaf sinuses", "narrow or closed", "broad and open"],
    ["Petiole bases", "enlarged and often enclosing axillary buds", "not usually enlarged - the buds well exposed"],
    ["Vestiture of the veins of the lower leaf surface", "densely pubescent", "glabrous to glabrate"],
    ["Sap from a freshly broken petiole", "milky", "clear"],
    ["Size of leaf margin serrations", "minute - more than five per centimeter", "larger, fewer than five per centimeter", "bogus test entry polymorphous for spicatum"]
];

var items = [[""],
    ["Acer campestre", "2", "2", "2", "2", "2", "2+", "?", "2", "2", "?", "1", "?", "?", "2", "2", "?", "1", "2", "http://plants.usda.gov/java/nameSearch?mode=sciname&keywordquery=Acer+campestre"],
    ["Acer negundo", "1+", "2", "?", "2", "?", "1", "?", "2", "2", "?", "2", "?", "2", "2", "1", "?", "2", "2", "http://plants.usda.gov/java/nameSearch?mode=sciname&keywordquery=Acer+negundo"],
    ["Acer nigrum", "2", "2", "2", "2", "?", "1", "2", "1+2", "?", "1", "?", "?", "1", "1", "1+2", "1", "2", "2", "http://plants.usda.gov/java/nameSearch?mode=sciname&keywordquery=Acer+nigrum"],
    ["Acer pensylvanicum", "2", "2", "2", "1", "1", "1", "2", "2", "2", "2", "2", "1", "1", "2", "2", "2", "2", "1", "http://plants.usda.gov/java/nameSearch?mode=sciname&keywordquery=Acer+pensylvanicum"],
    ["Acer platanoides", "2", "2", "1", "2", "2", "1", "2", "2", "2", "2", "1", "2", "1", "2", "2", "2", "1", "2", "http://plants.usda.gov/java/nameSearch?mode=sciname&keywordquery=Acer+platanoides"],
    ["Acer pseudoplatanus", "2", "1", "2", "1", "2", "1", "2", "2", "2", "2", "?", "2", "2", "1", "2", "?", "2", "2", "http://plants.usda.gov/java/nameSearch?mode=sciname&keywordquery=Acer+pseudoplatanus"],
    ["Acer rubrum", "2", "1", "2", "1", "2", "1", "2", "2", "2", "2", "?", "?", "2", "2", "2", "?", "2", "1+23", "http://plants.usda.gov/java/nameSearch?mode=sciname&keywordquery=Acer+rubrum"],
    ["Acer saccharinum", "2", "?", "2", "?", "2", "1", "1", "2", "2", "2", "1", "?", "?", "2", "2", "2", "2", "2", "http://plants.usda.gov/java/nameSearch?mode=sciname&keywordquery=Acer+saccharinum"],
    ["Acer saccharum", "2", "?", "2", "2", "2", "1", "2", "2", "?", "2", "1", "2", "?", "2", "2", "2", "2", "2", "http://plants.usda.gov/java/nameSearch?mode=sciname&keywordquery=Acer+saccharum"],
    ["Acer spicatum", "2", "2", "2", "1", "?", "1", "2", "2", "2", "?", "1", "1", "?", "2", "2", "?", "2", "23", "http://plants.usda.gov/java/nameSearch?mode=sciname&keywordquery=Acer+spicatum"]
];
