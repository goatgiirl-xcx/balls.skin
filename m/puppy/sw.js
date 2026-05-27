function t3(n) {
    let d = [];
    while (n !== 0) {
        d.push(n % 9);
        n = Math.floor(n / 9);
    }
    return d.reverse().map((_) => "012346789"[_]).join("") || "0";
}

function mallianDecimalTime(showDecimals = true) {
	var date = new Date();
	var timeInMilliseconds = ((date.getUTCHours() * 60 + date.getUTCMinutes()) * 60 + date.getUTCSeconds()) * 1000 + date.getUTCMilliseconds() + 25661000;
	var time = (timeInMilliseconds % 86400000) * 729 / 86400000;
	var beats = Math.floor(time);
	var decimals = Math.floor((time - beats)*81);
	var times = "@" + t3(beats).padStart(3, "0");
	if (showDecimals) {
		times += "/" + t3(decimals).padStart(2, "0") ;
	}
	return times;
}

var mallianClock = document.getElementById("mallianClock");
window.setInterval(updateMallianClock, 86400000/59049);
function updateMallianClock() {
    mallianClock.innerHTML = mallianDecimalTime()
}