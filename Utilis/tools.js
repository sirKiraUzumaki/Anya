exports.humanTime = function (millis) {
	if (typeof millis === 'string') millis = parseInt(millis);
	if (!(typeof millis === 'number')) return;
	let time = {};
	time.year = Math.floor(millis / (365*24*60*60*1000));
	millis %= (365*24*60*60*1000);
	time.week = Math.floor(millis / (7*24*60*60*1000));
	millis %= (7*24*60*60*1000);
	time.day = Math.floor(millis / (24*60*60*1000));
	millis %= (24*60*60*1000);
	time.hour = Math.floor(millis / (60*60*1000));
	millis %= (60*60*1000);
	time.minute = Math.floor(millis / (60*1000));
	millis %= (60*1000);
	time.second = Math.floor(millis / (1000));
	millis %= (1000);
	time.millisecond = millis;
	let output = [];
	let foundFirst = false;
	let foundSecond = false;
	Object.keys(time).forEach(val => {
		if (foundFirst && !foundSecond) {
			if (time[val] === 0);
			else output.push(time[val] + ' ' + val + ((time[val] === 1)?'':'s'));
			foundSecond = true;
		}
		else {
			if (time[val] && !foundSecond) {
				foundFirst = true;
				output.push(time[val] + ' ' + val + ((time[val] === 1)?'':'s'));
			}
		}
	});
	return output.join(' and ');
}