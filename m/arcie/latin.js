function massReplace(text, replacements) {
	for (const [key, value] of Object.entries(replacements)) {
		text = text.replace(new RegExp(key, 'g'), value);
	}
	return text;
}

function findSyllables(word) {
	word = word.replace(/([aeiouyæœāēīōūȳ])/g, ".$1");
	word = word.replace(/^(s?)([pbtdckgf])([lrw])\.([aeiouyæœāēīōūȳ])/g, ".$1$2$3$4");
	word = word.replace(/([pbtdckg])([lrw])\.([aeiouyæœāēīōūȳ])/g, ".$1$2$3");
	word = word.replace(/\.([td])l/g, "$1.l");
	word = word.replace(/([pbtdckgfθszxhmnvlrjʤ$1])\.([aeiouyæœāēīōūȳ])/g, ".$1$2");
	word = word.replace(".", "");
	return word;
}

function markStress(word) {
	word = word.replace(/^([^.]*)([aeiouyæœāēīōūȳ])([^.]*)$/g, "$1$2´$3"); //stress monosyllable
	word = word.replace(/^([^.]*)([aeiouyæœāēīōūȳ])([^.]*)\.([^.]*)$/g, "$1$2´$3.$4"); //stress penult of disyllable
	word = word.replace(/([aeiouyæœāēīōūȳ])([^.]*)\.([^.]*)([aeiouy])\.([^.]*)$/g, "$1´$2.$3$4.$5"); //stress antepenult given light penult
	word = word.replace(/\.([^.]*)([æœāēīōūȳ])([^.]*)\.([^.]*)$/g, ".$1$2´$3.$4"); //stress long penult
	word = word.replace(/\.([^.]*)([aeiouy])([^.]+)\.([^.]*)$/g, ".$1$2´$3.$4"); //stress closed penult
	
	word = word.replace(/^([^.]*)([aeiouyæœāēīōūȳ])([^.]*)\.([^.]*)\.([^.]*)([aeiouyæœāēīōūȳ]\´)/g, "$1$2`$3.$4.$5$6"); //secondary stress 
	word = word.replace(/([aeiouyæœāēīōūȳ])([^.]*)\.([^.]*)([aeiouy])\.([^.]*)\.([^.]*)([aeiouyæœāēīōūȳ]\´)/g, "$1`$2.$3$4.$5.$6$7");
	word = word.replace(/\.([^.]*)([æœāēīōūȳ])([^.]*)\.([^.]*)\.([^.]*)([aeiouyæœāēīōūȳ]\´)/g, ".$1$2`$3.$4.$5$6");
	word = word.replace(/\.([^.]*)([aeiouy])([^.]+)\.([^.]*)\.([^.]*)([aeiouyæœāēīōūȳ]\´)/g, ".$1$2`$3.$4.$5$6");

	word = word.replace(/^([^.]*)([aeiouyæœāēīōūȳ])([^.]*)\.([^.]*)\.([^.]*)([aeiouyæœāēīōūȳ]\`)/g, "$1$2`$3.$4.$5$6"); //secondary secondary stress 
	word = word.replace(/([aeiouyæœāēīōūȳ])([^.]*)\.([^.]*)([aeiouy])\.([^.]*)\.([^.]*)([aeiouyæœāēīōūȳ]\`)/g, "$1`$2.$3$4.$5.$6$7");
	word = word.replace(/\.([^.]*)([æœāēīōūȳ])([^.]*)\.([^.]*)\.([^.]*)([aeiouyæœāēīōūȳ]\`)/g, ".$1$2`$3.$4.$5$6");
	word = word.replace(/\.([^.]*)([aeiouy])([^.]+)\.([^.]*)\.([^.]*)([aeiouyæœāēīōūȳ]\`)/g, ".$1$2`$3.$4.$5$6");

	//to add: destressing of prefixes using hyphens
	//e.g. 'accumulātus' is entered as 'ac-cumulātus' and stressed as 'accu`mulā´tus' instead of 'ac`cumulā´tus'
	
	return word;
}

function latinPronouncer() {
	var latinText = document.getElementById("latin").value;
	latinText = latinText.toLowerCase();
	latinText = latinText.split(/\s/);
	for (let i = 0; i < latinText.length; i++) {
		string = latinText[i];
		string = massReplace(string, { "rh" : "r"});
		string = massReplace(string, { "ae" : "æ", "oe" : "œ"});
		string = string.replace(/qu([aeiouyæœāēīōūȳ])/g, "kw$1");
		string = string.replace(/gu([aeiouyæœāēīōūȳ])/g, "gw$1");
		string = string.replace(/^su([aeiouyæœāēīōūȳ])/g, "sw$1");
		string = string.replace(/^i([aeiouāēīōūæœ])/g, "ʤ$1");
		string = string.replace(/([aeiouāēīōūæœ])j([aeiouāēīōūæœ])/g, "$1ʤ$2");
		string = string.replace(/([aouāēōū])i([aeouāēōūæœ])/g, "$1j$2");
		string = string.replace(/([aeiouyæœāēīōūȳ])z/g, "$1zz");
		string = massReplace(string, { "x" : "cs"});
		string = string.replace(/^cs/g, "z");
		string = massReplace(string, { "ph" : "f" , "th" : "θ" , "ch" : "x"});
		string = massReplace(string, { "c" : "k"});
		string = string.replace(/^bd/g, "d");
		string = string.replace(/^tm/g, "m");
		string = string.replace(/^[mkgp]n/g, "n");
		string = string.replace(/^ps/g, "s");
		string = string.replace(/^[pk]t/g, "t");
		string = string.replace(/^[fx]θ/g, "θ");
		string = string.replace(/([aeo])i([pbtdckgfvθszxhmnlr])/g, "$1ĭ$2");
		string = string.replace(/([aeo])u([pbtdckgfvθszxhmnlr])/g, "$1w$2");
		string = massReplace(string, { "aĭ" : "æ" , "oĭ" : "œ" , "eĭ" : "ī" });
		string = massReplace(string, { "ä" : "a" , "ë" : "e" ,  "ï" : "i" , "ö" : "o" , "ü" : "u" });
		
		string = findSyllables(string);
		string = markStress(string);
		
		string = string.replace(/^eks\.h?([aeiouyæœāēīōūȳ][\´\`])/g, "eg.z$1");
		string = string.replace(/([aeiouyæœāēīōūȳ][\´\`]?)\.s([aeiouyæœāēīōūȳ])/g, "$1.z$2");
		string = string.replace(/([aeiouyæœāēīōūȳ][\´\`]?)\.zis$/g, "$1.sis");
		string = string.replace(/([aeiouyæœāēīōūȳ][\´\`]?)s\.([bdgmnlr])/g, "$1z.$2");
		string = string.replace(/([bdgmnlr])s$/g, "$1z");
		
		string = string.replace(/\.([^.]+)[iyeīȳēæœ]\.([aeiouyæœāēīōūȳ][\´\`]?)/g, "\.$1ĭ$2");
		string = string.replace(/([^st])\.tĭ/g, "$1.sĭ");
		string = string.replace(/k([ĭiyeīȳēæœ])/g, "s$1");
		string = string.replace(/g([ĭiyeīȳēæœ])/g, "ʤ$1");
		string = massReplace(string, { "sĭ" : "ʃĭ" , "tĭ" : "ʧĭ" , "zĭ" : "ʒĭ"});
		
		string = string.replace(/s(\.?)ʃ/g, "ʃ$1ʃ");
		string = string.replace(/z(\.?)ʒ/g, "ʒ$1ʒ");
		string = string.replace(/g(\.?)ʤ/g, "ʤ$1ʤ");
		string = string.replace(/p(\.?)f/g, "f$1f");
		string = string.replace(/t(\.?)θ/g, "θ$1θ");
		string = string.replace(/k(\.?)x/g, "x$1x");
		string = string.replace(/([ptkbdgfθszʃʒʧʤxmnlr])(\.?)\1/g, "²$2$1");
		
		string = massReplace(string, { "ā" : "a" , "ē" : "e" ,  "ī" : "i" , "ō" : "o" , "ū" : "u" , "ȳ" : "y" });
		string = massReplace(string, { "æ" : "e" , "œ" : "e" , "y" : "i" });
		string = massReplace(string, { "e\.i" : "e" });
		
		string = string.replace(/\.([^.]*)a$/g, ".$1ə");
		string = string.replace(/\.([^.]*)e$/g, ".$1ê");
		string = string.replace(/\.([^.]*)i$/g, ".$1î");
		string = string.replace(/\.([^.]*)o$/g, ".$1ô");
		string = string.replace(/\.([^.]*)ews$/g, ".$1ê.əs");
		string = string.replace(/\.([^.]*)ewm$/g, ".$1ê.əm");
		
		string = string.replace(/\.([^.]*)a([^.]{2,})$/g, ".$1æ$2");
		string = string.replace(/\.([^.]*)e([^.]{2,})$/g, ".$1ɛ$2");
		string = string.replace(/\.([^.]*)i([^.]{2,})$/g, ".$1ɪ$2");
		string = string.replace(/\.([^.]*)o([^.]{2,})$/g, ".$1ɒ$2");
		string = string.replace(/\.([^.]*)u([^.]{2,})$/g, ".$1ə$2");
		
		string = string.replace(/\.([^.]*)[aeiou]([rl])$/g, ".$1ə$2");
		string = string.replace(/\.([^.]*)[au]([mnst])$/g, ".$1ə$2");
		
		string = string.replace(/([^.]*)e(\´?)s$/g, "$1ê$2z");
		string = string.replace(/\.([^.]*)et$/g, ".$1ɛt");
		string = string.replace(/\.([^.]*)o([nst])$/g, ".$1ɒ$2");
		string = string.replace(/\.([^.]*)i([st])$/g, ".$1ᵻ$2");
		string = string.replace(/\.([^.]*)i(m)$/g, ".$1ɪ$2");
		string = string.replace(/\.([^.]*)e([mn])$/g, ".$1ə$2");
		
		string = massReplace(string, { "ew" : "u" , "e([\´\`])w" : "u$1" });
		string = string.replace(/^su\.b/g, "sə.b"); //sub-
		string = string.replace(/\.([^.]*)u$/g, ".$1juː"); //unstr final
		string = string.replace(/u([\´\`])\./g, "juː$1."); //str open
		string = string.replace(/^([^.]*)u\./g, "$1jᵿ."); //unstr hiatus init
		string = string.replace(/\.([^.]*)u\./g, ".$1jᵿ."); //unstr hiatus med
		string = string.replace(/u([\´\`])([^.]+)/g, "ʌ$1$2"); //str closed
		string = string.replace(/^([^.]*)u([^.´`]+)\./g, "$1ʌ$2."); //unstr init
		string = string.replace(/\.([^.]*)u([^.´`]+)\./g, ".$1ə$2."); //unstr med
		
		string = massReplace(string, { "aw" : "ɔː" , "a([\´\`])w" : "ɔː$1" });
		
		//hiatus
		string = string.replace(/a([\´\`]?)\.([aeiouɒəâêîô])/g, "â$1.$2");
		string = string.replace(/e([\´\`]?)\.([aeiouɒəâêîô])/g, "ê$1.$2");
		string = string.replace(/i([\´\`]?)\.([aeiouɒəâêîô])/g, "î$1.$2");
		string = string.replace(/o([\´\`]?)\.([aeiouɒəâêîô])/g, "ô$1.$2");	
		//closed monosyllable
		string = string.replace(/^([^.]*)wa´([^.]+)$/g, "$1wɒ´$2");
		string = string.replace(/^([^.]*)a´([^.]+)$/g, "$1æ´$2");
		string = string.replace(/^([^.]*)e´([^.]+)$/g, "$1ɛ´$2");
		string = string.replace(/^([^.]*)i´([^.]+)$/g, "$1ɪ´$2");
		string = string.replace(/^([^.]*)o´([^.]+)$/g, "$1ɒ´$2");
		//before semivowel
		string = string.replace(/a([\´\`]?)\.([^.]+)ĭ/g, "â$1.$2ĭ");
		string = string.replace(/e([\´\`]?)\.([^.]+)ĭ/g, "ê$1.$2ĭ");		
		string = string.replace(/i([\´\`]?)\.([^.]+)ĭ/g, "ɪ$1.$2ĭ");		
		string = string.replace(/o([\´\`]?)\.([^.]+)ĭ/g, "ô$1.$2ĭ");		
		//str closed penult	
		string = string.replace(/wa´([^.]+)\.([^.]*)$/g, "wɒ´$1.$2");
		string = string.replace(/a´([^.]+)\.([^.]*)$/g, "æ´$1.$2");
		string = string.replace(/e´([^.]+)\.([^.]*)$/g, "ɛ´$1.$2");
		string = string.replace(/i´([^.]+)\.([^.]*)$/g, "ɪ´$1.$2");
		string = string.replace(/o´([^.]+)\.([^.]*)$/g, "ɒ´$1.$2");
		//open monosyllable
		string = string.replace(/^([^.]*)a´$/g, "$1â´");
		string = string.replace(/^([^.]*)e´$/g, "$1ê´");
		string = string.replace(/^([^.]*)i´$/g, "$1î´");
		string = string.replace(/^([^.]*)o´$/g, "$1ô´");
		//str open penult	
		string = string.replace(/a´\.([^.]*)$/g, "â´.$1");
		string = string.replace(/e´\.([^.]*)$/g, "ê´.$1");
		string = string.replace(/i´\.([^.]*)$/g, "î´.$1");
		string = string.replace(/o´\.([^.]*)$/g, "ô´.$1");
		//antepenult
		string = string.replace(/wa´([^.]*)\.([^.]*)\.([^.]*)$/g, "wɒ´$1.$2.$3");
		string = string.replace(/a´([^.]*)\.([^.]*)\.([^.]*)$/g, "æ´$1.$2.$3");
		string = string.replace(/e´([^.]*)\.([^.]*)\.([^.]*)$/g, "ɛ´$1.$2.$3");
		string = string.replace(/i´([^.]*)\.([^.]*)\.([^.]*)$/g, "ɪ´$1.$2.$3");
		string = string.replace(/o´([^.]*)\.([^.]*)\.([^.]*)$/g, "ɒ´$1.$2.$3");
		//init unstr
		string = string.replace(/^([^.]*)a(²?)\./g, "$1ə$2.");
		string = string.replace(/^([^.]*)e(²?)\./g, "$1ᵻ$2.");
		string = string.replace(/^(h?)i\./g, "$1î.");
		string = string.replace(/^([^.]*)i(²?)\./g, "$1ɪ$2.");
		string = string.replace(/^([^.]*)o\./g, "$1ᵿ.");
		string = string.replace(/^([^.]*)o²\./g, "$1ə².");
		//med unstr
		string = string.replace(/\.([^.]*)a([^.]*)\./g,".$1ə$2.");
		string = string.replace(/\.([^.]*)e([^.]*)\./g,".$1ᵻ$2.");
		string = string.replace(/\.([^.]*)i([^.]*)\./g,".$1ᵻ$2.");
		string = string.replace(/\.([^.]*)o([^.]*)\./g,".$1ə$2.");
		//secondary stress
		string = massReplace(string, { "a`" : "æ`" , "e`" : "ɛ`" , "i`" : "ɪ`" , "o`" : "ɒ`" });
		//adj to stress
		string = string.replace(/a([^.]+)\.([^.]*)([æɛɪɒâêîôuʌ])([\´\`])/g, "æ$1.$2$3$4");
		string = string.replace(/e([^.]+)\.([^.]*)([æɛɪɒâêîôuʌ])([\´\`])/g, "ɛ$1.$2$3$4");
		string = string.replace(/i([^.]+)\.([^.]*)([æɛɪɒâêîôuʌ])([\´\`])/g, "ɪ$1.$2$3$4");
		string = string.replace(/o([^.]+)\.([^.]*)([æɛɪɒâêîôuʌ])([\´\`])/g, "ɒ$1.$2$3$4");
		//r-coloring
		string = string.replace(/wæ([\´\`]?)(\.?)r([^.]*)/g, "wɔː$1$2r$3");
		string = string.replace(/æ([\´\`]?)(\.?)r([^.]*)/g, "ɑː$1$2r$3");
		string = string.replace(/ɛ([\´\`]?)(\.?)r([^.]*)/g, "ɜː$1$2r$3");
		string = string.replace(/ɪ([\´\`]?)(\.?)r([^.]*)/g, "ɜː$1$2r$3");
		string = string.replace(/ɒ([\´\`]?)(\.?)r([^.]*)/g, "ɔː$1$2r$3");
		
		string = massReplace(string, { "²" : "" });
		string = massReplace(string, { "â" : "eɪ" , "ê" : "iː" , "î" : "aɪ" , "ô" : "oʊ" });
		string = string.replace(/eɪ([\´\`]?)(\.?)r/g, "ɛə$1$2r");
		string = string.replace(/iː([\´\`]?)(\.?)r/g, "ɪə$1$2r");
		string = string.replace(/oʊ([\´\`]?)(\.?)r/g, "ɔə$1$2r");
		string = string.replace(/juː([\´\`]?)(\.?)r/g, "jʊə$1$2r");
		string = string.replace(/[əᵻɪᵿ](\.?)r/g, "ə$1r");
		string = string.replace(/ʌ(\.?)r/g, "ɜː$1r");
		string = massReplace(string, { "ĭj" : "iː.j" , "ĭi" : "i"});
		
		string = massReplace(string, { "([ʃʒʧʤ])ĭ" : "$1" });
		string = massReplace(string, { "nĭ" : "nj" });
		string = massReplace(string, { "ĭ" : "i" });
		
		string = string.replace(/\.dj/g, ".ʤ");
		string = string.replace(/\.sj/g, ".ʃ");
		string = string.replace(/\.tj/g, ".ʧ");
		string = string.replace(/\.zj/g, ".ʒ");
		
		string = massReplace(string, { "([ʃʒʧʤ])j([uᵿə])" : "$1$2" });
		string = string.replace(/\.([^.]*)([\´\`])/g, ".$2$1");
		string = string.replace(/^([^.]*)([\´\`])/g, "$2$1");
		string = string.replace(/^\´([^.]*)$/g, "$1");
		string = massReplace(string, { "´" : "ˈ" , "`" : "ˌ" });
		string = massReplace(string, { "ʧ" : "t͡ʃ" , "ʤ" : "d͡ʒ" , "x" : "k"});
		latinText[i] = string;
	}
	
	latinIPA = latinText.join(" ");
    document.getElementById("ipaoutput").innerHTML = "IPA: /" + latinIPA + "/";
	
	for (let i = 0; i < latinText.length; i++) {
		string = latinText[i];
		string = string.replace(/ə\.r/g, "ər.");
		string = string.replace(/^([^.]+)jᵿ/g, "$1ew");
		string = string.replace(/([\.\ˈ\ˌ])([^.]+)jᵿ]/g, "$1$2ew"); 
		string = string.replace(/^([^.]+)juː/g, "$1ew");
		string = string.replace(/([\.\ˈ\ˌ])([^.]+)juː/g, "$1$2ew"); 
		string = string.replace(/([\.\ˈj])aɪ/g, "$1eye");
		string = massReplace(string, { "eɪ" : "ay", "iː" : "ee" , "aɪ" : "y" , "oʊ" : "oh" , "uː" : "oo", "juː" : "yoo"});

		string = string.replace(/ɛ\./g, "eh.");
		string = string.replace(/ɪ\./g, "ih.");
		string = string.replace(/ᵻ\./g, "ih.");
		string = string.replace(/ʌ\./g, "uh.");
		string = string.replace(/^([^.]+)jʊər/g, "$1ure");
		string = string.replace(/([\.\ˈ\ˌ])([^.]+)jʊər/g, "$1$2ure"); 		
		string = massReplace(string, { "ɑːr" : "ar", "ɜːr" : "ur" , "ɔːr" : "or" ,"ʊər" : "oor" , "jʊər" : "yoor" });
		string = massReplace(string, { "æ" : "a", "ɛ" : "e" , "ɪ" : "i" , "ᵻ" : "i" , "ɒ" : "o" , "ʌ" : "u" , "ᵿ" : "uu", "ʊ" : "uu" });
		string = massReplace(string, { "j" : "y" });
		string = string.replace(/t͡ʃ\./g, "tch."); 
		string = massReplace(string, { "t͡ʃ" : "ch" , "d͡ʒ" : "j" , "ʃ" : "sh" , "ʒ" : "zh" , "θ" : "th" });		
		
		string = string.split(/\./);
		for (let j = 0; j < string.length; j++) {
			if (string[j].at(0) === "ˈ" || string[j].at(0) === "ˌ" ) {
				string[j] = string[j].slice(1);
				string[j] = string[j].toUpperCase();
			}
		}
		string = string.join("-");
		latinText[i] = string;
	}
	
	latinRespell = latinText.join(" ");
	document.getElementById("respelloutput").innerHTML = "<a href = \"https://en.wikipedia.org/wiki/Help:Pronunciation_respelling_key\">Pronunciation respelling</a>: <i>" + latinRespell + "</i>";
}