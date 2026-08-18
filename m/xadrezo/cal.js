function mod(n, m) {
	return ((n % m) + m) % m;
}

function setDate(year, month, day, offset = 0) {
	var date = new Date(Date.UTC(year, month-1, day, 12, 0, 0) + offset)
	date.setUTCFullYear(year)
	
	return date
}

function getEpact(year) {
	var goldenNumber = mod(year, 19) + 1
	
	var epactShift = (year - 1582) * 11
	var saltusLunae = Math.floor((year - 1596)/19)+1
	var solarEq = -1 * (Math.floor(year / 100) - 15) + (Math.floor(year / 400) - 3)
	var lunarEq = Math.floor((year - 1800)/2500) + 1 + Math.floor((year - 2100)/2500) + 1 + Math.floor((year - 2400)/2500) + 1 + Math.floor((year - 2700)/2500) + 1 + Math.floor((year - 3000)/2500) + 1 + Math.floor((year - 3300)/2500) + 1 + Math.floor((year - 3600)/2500) + 1 + Math.floor((year - 3900)/2500) + 1 
	
	var epact = mod(26 + epactShift + saltusLunae + solarEq + lunarEq, 30)
	var special = (epact == 25 && goldenNumber > 11) ? 1 : 0
	
	return [epact, special]
}

// -- LOREMESE --
function translateLRM(syl) {
	var translate = {
		"a": "α",
		"b": "в",
		"g": "г",
		"d": "d",
		"e": "є",
		"u": "y",
		"v": "y",
		"z": "z",
		"i": "ϝ",
		"c": "k",
		"l": "l",
		"m": "m",
		"n": "n",
		"s": "ʒ",
		"o": "o",
		"p": "c",
		"r": "p",
		"ç": "w",
		"x": "w",
		"t": "т",
		
		"A": "A",
		"B": "В",
		"G": "Γ",
		"D": "Δ",
		"E": "E",
		"U": "Y",
		"V": "Y",
		"Z": "Z",
		"I": "Ϝ",
		"C": "K",
		"L": "Λ",
		"M": "M",
		"N": "N",
		"S": "Ʒ",
		"O": "O",
		"P": "C",
		"R": "P",
		"Ç": "W",
		"X": "W",
		"T": "T",
		
		"₱": "₵",
		"€": "₵",
		"$": "₵",
		
		"~": "~",
		"<": "<",
		">": ">",
		" ": " ",
	}

	if (/\b\d+\b/ig.test(syl)) {return syl}
	if (/\p{P}/uig.test(syl)) {return syl}
	if (syl in translate) {return translate[syl]}
	return "<font style=\"color: red;\">�</font>"
}

function convertTextLRM(inputText) {
	convstring = "";
	for (var i = 0; i < inputText.length; i++) {
		convstring += translateLRM(inputText[i])}

	return convstring
}

function getWeekdayLRM(date) {
	return (date.getUTCDay()+6)%7
}

function getFirstDayLRM(year) {
	// var equinoxDate = new Date(Date.UTC(year, 2, calcEquiSol(1, year)))
	var equinoxDate = new Date(Date.UTC(year, 2, 20))
	equinoxDate.setFullYear(year)
	
	return new Date(equinoxDate - getWeekdayLRM(equinoxDate) * 86400000)
}

function calcDateLRM(date) {
	var year = date.getFullYear()
	var firstDay = getFirstDayLRM(year)
	
	if (date < firstDay) {
		year = year - 1
		firstDay = getFirstDayLRM(year)
	}
	
	var doy = Math.floor((date - firstDay) / 86400000)
	
	var quarterNo = Math.floor(doy / 91)
	var doq = doy % 91
	
	var woq = Math.floor(doq / 7)
	var woy = quarterNo*91 + woq
	var dow = doq % 7
	
	// convert raw data to month and day here
	var month = (quarterNo + 1)*3 - (woq < 9) - (woq < 5)
	var day = doq - 35*(woq > 4) - 28*(woq > 8) + 1 + 28*(month == 13)
	year = year + 1213
	
	var suffix = 0;
	if (year < 1) {year = (Math.abs(year)+1); suffix = 1}
	
	return [day, month-1, year, suffix]
}

// --- NOELLASTANI ---
function bijectiveString(m, k) {
  if (m == 0) {
	  return "0";
  }
  let string = [];
  function f(x) {
	return Math.ceil(x) - 1;
  }
  let qn = f(m / k); // q0
  string.push(m - qn * k); // a0
  while (qn != 0) {
	let qnInc = f(qn / k);
	let anInc = qn - qnInc*k;
	string.push(anInc);
	qn = qnInc;
  }
  return string.reverse().join('');
}

function calcDateNOE(date, natscr = false) {
	// 6 days, 6 weeks, 6 months per year since january 1st 2005

	var epoch = new Date(Date.UTC(2005, 0, 1))
	var dayNumber = Math.floor((date - epoch) / 86400000)
	
	var year = Math.floor(dayNumber / 216) + 1
	var weekTotal = Math.floor(dayNumber / 6)
	var doy = mod(dayNumber, 216)
	
	var month = Math.floor(doy / 36)
	var week = mod(weekTotal, 6)
	var day = mod(doy, 6)
	
	var dayNames = ["Mirtai", "Sekretai", "Ventita", "Warahai", "Desimatai", "Rahatai"]
	var dayNamesW6 = ["Mirdsune", "Sekrune", "Awa Dsune", "Ape Dsune", "Repo", "Phesti"]
	var weekNames = ["Miraha", "Sekra", "Druraha", "Deuxha", "Menya", "Dsune"]
	var monthNames = ["Nèlè", "Britani", "Phrankani", "Doidse", "Yalaji", "Suomi"]
	
	if (natscr) {
		var dayNames = ["\\Mi'rtai", "\\Sekre'tai'", "\\Ventitë'", "\\Warahai'", "\\Desimatai", "\\Rhahatai"]
		var dayNamesW6 = ["\\Mirdsu'ne", "\\Sekrune", "\\Awa'  \\Dsune", "\\Ape'  \\Dsune", "\\Repo", "\\Phesti"]
		var weekNames = ["\\Miraha", "\\Sekra", "\\Drhuraha'", "\\Deux'ha", "\\Menya", "\\Dsune"]
		var monthNames = ["\\Nëlë", "\\Britani", "\\Phrankani", "\\Doidse", "\\Yalaji", "\\Suomi"]
	}
	
	var dayN = dayNames;
	if (week == 5) {dayN = dayNamesW6}
	
	if (year < 1) {
		if (natscr) {
			year = (Math.abs(year)+ 1) + "  \\ANC" //bijectiveString(Math.abs(year)+ 1, 6) + " ANC"
		} else {
			year = (Math.abs(year)+ 1)+ " BNC"
		}
	} 
	
	return [dayN[day], weekNames[week], monthNames[month], year]
}

// --- WEST NOELLASTANI ---

function isLeapWNL(year) {
	return mod((year * 699 + 1545), 3200) < 699
}

function getYearLengthWNL(year) {
	return 360 + 24 * isLeapWNL(year)
}

function calcDateWNL(date, natscr = false) {
	var epoch = new Date(Date.UTC(2005, 0, 1))
	var dayNumber = Math.floor((date - epoch) / 86400000) + 1
	
	// console.log(dayNumber)
	
	var day = mod(dayNumber-1, 6)
	var month = 0
	
	if (dayNumber > 0) {
		var yearNum = 1;
		var totalDays = 0;
		while (true) {
			// console.log(yearNum + ": " + getYearLengthWNL(yearNum))
			if (totalDays + getYearLengthWNL(yearNum) > dayNumber) break;
			totalDays = totalDays + getYearLengthWNL(yearNum);
			yearNum = yearNum + 1;
		}
	} else {
		var yearNum = 1;
		var totalDays = 0;
		while (true) {
			// console.log(yearNum + ": " + getYearLengthWNL(yearNum))
			yearNum = yearNum - 1;
			totalDays = totalDays - getYearLengthWNL(yearNum);
			if (totalDays < dayNumber) break;
		}
	}
	
	
	if ((dayNumber - totalDays) == 0) {
		if (dayNumber > 0) {
			yearNum = yearNum - 1;
		}
	}
	
	var dayYear = dayNumber - totalDays - 1;
	if (dayYear == -1) {dayYear = getYearLengthWNL(yearNum) - 1}
	
	var month = Math.floor(dayYear / 24)
	var week = mod(Math.floor(dayYear / 6), 4)
	
	var era = 5
	if (dayNumber < -41410) {era = 0}
	if (dayNumber >= -41410 && dayNumber < -24651) {era = 1}
	if (dayNumber >= -24651 && dayNumber < -8280) {era = 2}
	if (dayNumber >= -8280 && dayNumber < -1826) {era = 3}
	if (dayNumber >= -1826 && dayNumber < 1) {era = 4}
	if (dayNumber >= 6910) {era = 6}
	
	var suffix = 0
	if (yearNum < 1) {yearNum = (Math.abs(yearNum)+1);} //suffix = 1}
	
	return [day, week, month, yearNum, suffix, era]
}

// --- ALLOTI ---

function getWeekdayALL(date) {
	return mod((Math.floor(date.getTime()/86400000) + 2440589), 6)
}

function isLeapALL(year) {
	if ((0 == mod(year, 4)) && (0 != mod(year, 100)) || (0 == mod(year, 400))) {
		return true
	} else {
		return false
	}
}

function calcDateALL(date) {
	var epoch;
	if ((date.getUTCFullYear() < 100) && (date.getUTCFullYear() > -1)) {
		epoch = new Date(String(date.getUTCFullYear()).padStart(4, '0') + '-07-29T00:00:00Z')
	} else {
		epoch = new Date(Date.UTC(date.getUTCFullYear(), 6, 29))
	};
	
	if (Math.floor((date - epoch) / 86400000) < 0) {
		if ((date.getUTCFullYear() - 1 < 100) && (date.getUTCFullYear() - 1 > -1)) {
		epoch = new Date(String(date.getUTCFullYear() - 1).padStart(4, '0') + '-07-29T00:00:00Z')
	} else {
		epoch = new Date(Date.UTC(date.getUTCFullYear() - 1, 6, 29))
		};
	}
	
	var dayNumber = Math.floor((date - epoch) / 86400000)
	
	var weekday = getWeekdayALL(date)
	var day = 0
	var month = 0
	var year = epoch.getUTCFullYear() - 730
	
	var leap = isLeapALL(epoch.getUTCFullYear() + 1)
	
	var monthDays = [0, 36 + leap, 72 + leap, 108 + leap, 144 + leap, 180 + leap, 217 + leap, 254 + leap, 291 + leap, 328 + leap, 999];
	
	while (true) {
		if (dayNumber >= monthDays[month] && dayNumber < monthDays[month+1]) break;
		month = month + 1;
	}
	// console.log (epoch)
	// console.log (dayNumber)
	
	var day = dayNumber - monthDays[month] + 1
	
	var weekdayNames = ["Avarav", "Rav", "Ostav", "Elnav", "Kanav", "Liav"]
	var monthNames = ["Ujore", "Erae", "Sote", "Lenone", "Ankane", "Solaune", "Ilaune", "Daunene", "Esefe", "Sime"]
	
	if (year < 1) {year = (Math.abs(year)+1) + " BT"}
	
	return [weekdayNames[weekday], day, monthNames[month], year]
}

// --- SUNTERIA ---

function numberSUN(x, iter = 0) {
	var number = x
	var numberString = ""
	
	if (iter > 0 && x == 0) {return 0}
	
	var parseNum = [numberSUN(Math.floor(x / 1000), iter + 1), Math.floor(x / 100) % 10, Math.floor(x / 10) % 10, x % 10]
	
	var digits = [0, "", "", "", "", "", "", "", "", ""]
	
	numberString = (parseNum[0] != 0 ? parseNum[0] + "" : "") + (parseNum[1] != 0 ? digits[parseNum[1]] + "" : "") + (parseNum[2] != 0 ? digits[parseNum[2]] + "" : "") + (parseNum[3] != 0 ? digits[parseNum[3]] : "")
	if (iter > 0) {return numberString}
	
	if (numberString.slice(0, 1) == "" && numberString.length > 1) {numberString = numberString.slice(1)}
	
	return "<text style=\"border-top-width: 1.75px; padding-top: 2.5px; border-top-style: solid;\">" + numberString + "</text>"
}

function isFatSUN(year) {
	return (mod(year, 5) == 0)
}

function isLeapSUN(year) {
	return (mod(year, 19) == 0 || mod(year, 19) == 3 || mod(year, 19) == 6 || mod(year, 19) == 8 || mod(year, 19) == 11 || mod(year, 19) == 14 || mod(year, 19) == 17)
}

function getYearLengthSUN(year) {
	return 354 + isFatSUN(year) + 30 * isLeapSUN(year)
}

function calcDateSUN(date) {
	var epoch = new Date(Date.UTC(-1126, 11, 9))
	// var epoch = new Date(Date.UTC(-1127, 6, 1))
	var dayNumber = Math.floor((date - epoch) / 86400000) + 1
	
	if (dayNumber > 0) {
		var yearNum = 1;
		var totalDays = 0;
		while (true) {
			// console.log(yearNum + ": " + getYearLengthSUN(yearNum))
			
			if (totalDays + getYearLengthSUN(yearNum) > dayNumber) break;
			totalDays = totalDays + getYearLengthSUN(yearNum);
			yearNum = yearNum + 1;
		}
	} else {
		var yearNum = 1;
		var totalDays = 0;
		while (true) {
			// console.log(yearNum + ": " + getYearLengthSUN(yearNum))
			yearNum = yearNum - 1;
			totalDays = totalDays - getYearLengthSUN(yearNum);
			if (totalDays < dayNumber) break;
		}
	}
	
	
	if ((dayNumber - totalDays) == 0) {
		if (dayNumber > 0) {
			yearNum = yearNum - 1;
		}
	}
	
	var day = 0
	var month = 0
	
	var leap = isFatSUN(yearNum)
	
	var monthDays = [0, 30, 59 + leap, 89  + leap, 118 + leap, 148 + leap, 177 + leap, 207 + leap, 236 + leap, 266 + leap, 295 + leap, 325 + leap, 354 + leap, 999];
	
	var dayYear = dayNumber - totalDays - 1;
	
	if (dayYear == -1) {dayYear = getYearLengthSUN(yearNum) - 1}
	
	// console.log(dayYear)
	
	if (dayYear > 0) {
		while (true) {
			// console.log(month)
			if (dayYear >= monthDays[month] && dayYear < monthDays[month+1]) break;
			month = month + 1;
			
		}
	}
	
	// console.log (dayNumber)
	var day = dayYear - monthDays[month] + 1
	
	var suffix = ""
	
	if (yearNum < 1) {yearNum = (Math.abs(yearNum)+1); var suffix = " IPT"}
	
	var ponkudoDay = mod(dayNumber - 1, 15)
	
	return [day, month, yearNum, suffix, ponkudoDay]
}

// -- RANGEI

function calcDateRAN(date) {
	var year = date.getUTCFullYear()
	var epoch = new Date(Date.UTC(year, 11, calcEquiSol(4, year), 12, 0, 0))
	epoch.setUTCFullYear(year)
	
	var dayNumber = Math.floor((date - epoch) / 86400000)
	
	if (dayNumber < 0) {
		year = date.getUTCFullYear() - 1
		epoch = new Date(Date.UTC(year, 11, calcEquiSol(4, year), 12, 0, 0))
		epoch.setUTCFullYear(year)
		
		dayNumber = Math.floor((date - epoch) / 86400000)
	}
	
	var day = 0
	var month = 0
	
	var nextEpoch = new Date(Date.UTC(year+1, 11, calcEquiSol(4, year+1), 12, 0, 0))
	nextEpoch.setUTCFullYear(year+1)
	var leap = Math.floor((nextEpoch - epoch) / 86400000) - 365
	
	var monthDays = [0, 1 + leap, 92 + leap, 183 + leap, 274 + leap, 999];
	
	if (dayNumber >= 0) {
		while (true) {
			if (dayNumber >= monthDays[month] && dayNumber < monthDays[month+1]) break;
			month = month + 1;
			
		}
	}
	
	var day = dayNumber - monthDays[month] + 1
	
	var monthNames = ["Jaucoiklyn", "Dèž", "Raš", "Zìnd", "Dìt"]
	var monthName = monthNames[month]
	
	var yearNum = year + 1
	var suffix = ""
	
	if (yearNum < 1) {yearNum = (Math.abs(yearNum)+1); var suffix = " BE"}
	
	if (day == 1 && month == 0) {day = ""}
	if (day == 2 && month == 0) {day = ""; monthName = "Sècoik"}
	
	return [day, monthName, yearNum, suffix]
}

// -- MALLIA

function getWeekdayMAL(date) {
	return mod((Math.floor(date.getTime()/86400000) + 2440591), 4)
}

function isLeapMAL(year) {
	return isLeapALL(year)
}

function numberMAL(number) {
  let mal = '';
  
  if (number == 0) {return "«ə»"}
  
  mal += 'm'.repeat(number / 2000);  number %= 2000; 
  mal += 'w'.repeat(number / 1000);  number %= 1000; 
  mal += 'l'.repeat(number / 500);   number %= 500;  
  mal += 'p'.repeat(number / 400);   number %= 400;
  mal += 'f'.repeat(number / 300);   number %= 300;
  mal += 's'.repeat(number / 200);   number %= 200;
  mal += 't'.repeat(number / 100);   number %= 100;
  mal += 'k'.repeat(number / 50);    number %= 50;
  mal += 'h'.repeat(number / 40);    number %= 40;
  mal += 'r'.repeat(number / 30);    number %= 30;
  mal += 'j'.repeat(number / 20);    number %= 20;
  mal += 'g'.repeat(number / 10);    number %= 10;
  mal += 'd'.repeat(number / 5);     number %= 5;
  mal += 'z'.repeat(number / 4);     number %= 4;
  mal += 'n'.repeat(number / 3);     number %= 3;
  mal += 'v'.repeat(number / 2);     number %= 2;
  mal += 'b'.repeat(number);

  return "“" + mal + "”";
}

function calcDateMAL(date) {
	var epoch;
	if ((date.getUTCFullYear() < 100) && (date.getUTCFullYear() > -1)) {
		epoch = new Date(String(date.getUTCFullYear()).padStart(4, '0') + '-06-02T00:00:00Z')
	} else {
		epoch = new Date(Date.UTC(date.getUTCFullYear(), 5, 2))
	};
	
	if (Math.floor((date - epoch) / 86400000) < 0) {
		if ((date.getUTCFullYear() - 1 < 100) && (date.getUTCFullYear() - 1 > -1)) {
		epoch = new Date(String(date.getUTCFullYear() - 1).padStart(4, '0') + '-06-02T00:00:00Z')
	} else {
		epoch = new Date(Date.UTC(date.getUTCFullYear() - 1, 5, 2))
		};
	}
	
	var dayNumber = Math.floor((date - epoch) / 86400000)
	
	var weekday = getWeekdayMAL(date)
	var day = 0
	var month = 0
	var year = epoch.getUTCFullYear() + 163
	
	var leap = isLeapMAL(epoch.getUTCFullYear() + 1)
	
	var monthDays = [0, 40, 80, 121, 162, 203 + leap, 244 + leap, 285 + leap, 325 + leap, 999];
	
	while (true) {
		if (dayNumber >= monthDays[month] && dayNumber < monthDays[month+1]) break;
		month = month + 1;
	}
	
	var day = dayNumber - monthDays[month] + 1
	
	var suffix = ""
	if (year < 1) {year = (Math.abs(year)+1); suffix = " BE"}
	
	return [weekday, day, month, year, suffix]
	//return [weekdayNames[weekday], day, monthNames[month], year]
}

// --- CRING ---

function romanNumCRG(int) {
  let roman = '';

  roman +=  'M'.repeat(int / 1000);  int %= 1000; 
  roman += 'CM'.repeat(int / 900);   int %= 900; 
  roman +=  'D'.repeat(int / 500);   int %= 500;  
  roman += 'CD'.repeat(int / 400);   int %= 400;
  roman +=  'C'.repeat(int / 100);   int %= 100;
  roman += 'XC'.repeat(int / 90);    int %= 90;
  roman +=  'L'.repeat(int / 50);    int %= 50;
  roman += 'XL'.repeat(int / 40);    int %= 40;
  roman +=  'X'.repeat(int / 10);    int %= 10;
  roman += 'IX'.repeat(int / 9);     int %= 9;
  roman +=  'V'.repeat(int / 5);     int %= 5;
  roman += 'IV'.repeat(int / 4);     int %= 4;
  roman +=  'I'.repeat(int);

  return roman;
}

function complementCRG(number) {
	if (number >= 0) {return number}
	
	number = ((number+1) * -1).toString()
	
	number = number.split('')
	for (let i=0 ; i < number.length; i++ ){        
		if (number[i] != '.'){
			number[i] = String(9 - Number(number[i]) + 0);
		 }
	}
	
	if (number[0] == "9") {number[0] = ""}
	
	number = "<text style='text-decoration-line: overline;'>9</text>" + number.join("")
	return number
}

function numberScriptCRG(number) {
	var raw = String(complementCRG(number)).replace("<text style='text-decoration-line: overline;'>9</text>", "X")
	
	if (raw.length % 2 != 0) {raw = "_" + raw}
	
	raw = raw.match(/.{1,2}/g);
	raw = raw.join("} [")
	raw = raw.replaceAll("_", "")
	raw = raw.replaceAll(/0([0-9])/g, "$1")
	
	return "[" + raw + "}"
}

function calcDateCRG(date) {
	var epoch = new Date(Date.UTC(2005, 0, 1))
	var dayNumber = Math.floor((date - epoch) / 86400000) + 1
	
	var day = mod(dayNumber-1, 24) + 1
	var month = 0
	
	if (dayNumber > 0) {
		var yearNum = 1;
		var totalDays = 0;
		while (true) {
			// console.log(yearNum + ": " + getYearLengthWNL(yearNum))
			if (totalDays + getYearLengthWNL(yearNum) > dayNumber) break;
			totalDays = totalDays + getYearLengthWNL(yearNum);
			yearNum = yearNum + 1;
		}
	} else {
		var yearNum = 1;
		var totalDays = 0;
		while (true) {
			// console.log(yearNum + ": " + getYearLengthWNL(yearNum))
			yearNum = yearNum - 1;
			totalDays = totalDays - getYearLengthWNL(yearNum);
			if (totalDays < dayNumber) break;
		}
	}
	
	
	if ((dayNumber - totalDays) == 0) {
		if (dayNumber > 0) {
			yearNum = yearNum - 1;
		}
	}
	
	var dayYear = dayNumber - totalDays - 1;
	if (dayYear == -1) {dayYear = getYearLengthWNL(yearNum) - 1}
	
	var relWeek = mod(Math.floor((dayNumber-1) / 6), 6)
	
	var month = Math.floor(dayYear / 24)
	
	//var monthNamesCRG = ["Ļiuš Tļiulg", "Koučej", "Ðauňk", "Faulg", "Mouls", "Tļiuzz", "Kriuň", "Am Ndaumm", "Ciužž", "Riunt", "Koun", "Haukej", "Żżauňk", "Vvaunt", "Staužej", "Ļiuš Soulg"] //["Ļoeš Tloelg", "Kuočäj", "Ðoaňk", "Foalg", "Muols", "Tloezz", "Kroeň", "Am Ndoamm", "Coežž", "Roent", "Kuon", "Hoakäj", "Żżoaňk", "Vvoant", "Stoažej", "Ļoeš Suolg"]
	
	return [day, month, yearNum, relWeek == 5]
}

// KZMR

function isLeapKZM(year) {
	return (mod(year, 17) == 0 || mod(year, 17) == 4 || mod(year, 17) == 8 || mod(year, 17) == 13)
}

function getYearLengthKZM(year) {
	return 365 + isLeapKZM(year)
}

function calcDateKZM(date) {
	var d = date;
	var dayNumber = Math.floor(d.getTime() / 86400000) - 12907
	
	//var dayYear = mod(dayNumber, 365)
	//var year = Math.floor(dayNumber / 365) + 1892
	
	if (dayNumber > 0) {
		var yearNum = 1892;
		var totalDays = 1;
		while (true) {
			if (totalDays + getYearLengthKZM(yearNum) > dayNumber) break;
			totalDays = totalDays + getYearLengthKZM(yearNum);
			yearNum = yearNum + 1;
		}
	} else {
		var yearNum = 1892;
		var totalDays = 0;
		while (true) {
			yearNum = yearNum - 1;
			totalDays = totalDays - getYearLengthKZM(yearNum);
			if (totalDays < dayNumber) break;
		}
		totalDays += 1
	}
	
	/*
	if ((dayNumber - totalDays) == 0) {
		if (dayNumber > 0) {
			yearNum = yearNum - 1;
		}
	}
	*/
	
	var year = yearNum
	
	var dayYear = dayNumber - totalDays;
	
	var lunarDoy = mod(dayNumber - 1, 148)
	
	var weekday = mod(dayNumber + 2, 9)
	
	var monthDays = [0, 46, 47, 92, 137, 138, 183, 228, 229, 274, 319, 320, 999]
	var monthNames = ["Hškath", "Prsith", "Kpgath", "Hška'sþbhi", "Prsi'sþbhi", "Kpga'sþbhi", "Hškasv", "Prsisv", "Kpgasv", "Hškanrh", "Prsinrh", "Kpganrh", "Ptnaprsithd"]
	
	if (isLeapKZM(year)) {
		monthDays = [0, 46, 48, 93, 138, 139, 184, 229, 230, 275, 320, 321, 999]
	}

	var month = 0
	if (dayYear >= 0) {
		while (true) {
			if (dayYear >= monthDays[month] && dayYear < monthDays[month+1]) break;
			month = month + 1;
		}
	}
	
	var day = dayYear - monthDays[month] + 1
	
	if (mod(month, 3) == 1) {
		if (day == 2) {
			month = 12
		}
		day = 0
	} else if (mod(month, 3) == 0) {
		day = (46 + (month == 0 ? 1 : 0)) - day
	}
	
	var lunarMonthDays = [0, 30, 60, 89, 118, 999]
	var lunarMonthNames = ["Ng Kžri", "Ng Žrxci", "Ng Tšrn", "Ng Hšri", "Ng Hrni"]

	var lunarMonth = 0
	if (lunarDoy >= 0) {
		while (true) {
			if (lunarDoy >= lunarMonthDays[lunarMonth] && lunarDoy < lunarMonthDays[lunarMonth+1]) break;
			lunarMonth = lunarMonth + 1;
		}
	}
	
	var lunarDay = lunarDoy - lunarMonthDays[lunarMonth] + 1
	
	var weekdayNames = ["Ngkahvm", "Bdkuhvm", "Sgrkuhvm", "Spnkahvm", "'Hngrgkahvm", "Tptkahvm", "Brxskahvm", "'Snšrkahvm", "'Tnrhkihvm"]
	
	//return [-1, day, monthNames[month], year + 1214]
	return [weekday, day, month, lunarDay, lunarMonth, year]
}

// FOI

function getFirstDayFOI(year){
	var epact = getEpact(year)
	var epactN = getEpact(year+1)
	var offset = 86400000 * (mod(31-epact[0], 30) + (mod(31-epact[0], 30) == 0 ? 30 : 0) - 1)
	var hollow = 86400000 * (((epact[0] != 0) && (epact[0] < (25 - epact[1])) ? -1 : 0) - epact[1])
	
	var moons = [setDate(year, 5, 29, offset + hollow),	// june
					setDate(year, 6, 27, offset), 		// july
				]
	
	for (let i = 0; i < moons.length; i++) {
			if (setDate(year, 6, getFirstDayLRM(year).getUTCDate() - 1) > moons[i]) {
				delete moons[i];
			} else {
				var bdm = new Date(moons[i].getTime() + (mod(7 - (mod((moons[i].getUTCDay())-1, 7) + 7), 7)) * 86400000)
				
				return new Date(bdm.getTime())
			}
		}
}

function calcDateFOI(date) {
	var year = date.getUTCFullYear()
	
	var today = Math.floor(date/86400000)
	
	var newYear = getFirstDayFOI(year)
	var dayYear = Math.floor((date - newYear) / 86400000)
	
	if (dayYear < 0) {
		year -= 1
		newYear = getFirstDayFOI(year)
		dayYear = dayYear = Math.floor((date - newYear) / 86400000)
	}
	
	var month = 0
	var leap = (mod(Math.floor((getFirstDayFOI(year + 1) - getFirstDayFOI(year)) / 86400000) / 7, 2) == 1) * 7
	
	var monthDays = [0, 35, 63, 91, 119, 147, 175, 210, 238, 266, 294 + leap, 322 + leap, 350 + leap, 999]
	
	if (dayYear >= 0) {
		while (true) {
			if (dayYear >= monthDays[month] && dayYear < monthDays[month+1]) break;
			month = month + 1;
		}
	}
	
	var day = dayYear - monthDays[month] + 1
	
	return [day, month, year + 1213] //1213 //1438]
}

// JKAWI

function ordinalSuffix(n) {
	n = Math.abs(n)
	
	return ["st","nd","rd"][((n+90)%100-10)%10-1]||"th"
}

function getNewMoonsJKA(year, stop = false, stop2 = false) {
	var epact = getEpact(year)
	var epactN = getEpact(year+1)
	var offset = 86400000 * (mod(31-epact[0], 30) + (mod(31-epact[0], 30) == 0 ? 30 : 0) - 1)
	var hollow = 86400000 * (((epact[0] != 0) && (epact[0] < (25 - epact[1])) ? -1 : 0) - epact[1])
	
	var moons = [setDate(year, 1, 1, offset),				// january
					setDate(year, 1, 31, offset + hollow), 	// february
					setDate(year, 3, 1, offset), 			// march
					setDate(year, 3, 31, offset + hollow),	// april
					setDate(year, 4, 29, offset), 			// may
					setDate(year, 5, 29, offset + hollow),	// june
					setDate(year, 6, 27, offset), 			// july
					setDate(year, 7, 27, offset + hollow),	// august
					setDate(year, 8, 25, offset), 			// september
					setDate(year, 9, 24, offset + hollow),	// october
					setDate(year, 10, 23, offset),			// november
					setDate(year, 11, 22, offset + hollow),	// december
					setDate(year, 12, 21, offset)			// undecember
				]
	
	if (moons.slice(-1)[0].getUTCMonth() == 0) {moons.pop()} // remove next year moons
	
	if (epact[0] == 19 && epactN[0] == 1) {moons.push(setDate(year, 12, 31))}
	if (epact[0] == 18 && epactN[0] == 1) {moons.push(setDate(year+1, 1, 1))}
	if (epact[0] == 20 && epactN[0] == 0) {moons.pop()}
	
	if (stop == false) {
		for (let i = 0; i < moons.length; i++) {
			if (setDate(year, 3, 21) > moons[i]) {
				delete moons[i];
			} else {
				break
			}
		}
		
		moons = moons.concat(getNewMoonsJKA(year+1, true));
		moons = moons.flat()
		
		if (stop2 == false) {
			for (let i = 0; i < moons.length - 1; i++) {
				if ((moons[i] - moons[i-1]) / 86400000 == 29 && (moons[i+1] - moons[i]) / 86400000 == 31) {
					moons[i] = setDate(moons[i].getUTCFullYear(), moons[i].getUTCMonth() + 1, moons[i].getUTCDate(), 86400000)
				}
			}
			
			//moons.pop() // last moon needed for 31-fixing is now unnecessary
			
			var moonDays = [];
			for (let i = 0; i < moons.length; i++) {
				moonDays.push((moons[i] - moons[0]) / 86400000)
			}
			
			moonDays.push(999)
			
			return moonDays
		} else {
			return moons
		}
		
	} else {
		/*
		for (let i = 0; i < moons.length; i++) {
			if (setDate(year, 3, 20) < moons[i]) {
				delete moons[i];
			}
		}
		*/
		
		return moons.flat()
	}
}

function calcDateJKA(date) {
	var year = date.getUTCFullYear()
	
	var today = Math.floor(date/86400000)
	
	var monthDays = getNewMoonsJKA(year)
	var dayYear = today - Math.floor(getNewMoonsJKA(year, false, true)[0] / 86400000)
	
	if (dayYear < 0) {
		year -= 1
		monthDays = getNewMoonsJKA(year)
		dayYear = today - Math.floor(getNewMoonsJKA(year, false, true)[0] / 86400000)
	}
	
	var month = 0
	
	if (dayYear >= 0) {
		while (true) {
			if (dayYear >= monthDays[month] && dayYear < monthDays[month+1]) break;
			month = month + 1;
		}
	}
	
	var weekDay = mod(today + 2, 6)
	
	var day = dayYear - monthDays[month] + 1
	
	var cycle = Math.floor((year - 928)/40) + 1
	var cycleYear = mod(year - 928, 40)
	
	var cycleAdj = mod(cycleYear, 5)
	var cycleAnimal = mod(cycleYear, 8)
	
	if (cycle < 1) {cycle -= 1}
	
	return [weekDay, day, month, cycle, cycleAdj, cycleAnimal]
}

// ISSICA

function calcDateISS(date) {
	var year = date.getFullYear()
	var firstDay = getFirstDayLRM(year)
	
	if (date < firstDay) {
		year = year - 1
		firstDay = getFirstDayLRM(year)
	}
	
	var doy = Math.floor((date - firstDay) / 86400000)
	
	var woy = Math.floor(doy / 7)
	var month = Math.min(Math.floor((woy + 1/3) / (13/3)), 11)
	var firstwom = month * 4 + (month % 3 == 2) + Math.floor(month / 3)
	var dom = doy - (firstwom * 7) + 1
	
	year = year + 1213
	
	var suffix = 0;
	if (year < 1) {year = (Math.abs(year)+1); suffix = 1}
	
	return [dom, month, year, suffix]
}

// QARVABA

function calcDateQAR(date) {
	var epoch = new Date(Date.UTC(436, 2, 20))
	var dayNumber = Math.floor((date - epoch) / 86400000) + 1
	
	var yearNum = 1
	
	if (dayNumber > 0) {
		var totalDays = 1;
		while (true) {
			if (totalDays + (365 + (mod(yearNum, 4) == 0 && mod(yearNum, 128) != 0)) > dayNumber) break;
			totalDays = totalDays + (365 + (mod(yearNum, 4) == 0 && mod(yearNum, 128) != 0));
			yearNum = yearNum + 1;
		}
	} else {
		var totalDays = 0;
		while (true) {
			yearNum = yearNum - 1;
			totalDays = totalDays - (365 + (mod(yearNum, 4) == 0 && mod(yearNum, 128) != 0));
			if (totalDays < dayNumber) break;
		}
		totalDays += 1
	}
	
	var doy = dayNumber - totalDays
	
	var day = mod(doy, 30) + 1
	var month = Math.floor(doy / 30)
	var suffix = 0
	
	var weekDay = (month != 12 ? mod(doy, 9) + 1 : 0)
	
	if (yearNum < 1) {
		yearNum = -1 * yearNum + 1
		suffix = 1
	}
	
	return [day, month, yearNum, suffix, weekDay]
}

// --- AZKALI ---

function isLeapAZK(year) {
	return isLeapALL(year)
}

function calcDateAZK(date) {
	var epoch;
	if ((date.getUTCFullYear() < 100) && (date.getUTCFullYear() > -1)) {
		epoch = new Date(String(date.getUTCFullYear()).padStart(4, '0') + '-01-01T00:00:00Z')
	} else {
		epoch = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
	};
	
	/*
	if (Math.floor((date - epoch) / 86400000) < 0) {
		if ((date.getUTCFullYear() - 1 < 100) && (date.getUTCFullYear() - 1 > -1)) {
		epoch = new Date(String(date.getUTCFullYear() - 1).padStart(4, '0') + '-07-29T00:00:00Z')
	} else {
		epoch = new Date(Date.UTC(date.getUTCFullYear() - 1, 6, 29))
		};
	}*/
	
	var dayNumber = Math.floor((date - epoch) / 86400000)
	
	var day = 0
	var month = 0
	var year = epoch.getUTCFullYear() + 8816
	
	var leap = isLeapAZK(epoch.getUTCFullYear() + 1)
	
	var monthDays = [0, 37, 73, 110, 146, 183, 219, 256, 292, 329, 365, 999];
	
	
	while (true) {
		if (dayNumber >= monthDays[month] && dayNumber < monthDays[month+1]) break;
		month = month + 1;
	}
	// console.log (epoch)
	// console.log (dayNumber)
	
	var day = dayNumber - monthDays[month] + 1
	var weekday = mod(day-1, 6)
	
	var weekdayNames = ["Uteran, ", "Aurigi, ", "Kuotz, ", "Atzan, ", "Lechi, ", "Pastiz, ", ""]
	var monthNames = ["Kuoke", "Angapizkea", "Hugnia", "Ngezeiazua", "Gau", "Lerearitsa", "Satseoko", "Karomiko", "Ishio", "Ethingiatz", "Sautazkegakantzigori"]
	
	if (dayNumber == 365) {
			weekday = 6;
			day = "";
		}
	
	if (year < 1) {year = (Math.abs(year)+1) + " BE"}
	
	return [weekdayNames[weekday], day, monthNames[month], year]
}

// --- ATHI ---

function numberATH(number) {
	var conv = parseInt(number).toString(24)
	
	var digits = {
		"0": "`",
		"1": "1",
		"2": "2",
		"3": "3",
		"4": "4",
		"5": "5",
		"6": "6",
		"7": "7",
		"8": "8",
		"9": "9",
		"a": "0",
		"b": "-",
		"c": "~",
		"d": "!",
		"e": "@",
		"f": "#",
		"g": "$",
		"h": "%",
		"i": "^",
		"j": "&",
		"k": "*",
		"l": "(",
		"m": ")",
		"n": "_"
		}
	
	var res = ""
	
	for (let i = 0; i < conv.length; i++) {
		res += digits[conv[i]]
	}
	
	return res
}

function isLeapATH(year) {
	if ((0 == mod(year, 4)) && (0 != mod(year, 100)) || (0 == mod(year, 400))) {
		return true
	} else {
		return false
	}
}

function calcDateATH(date) {
	var epoch;
	if ((date.getUTCFullYear() < 100) && (date.getUTCFullYear() > -1)) {
		epoch = new Date(String(date.getUTCFullYear()).padStart(4, '0') + '-12-25T00:00:00Z')
	} else {
		epoch = new Date(Date.UTC(date.getUTCFullYear(), 11, 25))
	};
	
	if (Math.floor((date - epoch) / 86400000) < 0) {
		if ((date.getUTCFullYear() - 1 < 100) && (date.getUTCFullYear() - 1 > -1)) {
		epoch = new Date(String(date.getUTCFullYear() - 1).padStart(4, '0') + '-12-25T00:00:00Z')
	} else {
		epoch = new Date(Date.UTC(date.getUTCFullYear() - 1, 11, 25))
		};
	}
	
	var dayNumber = Math.floor((date - epoch) / 86400000)
	
	var day = 0
	var month = 0
	var year = epoch.getUTCFullYear()+1
	
	var leap = isLeapATH(epoch.getUTCFullYear() + 1)
	
	var monthDays = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324, 360, 999];
	
	while (true) {
		if (dayNumber >= monthDays[month] && dayNumber < monthDays[month+1]) break;
		month = month + 1;
	}
	// console.log (epoch)
	// console.log (dayNumber)
	
	var day = dayNumber - monthDays[month] + 1
	
	var plant = (day > 6 ? mod(month + mod(year, 24) + Math.floor((day-7)/3), 10) : month)
	
	var plantNames = ["Relaino", "Wune", "Laliola", "Haoli", "Heloeni", "Winalino", "Sesuli", "Huinalu", "Uenali", "Aliseno"]
	
	var suffix = ""
	if (year < 1) {year = (Math.abs(year)+1); suffix = " MH"}
	
	return [day, (month == 10 ? "Ina si Siala Muale" : plantNames[month]), (month == 10 ? "" : ", " + plantNames[plant] + ","), year, suffix]
}

// --- XRWLPHYZ ---

function isLongUXA(year) {
	var epact = getEpact(year)
	var epactN = getEpact(year+1)
	
	return (!(0 < epact[0] && epact[0] < 20) + (epact[0] == 19 && epactN[0] == 1) + (epact[0] == 18 && epactN[0] == 1) - (epact[0] == 20 && epactN[0] == 0))
}

function getNewMoonsUXA(year, stop = false, stop2 = false) {
	var epact = getEpact(year)
	var epactN = getEpact(year+1)
	var offset = 86400000 * (mod(31-epact[0], 30) + (mod(31-epact[0], 30) == 0 ? 30 : 0) - 1)
	var hollow = 86400000 * (((epact[0] != 0) && (epact[0] < (25 - epact[1])) ? -1 : 0) - epact[1])
	
	var moons = [setDate(year, 1, 1, offset),				// january
					setDate(year, 1, 31, offset + hollow), 	// february
					setDate(year, 3, 1, offset), 			// march
					setDate(year, 3, 31, offset + hollow),	// april
					setDate(year, 4, 29, offset), 			// may
					setDate(year, 5, 29, offset + hollow),	// june
					setDate(year, 6, 27, offset), 			// july
					setDate(year, 7, 27, offset + hollow),	// august
					setDate(year, 8, 25, offset), 			// september
					setDate(year, 9, 24, offset + hollow),	// october
					setDate(year, 10, 23, offset),			// november
					setDate(year, 11, 22, offset + hollow),	// december
					setDate(year, 12, 21, offset)			// undecember
				]
	
	if (moons.slice(-1)[0].getUTCMonth() == 0) {moons.pop()} // remove next year moons
	
	if (epact[0] == 19 && epactN[0] == 1) {moons.push(setDate(year, 12, 31))}
	if (epact[0] == 18 && epactN[0] == 1) {moons.push(setDate(year+1, 1, 1))}
	if (epact[0] == 20 && epactN[0] == 0) {moons.pop()}
	
	if (stop == false) {
		moons = moons.flat()
		
		if (stop2 == false) {
			for (let i = 0; i < moons.length - 1; i++) {
				if ((moons[i] - moons[i-1]) / 86400000 == 29 && (moons[i+1] - moons[i]) / 86400000 == 31) {
					moons[i] = setDate(moons[i].getUTCFullYear(), moons[i].getUTCMonth() + 1, moons[i].getUTCDate(), 86400000)
				}
			}
			
			//moons.pop() // last moon needed for 31-fixing is now unnecessary
			
			var moonDays = [];
			for (let i = 0; i < moons.length; i++) {
				moonDays.push((moons[i] - moons[0]) / 86400000)
			}
			
			moonDays.push(999)
			
			return moonDays
		} else {
			return moons
		}
		
	} else {
		return moons.flat()
	}
}

function calcDateUXA(date) {
	var epoch;
	if ((date.getUTCFullYear() < 100) && (date.getUTCFullYear() > -1)) {
		epoch = new Date(String(date.getUTCFullYear()).padStart(4, '0') + '-12-22T00:00:00Z')
	} else {
		epoch = new Date(Date.UTC(date.getUTCFullYear(), 11, 22))
	};
	
	if (Math.floor((date - epoch) / 86400000) < 0) {
		if ((date.getUTCFullYear() - 1 < 100) && (date.getUTCFullYear() - 1 > -1)) {
		epoch = new Date(String(date.getUTCFullYear() - 1).padStart(4, '0') + '-12-22T00:00:00Z')
	} else {
		epoch = new Date(Date.UTC(date.getUTCFullYear() - 1, 11, 22))
		};
	}
	
	var today = Math.floor(date/86400000)
	
	var day = 0
	var month = 0
	var year = epoch.getUTCFullYear()+1214
	var lunarYear = date.getUTCFullYear()
	
	var monthDays = getNewMoonsUXA(lunarYear)
	var dayYear = today - Math.floor(getNewMoonsUXA(lunarYear, false, true)[0] / 86400000)

	if (dayYear < 0) {
		lunarYear -= 1
		monthDays = getNewMoonsUXA(lunarYear)
		dayYear = today - Math.floor(getNewMoonsUXA(lunarYear, false, true)[0] / 86400000)
	}
	
	if (dayYear >= 0) {
		while (true) {
			if (dayYear >= monthDays[month] && dayYear < monthDays[month+1]) break;
			month = month + 1;
		}
	}
	
	day = dayYear - monthDays[month] + 1
	
	var firstMonth = 10
	var firstMonthOffset = lunarYear - 2026
	
	if (firstMonthOffset < 0) {
		for (let i = 2026; i > 2026 + firstMonthOffset; i--) {
			firstMonth -= 12 + isLongUXA(i-1)
		}
	} else {
		for (let i = 2026; i < 2026 + firstMonthOffset; i++) {
			firstMonth += 12 + isLongUXA(i)
		}
	}
	
	var monthNames = ["Qalyn", "Baqlyn", "Ther", "Farnw", "Ñas", "Jwk", "Geni", "Khaj", "Pelit", "Melat", "Phaphat", "Qhaxe", "Saryn"]
	
	if (year < 1) {year = (Math.abs(year)+1) + " BE"}
	
	return [day, monthNames[mod(firstMonth+month, 13)], year]
}