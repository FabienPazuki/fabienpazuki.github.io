(function ($) {

    var eCalendar = function (options, object) {
        // Initializing global variables
        var adDay = new Date().getDate();
        var adMonth = new Date().getMonth();
        var adYear = new Date().getFullYear();
        var dDay = adDay;
        var dMonth = adMonth;
        var dYear = adYear;
        var instance = object;

        var settings = $.extend({}, $.fn.eCalendar.defaults, options);

        function lpad(value, length, pad) {
            if (typeof pad == 'undefined') {
                pad = '0';
            }
            var p;
            for (var i = 0; i < length; i++) {
                p += pad;
            }
            return (p + value).slice(-length);
        }

        var mouseOver = function () {
            $(this).addClass('c-nav-btn-over');
        };
        var mouseLeave = function () {
            $(this).removeClass('c-nav-btn-over');
        };
        var mouseOverEvent = function () {
            $(this).addClass('c-event-over');
            var d = $(this).attr('data-event-day');
            $('div.c-event-item[data-event-day="' + d + '"]').addClass('c-event-over');
        };
        var mouseLeaveEvent = function () {
            $(this).removeClass('c-event-over')
            var d = $(this).attr('data-event-day');
            $('div.c-event-item[data-event-day="' + d + '"]').removeClass('c-event-over');
        };
        var mouseOverItem = function () {
            $(this).addClass('c-event-over');
            var d = $(this).attr('data-event-day');
            $('div.c-event[data-event-day="' + d + '"]').addClass('c-event-over');
        };
        var mouseLeaveItem = function () {
            $(this).removeClass('c-event-over')
            var d = $(this).attr('data-event-day');
            $('div.c-event[data-event-day="' + d + '"]').removeClass('c-event-over');
        };
        var nextMonth = function () {
            if (dMonth < 11) {
                dMonth++;
            } else {
                dMonth = 0;
                dYear++;
            }
            print();
        };
        var previousMonth = function () {
            if (dMonth > 0) {
                dMonth--;
            } else {
                dMonth = 11;
                dYear--;
            }
            print();
        };

        function loadEvents() {
            if (typeof settings.url != 'undefined' && settings.url != '') {
                $.ajax({url: settings.url,
                    async: false,
                    success: function (result) {
                        settings.events = result;
                    }
                });
            }
        }

        function print() {
            loadEvents();
            var dWeekDayOfMonthStart = new Date(dYear, dMonth, 1).getDay();
            var dLastDayOfMonth = new Date(dYear, dMonth + 1, 0).getDate();
            var dLastDayOfPreviousMonth = new Date(dYear, dMonth + 1, 0).getDate() - dWeekDayOfMonthStart + 1;

            var cBody = $('<div/>').addClass('c-grid');
            var cEvents = $('<div/>').addClass('c-event-grid');
            var cEventsBody = $('<div/>').addClass('c-event-body');
            cEvents.append($('<div/>').addClass('c-event-title c-pad-top').html(settings.eventTitle));
            cEvents.append(cEventsBody);
            var cNext = $('<div/>').addClass('c-next c-grid-title c-pad-top');
            var cMonth = $('<div/>').addClass('c-month c-grid-title c-pad-top');
            var cPrevious = $('<div/>').addClass('c-previous c-grid-title c-pad-top');
            cPrevious.html(settings.textArrows.previous);
            cMonth.html(settings.months[dMonth] + ' ' + dYear);
            cNext.html(settings.textArrows.next);

            cPrevious.on('mouseover', mouseOver).on('mouseleave', mouseLeave).on('click', previousMonth);
            cNext.on('mouseover', mouseOver).on('mouseleave', mouseLeave).on('click', nextMonth);

            cBody.append(cPrevious);
            cBody.append(cMonth);
            cBody.append(cNext);
            for (var i = 0; i < settings.weekDays.length; i++) {
                var cWeekDay = $('<div/>').addClass('c-week-day c-pad-top');
                cWeekDay.html(settings.weekDays[i]);
                cBody.append(cWeekDay);
            }
            var day = 1;
            var dayOfNextMonth = 1;
            for (var i = 0; i < 42; i++) {
                var cDay = $('<div/>');
                if (i < dWeekDayOfMonthStart) {
                    cDay.addClass('c-day-previous-month c-pad-top');
                    cDay.html(dLastDayOfPreviousMonth++);
                } else if (day <= dLastDayOfMonth) {
                    cDay.addClass('c-day c-pad-top');
                    if (day == dDay && adMonth == dMonth && adYear == dYear) {
                        cDay.addClass('c-today');
                    }
                    for (var j = 0; j < settings.events.length; j++) {
                        var d = settings.events[j].datetime;
                        if (d.getDate() == day && d.getMonth() == dMonth && d.getFullYear() == dYear) {
                            cDay.addClass('c-event').attr('data-event-day', d.getDate());
                            cDay.on('mouseover', mouseOverEvent).on('mouseleave', mouseLeaveEvent);
                        }
                    }
                    cDay.html(day++);
                } else {
                    cDay.addClass('c-day-next-month c-pad-top');
                    cDay.html(dayOfNextMonth++);
                }
                cBody.append(cDay);
            }
            var eventList = $('<div/>').addClass('c-event-list');
            for (var i = 0; i < settings.events.length; i++) {
                var d = settings.events[i].datetime;
                if (d.getMonth() == dMonth && d.getFullYear() == dYear) {
                    var date = lpad(d.getDate(), 2) + '/' + lpad(d.getMonth()+1, 2) + ' ' + lpad(d.getHours(), 2) + ':' + lpad(d.getMinutes(), 2);
                    var item = $('<div/>').addClass('c-event-item');
                    var title = $('<div/>').addClass('title').html(date + '  ' + settings.events[i].title + '<br/>');
                    var description = $('<div/>').addClass('description').html(settings.events[i].description + '<br/>');
                    item.attr('data-event-day', d.getDate());
                    item.on('mouseover', mouseOverItem).on('mouseleave', mouseLeaveItem);
                    item.append(title).append(description);
                    eventList.append(item);
                }
            }
            $(instance).addClass('calendar');
            cEventsBody.append(eventList);
            $(instance).html(cBody).append(cEvents);
        }

        return print();
    }

    $.fn.eCalendar = function (oInit) {
        return this.each(function () {
            return eCalendar(oInit, $(this));
        });
    };

    // plugin defaults
    $.fn.eCalendar.defaults = {
        weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        textArrows: {previous: '<', next: '>'},
        eventTitle: 'Events',
        url: '',
        events: [
            {title: 'Conference in Aarhus', description: 'Diophantine Approximation and Related Topics.', datetime: new Date(2015, 7, 12,12)},
            {title: 'Seminar in Göteborg',
            description: '<a href="http://www.math.chalmers.se/~tamos/marco.html">Marco Maculan: GIT and Diophantine Approximation</a> (6 sem)',
            datetime: new Date(2015, 7, 24, 13)},
            {title: 'Seminar in Copenhagen KU',
            description: '31/08 - <a href="http://www.math.ku.dk/english/calendar/events/ntseminar_tsaltas/">Konstantinos Tsaltas: Bianchi modular forms</a>',
            datetime: new Date(2015, 7, 30, 16)},
            {title: 'Seminar in Copenhagen KU',
            description: '<a href="http://www.math.ku.dk/english/calendar/events/yuri-bilu/">Yuri Bilu: Special Points on Straight Lines and Hyperbolas</a>',
            datetime: new Date(2015, 8, 4, 14)},
            {title: 'Seminar in Copenhagen KU',
            description: '<a href="http://www.math.ku.dk/english/calendar/events/kentaro-mitsui/">Kentaro Mitsui: Closed points on torsors</a>',
            datetime: new Date(2015, 8, 18, 14)},
            {title: 'Ostrowski Prize 2015 in Copenhagen KU',
            description: '<a href="http://www.math.ku.dk/english/calendar/events/ostrowski-prize-2015/">Gerd Faltings and Peter Scholze</a>',
            datetime: new Date(2015, 9, 30, 14)},
            {title: 'Seminar in Copenhagen KU',
            description: '<a href="http://www.math.ku.dk/english/calendar/events/amilcar-pacheco/">Amilcar Pacheco: An analogue of Brauer-Siegel for ab varieties</a>',
            datetime: new Date(2015, 8, 22, 10)},
            {title: 'Seminar in Copenhagen KU',
            description: '<a href="http://www.math.ku.dk/english/calendar/events/andre-chatzistamatiou/">Andre Chatzistamatiou: Integrality of p-adic integrals</a>',
            datetime: new Date(2015, 8, 25, 14)},
            {title: 'Seminar in Copenhagen KU',
            description: '<a href="http://www.math.ku.dk/english/research/tfa/alg/ntseminar/">Niko Laaksonen: Lattice Point Counting in Hyperbolic Space.</a>',
            datetime: new Date(2015, 10, 6, 14)},
            {title: 'Seminar in Copenhagen KU',
            description: '<a href="http://www.math.ku.dk/english/research/tfa/alg/ntseminar/">Aftab Pande: A construction of p-adic Hilbert Modular forms.</a>',
            datetime: new Date(2015, 10, 9, 16)},
            {title: 'Seminar in Chalmers (G&ouml;teborg)',
            description: '<a href="http://www.math.chalmers.se/~tamos/seminars.html">Per Salberger: Counting rational points on cubic curves.</a>',
            datetime: new Date(2015, 10, 12, 10)},
            {title: 'Seminar in Copenhagen KU',
            description: '<a href="http://www.math.ku.dk/english/research/tfa/alg/ntseminar/">Ian Petrow: A twisted Motohashi formula.</a>',
            datetime: new Date(2015, 10, 27, 14)},
            {title: 'Seminar in Copenhagen KU',
            description: '<a href="http://www.math.ku.dk/english/research/tfa/alg/ntseminar/">Samuele Anni: On the inverse Galois problem.</a>',
            datetime: new Date(2015, 11, 1, 16)},
            {title: 'Seminar in Copenhagen KU',
            description: '<a href="http://www.math.ku.dk/english/research/tfa/alg/ntseminar/">Valentijn Karemaker: Local and adelic Hecke algebra isomorphisms.</a>',
            datetime: new Date(2015, 11, 11, 13)},
            {title: 'Seminar in Copenhagen KU',
            description: '<a href="http://www.math.ku.dk/english/research/tfa/alg/ntseminar/">Pierre Le Boudec: Height of rational points on elliptic curves.</a>',
            datetime: new Date(2015, 11, 16, 14)},
            {title: 'N-cube days III',
            description: '<a href="daysiii.html">Day 1 at Chalmers, G&ouml;teborg</a>',
            datetime: new Date(2015, 11, 4, 13)},
            {title: 'N-cube days III',
            description: '<a href="daysiii.html">Day 2 at Chalmers, G&ouml;teborg</a>',
            datetime: new Date(2015, 11, 5, 9)},
            {title: 'Seminar in Copenhagen KU',
            description: '<a href="http://www.math.ku.dk/english/research/tfa/alg/ntseminar/">Robert Kucharczyk: On congruence subgroups of Fuchsian groups.</a>',
            datetime: new Date(2016, 0, 18, 10)},
            {title: 'Seminar in Copenhagen KU',
            description: '<a href="http://www.math.ku.dk/english/research/tfa/alg/ntseminar/">Davide Veniani: Lines on K3 quartic surfaces.</a>',
            datetime: new Date(2016, 0, 19, 15)},
            {title: 'Seminar in Copenhagen KU',
            description: '<a href="http://www.math.ku.dk/english/research/tfa/alg/ntseminar/">Daniel Bergh: Applications of destackification.</a>',
            datetime: new Date(2016, 0, 20, 13)},
            //Months variable is in [0,11]
			//Date(year,month,day,hour)
        ]
    };

}(jQuery));
