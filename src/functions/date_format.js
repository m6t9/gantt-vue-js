let data = {
    months_full: [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь"
    ],
    months_full_2: {
        "Январь": "Января",
        "Февраль": "Февраля",
        "Март": "Марта",
        "Апрель": "Апреля",
        "Май": "Мая",
        "Июнь": "Июня",
        "Июль": "Июля",
        "Август": "Августа",
        "Сентябрь": "Сентября",
        "Октябрь": "Октября",
        "Ноябрь": "Ноября",
        "Декабрь": "Декабря"
    },
    months_short: [
        "Янв",
        "Фев",
        "Мар",
        "Апр",
        "Май",
        "Июн",
        "Июл",
        "Авг",
        "Сен",
        "Окт",
        "Ноя",
        "Дек"
    ]
    , calendar_exceptions: {

    }
}

export const date_format_fn = {

    // Установка массива исключений календаря
    set_calendar_exceptions: function (list) {
        data.calendar_exceptions = {};
        for (let i in list) {
            data.calendar_exceptions[list[i]["date"]] = list[i];
        }
    },

    // Проверка на пустую дату
    empty: function (value) {
        if (typeof value == 'undefined') return true;
        if (value == '0000-00-00') return true;
        if (value == '0000-00-00 00:00') return true;
        if (value == '0000-00-00 00:00:00') return true;
        if (value == '00-00-0000') return true;
        if (value == '00-00-0000 00:00:00') return true;
        if (value == false) return true;
        if (value == null) return true;
        if (value == "") return true;
        return false;
    },


    /*
    value
        "2000-10-30"
    strFormat:
        "DD-MM-YYYY"
        "dddd"
        "HH:mm:ss"
    */
    getDateTimeToString: function (value, strFormat) {
        if (value != '' && typeof value !== 'undefined' && value != '-0001-11-30' && value != '0000-00-00' && value != '0000-00-00 00:00:00' && value != null) {
            var resultDateTime = strFormat;

            var d;
            if (this.isDate(value)) {
                d = value;
            } else {
                d = new Date(value);
            }

            var daysLong = ["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"];
            var daysShort = ["Вс.","Пн.","Вт.","Ср.","Чт.","Пт.","Сб."];
            var yearRegExp = d.getFullYear();
            var monthRegExp = (String(d.getMonth() + 1).length == 1) ? ("0" + (d.getMonth() + 1)) : (d.getMonth() + 1);
            var dayRegExp = (d.getDate().toString().length == 1) ? ("0" + d.getDate()) : d.getDate();
            var dayNameRegExp = d.getDay();
            var hoursRegExp = (d.getHours().toString().length == 1) ? ("0" + d.getHours()) : d.getHours();
            var minuteRegExp = (d.getMinutes().toString().length == 1) ? ("0" + d.getMinutes()) : d.getMinutes();
            var secondsRegExp = (d.getSeconds().toString().length == 1) ? ("0" + d.getSeconds()) : d.getSeconds();
            var milisecondsRegExp = (d.getMilliseconds().toString().length == 1) ? ("00" + d.getMilliseconds()) : ((d.getMilliseconds().toString().length == 2) ? ("0" + d.getMilliseconds()) : d.getMilliseconds());

            resultDateTime = resultDateTime.replace(new RegExp('YYYY', 'g'), yearRegExp);
            resultDateTime = resultDateTime.replace(new RegExp('yy', 'g'), String(yearRegExp).slice(-2));
            resultDateTime = resultDateTime.replace(new RegExp('MM', 'g'), monthRegExp);
            resultDateTime = resultDateTime.replace(new RegExp('dddd', 'g'), daysLong[dayNameRegExp]);
            resultDateTime = resultDateTime.replace(new RegExp('ddd', 'g'), daysShort[dayNameRegExp]);
            resultDateTime = resultDateTime.replace(new RegExp('DD', 'g'), dayRegExp);
            resultDateTime = resultDateTime.replace(new RegExp('HH', 'g'), hoursRegExp);
            resultDateTime = resultDateTime.replace(new RegExp('mm', 'g'), minuteRegExp);
            resultDateTime = resultDateTime.replace(new RegExp('ss', 'g'), secondsRegExp);
            resultDateTime = resultDateTime.replace(new RegExp('zz', 'g'), milisecondsRegExp);

            return resultDateTime + "";
        }
    },

    /*
    http: //www.mattkruse.com/javascript/date/source.html
    "dd-MM-yyyy"
    */
    getDateFromFormat: function (val, format) {
        val = val + "";
        format = format + "";
        var i_val = 0;
        var i_format = 0;
        var c = "";
        var token = "";
        var token2 = "";
        var x, y;
        var now = new Date();
        var year = now.getYear();
        var month = now.getMonth() + 1;
        var date = 1;
        var hh = now.getHours();
        var mm = now.getMinutes();
        var ss = now.getSeconds();
        var ampm = "";

        while (i_format < format.length) {
            // Get next token from format string
            c = format.charAt(i_format);
            token = "";
            while ((format.charAt(i_format) == c) && (i_format < format.length)) {
                token += format.charAt(i_format++);
            }
            // Extract contents of value based on format token
            if (token == "yyyy" || token == "yy" || token == "y" || token == "YYYY" || token == "YY" || token == "Y") {
                if (token == "yyyy" || token == "YYYY") {
                    x = 4;
                    y = 4;
                }
                if (token == "yy" || token == "YY") {
                    x = 2;
                    y = 2;
                }
                if (token == "y" || token == "Y") {
                    x = 2;
                    y = 4;
                }
                year = this._getInt(val, i_val, x, y);
                if (year == null) {
                    return 0;
                }
                i_val += year.length;
                if (year.length == 2) {
                    if (year > 70) {
                        year = 1900 + (year - 0);
                    } else {
                        year = 2000 + (year - 0);
                    }
                }
            } else if (token == "MMM" || token == "NNN") {
                month = 0;
                for (var i = 0; i < MONTH_NAMES.length; i++) {
                    var month_name = MONTH_NAMES[i];
                    if (val.substring(i_val, i_val + month_name.length).toLowerCase() == month_name.toLowerCase()) {
                        if (token == "MMM" || (token == "NNN" && i > 11)) {
                            month = i + 1;
                            if (month > 12) {
                                month -= 12;
                            }
                            i_val += month_name.length;
                            break;
                        }
                    }
                }
                if ((month < 1) || (month > 12)) {
                    return 0;
                }
            } else if (token == "EE" || token == "E") {
                for (var i = 0; i < DAY_NAMES.length; i++) {
                    var day_name = DAY_NAMES[i];
                    if (val.substring(i_val, i_val + day_name.length).toLowerCase() == day_name.toLowerCase()) {
                        i_val += day_name.length;
                        break;
                    }
                }
            } else if (token == "MM" || token == "M") {
                month = this._getInt(val, i_val, token.length, 2);
                if (month == null || (month < 1) || (month > 12)) {
                    return 0;
                }
                i_val += month.length;
            } else if (token == "dd" || token == "d" || token == "DD" || token == "D") {
                date = this._getInt(val, i_val, token.length, 2);
                if (date == null || (date < 1) || (date > 31)) {
                    return 0;
                }
                i_val += date.length;
            } else if (token == "hh" || token == "h") {
                hh = this._getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 1) || (hh > 12)) {
                    return 0;
                }
                i_val += hh.length;
            } else if (token == "HH" || token == "H") {
                hh = this._getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 0) || (hh > 23)) {
                    return 0;
                }
                i_val += hh.length;
            } else if (token == "KK" || token == "K") {
                hh = this._getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 0) || (hh > 11)) {
                    return 0;
                }
                i_val += hh.length;
            } else if (token == "kk" || token == "k") {
                hh = this._getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 1) || (hh > 24)) {
                    return 0;
                }
                i_val += hh.length;
                hh--;
            } else if (token == "mm" || token == "m") {
                mm = this._getInt(val, i_val, token.length, 2);
                if (mm == null || (mm < 0) || (mm > 59)) {
                    return 0;
                }
                i_val += mm.length;
            } else if (token == "ss" || token == "s") {
                ss = this._getInt(val, i_val, token.length, 2);
                if (ss == null || (ss < 0) || (ss > 59)) {
                    return 0;
                }
                i_val += ss.length;
            } else if (token == "a") {
                if (val.substring(i_val, i_val + 2).toLowerCase() == "am") {
                    ampm = "AM";
                } else if (val.substring(i_val, i_val + 2).toLowerCase() == "pm") {
                    ampm = "PM";
                } else {
                    return 0;
                }
                i_val += 2;
            } else {
                if (val.substring(i_val, i_val + token.length) != token) {
                    return 0;
                } else {
                    i_val += token.length;
                }
            }
        }
        // If there are any trailing characters left in the value, it doesn't match
        if (i_val != val.length) {
            return 0;
        }
        // Is date valid for month?
        if (month == 2) {
            // Check for leap year
            if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) { // leap year
                if (date > 29) {
                    return 0;
                }
            } else {
                if (date > 28) {
                    return 0;
                }
            }
        }
        if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
            if (date > 30) {
                return 0;
            }
        }
        // Correct hours value
        if (hh < 12 && ampm == "PM") {
            hh = hh - 0 + 12;
        } else if (hh > 11 && ampm == "AM") {
            hh -= 12;
        }
        var newdate = new Date(year, month - 1, date, hh, mm, ss);
        //return newdate.getTime();
        return newdate;
    },

    _isInteger: function (val) {
        var digits = "1234567890";
        for (var i = 0; i < val.length; i++) {
            if (digits.indexOf(val.charAt(i)) == -1) {
                return false;
            }
        }
        return true;
    },

    _getInt: function (str, i, minlength, maxlength) {
        for (var x = maxlength; x >= minlength; x--) {
            var token = str.substring(i, i + x);
            if (token.length < minlength) {
                return null;
            }
            if (this._isInteger(token)) {
                return token;
            }
        }
        return null;
    },

    // Добавить дней
    addDays: function (date, days) {
        days = parseInt(days);
        if (days == 0) return date;
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },

    // Проверка на дату
    isDate: function(value) {
        return value instanceof Date;
    },

    // Месяц русский
    get_month_ru: function (month, opt) {
        var out = "";

        if (isNaN(month) || this.isDate(month)) {
            if (!this.isDate(month)) {
                month = new Date(month);
            }
            month = month.getMonth();
        } else {
            month = month - 1;
        }


        if (opt == "full" && typeof data.months_full[month] != "undefined") {
            out = data.months_full[month];
        }

        if (opt == "short" && typeof data.months_short[month] != "undefined") {
            out = data.months_short[month];
        }

        return out;
    },

    // Январь -> Января
    months_full_t: function (val) {
        return data.months_full_2[val];
    },

    // Дней в месяце
    days_in_month: function (date) {
        return 32 - new Date(date.getFullYear(), date.getMonth(), 32).getDate();
    },

    // Проверка на выходной
    is_weekend: function (date) {
        if (!this.isDate(date)) {
            date = new Date(date);
        }

        var rez = date.getDay() % 6 == 0;

        let ind = this.getDateTimeToString(date, "YYYY-MM-DD");
        if (typeof data.calendar_exceptions[ind] != "undefined"){
            let exc = data.calendar_exceptions[ind];
            /*console.log("exc");
            console.log(exc);*/
            rez = parseInt(exc["weekend_flag"]);
        }

        return rez;
    },

    // Добавить days рабочих дней к дате
    add_working_days: function (date, days) {
        days = parseInt(days);
        if (days > 1000){
            console.log("Ошибка add_working_days. Оперирование слишком большим сроком: " + days + " рабочих дней.");
            rez = this.addDays(rez, days);
            days = 0;
        }
        if (!this.isDate(date)) {
            date = new Date(date);
        }
        var rez = date;
        while (this.is_weekend(rez)) rez = this.addDays(rez, 1);
        while (days > 0) {
            rez = this.addDays(rez, 1);
            days--;
            while (this.is_weekend(rez)){
                rez = this.addDays(rez, 1);
            }
        }
        return rez;
    },

    // Разница в днях между датами
    diff_days: function (date1, date2) {
        if (!this.isDate(date1)) {
            date1 = new Date(date1);
        }
        if (!this.isDate(date2)) {
            date2 = new Date(date2);
        }
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return parseInt(diffDays);
    }

}
