var dataset = "<h2><b>Cryptantha</b> (<b><i>Cryptantha</i></b>) of San Diego County</h2><p>Dataset modified, courtesy of Ron Kelley, transferred to <b>SLIKS</b> (Guala 2004).</p>"

var binary = false;
var exclusive_mode = true;
var remove_mode = false;

var chars = [["Latin Name"],
    ["PLANT|<a href=\"http://www.sci.sdsu.edu/plants/cryptantha/chars/dur.pdf\" target=\"_blank\">Plant Duration", "annual", "perennial"],
    ["PLANT|<a href=\"http://www.sci.sdsu.edu/plants/cryptantha/chars/htwd.pdf\" target=\"_blank\">Plant Width:Height", "height < width", "height > width"],
    ["STEM|<a href=\"http://www.sci.sdsu.edu/plants/cryptantha/chars/triap.pdf\" target=\"_blank\">Stem Trichomes Appressed", "present", "absent"],
    ["STEM|<a href=\"http://www.sci.sdsu.edu/plants/cryptantha/chars/trisp.pdf\" target=\"_blank\">Stem Trichomes Spreading", "present", "absent"],
    ["LEAF|<a href=\"http://www.sci.sdsu.edu/plants/cryptantha/chars/lfshp.pdf\" target=\"_blank\">Basal Leaf Shape", "linear", "oblong", "lanceolate (incl. narrowly lanceolate)", "oblanceolate (incl. narrowly oblanceolate)", "elliptic"],
    ["FLOWER|<a href=\"http://www.sci.sdsu.edu/plants/cryptantha/chars/brac.pdf\" target=\"_blank\">Flower bracts", "absent", "present"],
    ["FLOWER|<a href=\"http://www.sci.sdsu.edu/plants/cryptantha/chars/ped.pdf\" target=\"_blank\">Pedicel in Fruit", "subsessile (less than 0.5 mm long)", "pedicellate (greater than 0.5 mm long"],
    ["CALYX|<a href=\"http://www.sci.sdsu.edu/plants/cryptantha/chars/klgfr.pdf\" target=\"_blank\">Calyx length in fruit", "0-1.75mm", "1.75-2.75mm", "2.75-3.75mm", "3.75-4.75mm", "4.75-5.75mm", "5.75-6.75mm", "6.75-10mm"],
    ["CALYX|<a href=\"http://www.sci.sdsu.edu/plants/cryptantha/chars/kfus.pdf\" target=\"_blank\">Calyx Fusion", "sepals distinct", "sepals basally connate"],
    ["CALYX|<a href=\"http://www.sci.sdsu.edu/plants/cryptantha/chars/kdehis.pdf\" target=\"_blank\">Calyx Dehiscence", "indehiscent", "circumscissile"],
    ["CALYX|<a href=\"http://www.sci.sdsu.edu/plants/cryptantha/chars/kshp.pdf\" target=\"_blank\">Sepal / Calyx Lobe Shape in Fruit", "linear", "oblong (narrowly oblong)", "lanceolate to narrowly lanceolate", "lance-ovate", "ovate", "elliptic"],
    ["CALYX|<a href=\"http://www.sci.sdsu.edu/plants/cryptantha/chars/ktrishp.pdf\" target=\"_blank\">Calyx Trichome Shape", "all straight", "at least some apically curved to hooked"],
    ["COROLLA|<a href=\"http://www.sci.sdsu.edu/plants/cryptantha/chars/corwid.pdf\" target=\"_blank\">Corolla Limb Width", "0-0.75mm", "0.75-1.25mm", "1.25-1.75mm", "1.75-2.25mm", "2.25-2.75mm", "2.75-3.25mm", "3.25-4.25mm", "4.25-5.25mm", "5.25-6.0mm"],
    ["COROLLA|<a href=\"http://www.sci.sdsu.edu/plants/cryptantha/chars/corapp.pdf\" target=\"_blank\">Corolla Throat Appendages", "white", "yellow"],
    ["NUTLET|<a href=\"http://www.sci.sdsu.edu/plants/cryptantha/chars/nutshp.pdf\" target=\"_blank\">Nutlet Shape (incl. wings)", "lanceolate", "lance-ovate", "ovate", "deltate", "round"],
    ["NUTLET|<a href=\"http://www.sci.sdsu.edu/plants/cryptantha/chars/nutmarg.pdf\" target=\"_blank\">Nutlet Margin", "rounded", "sharp-angled (rimmed)", "winged"],
    ["NUTLET|<a href=\"http://www.sci.sdsu.edu/plants/cryptantha/chars/nutsz.pdf\" target=\"_blank\">Nutlet Size", "< 0.75mm", "0.75-1.25mm", "1.25-1.75", "1.75-2.25", "2.25-2.75"],
    ["NUTLET|<a href=\"http://www.sci.sdsu.edu/plants/cryptantha/chars/nuthet.pdf\" target=\"_blank\">Nutlet Heteromorphism", "heteromorphic by size", "heteromorphic by sculpturing", "homomorphic (incl. nutlet solitary)"],
    ["NUTLET|<a href=\"http://www.sci.sdsu.edu/plants/cryptantha/chars/nutsculp.pdf\" target=\"_blank\">Nutlet Sculpturing", "at least one smooth, shiny", "at least one roughened"],
    ["NUTLET|<a href=\"http://www.sci.sdsu.edu/plants/cryptantha/chars/nutpap.pdf\" target=\"_blank\">Rough Nutlet(s) Papillate", "present", "absent"],
    ["NUTLET|<a href=\"http://www.sci.sdsu.edu/plants/cryptantha/chars/nuttub.pdf\" target=\"_blank\">Rough Nutlet(s) Tuberculate", "present", "absent"],
    ["NUTLET|<a href=\"http://www.sci.sdsu.edu/plants/cryptantha/chars/nutmur.pdf\" target=\"_blank\">Rough Nutlet(s) Muricate", "present", "absent"],
    ["NUTLET|<a href=\"http://www.sci.sdsu.edu/plants/cryptantha/chars/nutrdg.pdf\" target=\"_blank\">Nutlet Dorsal Ridge", "absent", "present (sometimes obsure)"]
];


var items = [[""],
    ["<i>Cryptantha affinis</i>", "1", "2", "1", "1", "24", "1", "1", "234", "1", "1", "3", "1", "234", "1", "3", "1", "4", "3", "1", "2", "2", "2", "1", "http://www.sci.sdsu.edu/plants/cryptantha/taxa/C_affinis"],
    ["<i>Cryptantha angustifolia</i>", "1", "2", "1", "1", "12", "1", "1", "234", "1", "1", "1", "1", "2345678", "2", "12", "1", "2", "1", "2", "1", "2", "2", "1", "http://www.sci.sdsu.edu/plants/cryptantha/taxa/C_angustifolia"],
    ["<i>Cryptantha barbigera </i>var.<i> barbigera</i>", "1", "2", "1", "1", "123", "1", "1", "567", "1", "1", "123", "1", "234", "1", "123", "1", "34", "3", "2", "2", "2", "1", "1", "http://www.sci.sdsu.edu/plants/cryptantha/taxa/C_barbigera"],
    ["<i>Cryptantha circumscissa </i>var.<i> circumscissa</i>", "1", "12", "1", "2", "1", "12", "1", "234", "2", "2", "?", "1", "234", "1", "3", "1", "34", "3", "12", "1", "2", "2", "1", "http://www.sci.sdsu.edu/plants/cryptantha/taxa/C_circumscissa"],
    ["<i>Cryptantha clevelandii </i>var.<i> clevelandii</i>", "1", "2", "1", "1", "1", "1", "1", "3456", "1", "1", "1", "1", "2345", "2", "123", "1", "2", "3", "1", "2", "2", "2", "1", "http://www.sci.sdsu.edu/plants/cryptantha/taxa/C_clevelandii"],
    ["<i>Cryptantha clevelandii </i>var.<i> florosa</i>", "1", "2", "1", "1", "1", "1", "2", "3456", "1", "1", "5", "1", "5678", "2", "123", "1", "2", "3", "1", "2", "2", "2", "1", "http://www.sci.sdsu.edu/plants/cryptantha/taxa/C_clevelandii"],
    ["<i>Cryptantha costata</i>", "1", "2", "1", "1", "1", "12", "1", "3456", "1", "1", "2", "1", "234", "1", "1", "2", "34", "3", "2", "1", "2", "2", "1", "http://www.sci.sdsu.edu/plants/cryptantha/taxa/C_costata"],
    ["<i>Cryptantha decipiens</i>", "1", "2", "1", "2", "13", "1", "1", "234", "1", "1", "12", "1", "2345678", "1", "1", "1", "34", "3", "2", "2", "1", "2", "1", "http://www.sci.sdsu.edu/plants/cryptantha/taxa/C_decipiens"],
    ["<i>Cryptantha flaccida</i>", "1", "2", "1", "2", "1", "1", "1", "34", "1", "1", "12", "2", "234567", "2", "1", "1", "345", "3", "1", "2", "2", "2", "1", "http://www.sci.sdsu.edu/plants/cryptantha/taxa/C_flaccida"],
    ["<i>Cryptantha ganderi</i>", "1", "2", "2", "1", "13", "1", "1", "67", "1", "1", "12", "1", "345", "2", "1", "1", "45", "3", "1", "2", "2", "2", "1", "http://www.sci.sdsu.edu/plants/cryptantha/taxa/C_ganderi"],
    ["<i>Cryptantha holoptera</i>", "12", "2", "1", "1", "5", "1", "2", "23", "1", "1", "12", "1", "456", "2", "34", "3", "45", "3", "2", "1", "1", "2", "1", "http://www.sci.sdsu.edu/plants/cryptantha/taxa/C_holoptera"],
    ["<i>Cryptantha intermedia </i>var.<i> intermedia</i>", "1", "2", "1", "1", "23", "1", "1", "345", "1", "1", "12", "1", "6789", "2", "3", "1", "34", "3", "2", "2", "1", "1", "1", "http://www.sci.sdsu.edu/plants/cryptantha/taxa/C_intermedia"],
    ["<i>Cryptantha lepida</i>", "1", "12", "1", "2", "13", "12", "1", "2", "1", "1", "12", "1", "78", "2", "1", "1", "2", "3", "12", "1", "2", "2", "1", "http://www.sci.sdsu.edu/plants/cryptantha/taxa/C_lepida"],
    ["<i>Cryptantha maritima </i>var.<i> maritima</i>", "1", "2", "1", "1", "14", "12", "1", "23", "1", "1", "1", "1", "123", "2", "1", "1", "34", "123", "12", "1", "2", "2", "1", "http://www.sci.sdsu.edu/plants/cryptantha/taxa/C_maritima"],
    ["<i>Cryptantha micrantha</i>", "1", "12", "1", "2", "14", "2", "1", "2", "1", "1", "12", "1", "1234567", "1", "1", "1", "2", "3", "12", "1", "2", "2", "1", "http://www.sci.sdsu.edu/plants/cryptantha/taxa/C_micrantha"],
    ["<i>Cryptantha micromeres</i>", "1", "2", "2", "1", "12", "1", "1", "1", "1", "1", "3", "2", "12", "1", "34", "1", "12", "12", "12", "1", "2", "1", "1", "http://www.sci.sdsu.edu/plants/cryptantha/taxa/C_micromeres"],
    ["<i>Cryptantha microstachys</i>", "1", "2", "1", "1", "12", "1", "1", "12", "1", "1", "1", "1", "123", "1", "1", "1", "3", "3", "1", "2", "2", "2", "1", "http://www.sci.sdsu.edu/plants/cryptantha/taxa/C_microstachys"],
    ["<i>Cryptantha muricata </i>var.<i> denticulata</i>", "1", "2", "1", "1", "1", "1", "1", "234", "1", "1", "3", "1", "34", "1", "34", "12", "234", "3", "2", "2", "1", "1", "2", "http://www.sci.sdsu.edu/plants/cryptantha/taxa/C_muricata"],
    ["<i>Cryptantha muricata </i>var.<i> jonesii</i>", "1", "2", "1", "1", "1", "1", "1", "234", "1", "1", "3", "1", "34", "1", "34", "12", "234", "3", "2", "2", "1", "1", "2", "http://www.sci.sdsu.edu/plants/cryptantha/taxa/C_muricata"],
    ["<i>Cryptantha nevadensis </i>var.<i> nevadensis</i>", "1", "2", "1", "2", "12", "1", "1", "67", "1", "1", "1", "1", "234", "1", "1", "1", "45", "3", "2", "2", "1", "1", "1", "http://www.sci.sdsu.edu/plants/cryptantha/taxa/C_nevadensis"],
    ["<i>Cryptantha pterocarya </i>var.<i> cycloptera</i>", "1", "2", "1", "2", "12", "1", "1", "456", "1", "1", "45", "1", "456", "2", "35", "3", "4", "3", "2", "1", "1", "2", "1", "http://www.sci.sdsu.edu/plants/cryptantha/taxa/C_pterocarya"],
    ["<i>Cryptantha pterocarya </i>var.<i> pterocarya</i>", "1", "2", "1", "2", "12", "1", "1", "456", "1", "1", "45", "1", "456", "2", "35", "13", "4", "12", "2", "1", "1", "2", "1", "http://www.sci.sdsu.edu/plants/cryptantha/taxa/C_pterocarya"],
    ["<i>Cryptantha pterocarya </i>var.<i> purpusii</i>", "1", "2", "1", "2", "12", "1", "1", "456", "1", "1", "45", "1", "456", "2", "3", "13", "4", "12", "2", "1", "1", "2", "1", "http://www.sci.sdsu.edu/plants/cryptantha/taxa/C_pterocarya"],
    ["<i>Cryptantha racemosa</i>", "2", "2", "1", "1", "14", "1", "2", "234", "1", "1", "3", "1", "23456", "2", "3", "3", "234", "1", "2", "2", "1", "2", "1", "http://www.sci.sdsu.edu/plants/cryptantha/taxa/C_racemosa"],
    ["<i>Cryptantha simulans</i>", "1", "2", "1", "2", "14", "1", "1", "3456", "1", "1", "13", "1", "234", "2", "3", "1", "4", "3", "2", "1", "1", "2", "1", "http://www.sci.sdsu.edu/plants/cryptantha/taxa/C_simulans"],
    ["<i>Cryptantha utahensis</i>", "1", "2", "1", "2", "12", "1", "1", "23", "1", "1", "56", "1", "45", "1", "1", "23", "4", "3", "2", "2", "1", "2", "1", "http://www.sci.sdsu.edu/plants/cryptantha/taxa/C_utahensis"]
];
