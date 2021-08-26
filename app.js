const dateInput = document.querySelector('#date-input');
const checkBtn = document.querySelector('#check-button');
const outputContainer = document.querySelector('#output-container');
const loadingImage = document.querySelector('#loading-image');

function reverseString(str) {
	return str.split('').reverse().join('');
}

function isPalindrome(str) {
	return str === reverseString(str);
}

function dateToString(date) {
	day = date.day;
	month = date.month;
	year = date.year;
	if (day < 10) {
		day = '0' + day;
	} else {
		day = day.toString();
	}
	if (month < 10) {
		month = '0' + month;
	} else {
		month = month.toString();
	}
	year = year.toString();

	return {
		day: day,
		month: month,
		year: year,
	};
}

function dateVariations(date) {
	const dateObject = dateToString(date);
	const day = dateObject.day;
	const month = dateObject.month;
	const year = dateObject.year;

	const ddmmyyyy = day + month + year;
	const mmddyyyy = month + day + year;
	const yyyymmdd = year + month + day;
	const ddmmyy = day + month + year.slice(-2);
	const mmddyy = month + day + year.slice(-2);
	const yymmdd = year.slice(-2) + month + day;

	return [ddmmyyyy, mmddyyyy, yyyymmdd, ddmmyy, mmddyy, yymmdd];
}

function checkPalindromeForAllFormats(date) {
	const listOfDateFormat = dateVariations(date);
	let flag = false;
	for (let i = 0; i < listOfDateFormat.length; i++) {
		if (isPalindrome(listOfDateFormat[i])) {
			flag = true;
			break;
		}
	}
	return flag;
}

function isLeapYear(year) {
	if (year % 4 === 0) {
		return true;
	}
	if (year % 400 === 0) {
		return true;
	}
	if (year % 100 === 0) {
		return false;
	}
	return false;
}

function getNextDate(date) {
	let day = date.day + 1;
	let month = date.month;
	let year = date.year;

	const numberOfDaysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	if (month === 2) {
		if (isLeapYear(year)) {
			if (day > 29) {
				day = 1;
				month++;
			}
		} else {
			if (day > 28) {
				day = 1;
				month++;
			}
		}
	} else {
		if (day > numberOfDaysPerMonth[month - 1]) {
			day = 1;
			month++;
		}
	}

	if (month > 12) {
		month = 1;
		year++;
	}

	return {
		day: day,
		month: month,
		year: year,
	};
}

function getPreviousDate(date) {
	let day = date.day - 1;
	let month = date.month;
	let year = date.year;

	const numberOfDaysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	if (month === 3) {
		if (isLeapYear(year)) {
			if (day < 31) {
				day = 29;
				month--;
			}
		} else {
			if (day < 31) {
				day = 28;
				month--;
			}
		}
	} else {
		if (day < 1) {
			day = numberOfDaysPerMonth[month - 1];
			month--;
		}
	}

	if (month < 1) {
		month = 12;
		year--;
	}

	return {
		day: day,
		month: month,
		year: year,
	};
}

function nextPalindromeDate(date) {
	let nextPalindrome = 0;
	let nextDate = getNextDate(date);

	while (1) {
		nextPalindrome++;
		let checkPalindrome = checkPalindromeForAllFormats(nextDate);

		if (checkPalindrome) {
			break;
		}
		nextDate = getNextDate(nextDate);
	}
	return [nextPalindrome, nextDate];
}

function previousPalindromeDate(date) {
	let previousPalindrome = 0;
	let previousDate = getPreviousDate(date);

	while (1) {
		previousPalindrome++;
		let checkPalindrome = checkPalindromeForAllFormats(previousDate);

		if (checkPalindrome) {
			break;
		}
		previousDate = getPreviousDate(previousDate);
	}
	return [previousPalindrome, previousDate];
}

function checkBtnHandler() {
	const userDateInput = dateInput.value;
	if (userDateInput !== '') {
		const dateFormat = userDateInput.split('-');
		loadingImage.style.display = 'block';
		outputContainer.style.display = 'none';

		const date = {
			day: Number(dateFormat[2]),
			month: Number(dateFormat[1]),
			year: Number(dateFormat[0]),
		};

		setTimeout(() => {
			loadingImage.style.display = 'none';
			outputContainer.style.display = 'block';
			if (checkPalindromeForAllFormats(date)) {
				outputContainer.innerText = 'Congrats! Your birthday is a palindrome 🥳';
			} else {
				const [nextPalindrome, { nextday = day, nextmonth = month, nextyear = year }] =
					nextPalindromeDate(date);
				const [previousPalindrome, { prevday = day, prevmonth = month, prevyear = year }] =
					previousPalindromeDate(date);

				const nextDay = nextPalindrome > 1 ? 'days' : 'day';
				const prevDay = previousPalindrome > 1 ? 'days' : 'day';

				if (nextPalindrome > previousPalindrome) {
					outputContainer.innerText = `Sorry your birthday is not a palindrome 😔. You missed the nearest palindrome by ${previousPalindrome} ${prevDay} which was on ${prevday}-${prevmonth}-${prevyear}`;
				} else {
					outputContainer.innerText = `Sorry your birthday is not a palindrome 😔. You missed the nearest palindrome by ${nextPalindrome} ${nextDay} which is on ${nextday}-${nextmonth}-${nextyear}`;
				}
			}
		}, 2000);
	}
	return (outputContainer.innerText = 'Select valid date to proceed');
}

checkBtn.addEventListener('click', checkBtnHandler);
