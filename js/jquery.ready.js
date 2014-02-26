

$(function() {

		var transEndEventNames = {
			'WebkitTransition' : 'webkitTransitionEnd',
			'MozTransition' : 'transitionend',
			'OTransition' : 'oTransitionEnd',
			'msTransition' : 'MSTransitionEnd',
			'transition' : 'transitionend'
		}, transEndEventName = transEndEventNames[Modernizr
				.prefixed('transition')], $wrapper = $('#custom-inner'), $calendar = $('#calendar'), cal = $calendar
				.calendario({
					onDayClick : function($el, $contentEl, dateProp) {
							// cerrar y pasar el dia
							if (dateProp.day>0) {
								if ($("#calendar").attr("rel")=="from") {
									$("#calendar").find('.fc-from').removeClass('fc-from');
									app_search_from = new Date(dateProp.year, dateProp.month-1, dateProp.day);
									$("#frm-search-from").val(Fecha_date_a_formato_HM(app_search_from));
									$($el).addClass('fc-from');
									if (app_search_from > app_search_to) {
										app_search_to = app_search_from;
										// resetear to al valor de from
										$("#calendar").find('.fc-to').removeClass('fc-to');
										$($el).addClass('fc-to');
										$("#frm-search-to").val(Fecha_date_a_formato_HM(app_search_to));
									}
								} else {
									$("#calendar").find('.fc-to').removeClass('fc-to');	
									app_search_to = new Date(dateProp.year, dateProp.month-1, dateProp.day);
									$("#frm-search-to").val(Fecha_date_a_formato_HM(app_search_to));
									$($el).addClass('fc-to ');
									if (app_search_to < app_search_from) {
										app_search_from = app_search_to;
										// resetear from al valor de to
										$("#calendar").find('.fc-from').removeClass('fc-from');
										$($el).addClass('fc-from');
										$("#frm-search-from").val(Fecha_date_a_formato_HM(app_search_from));
									}
								}	
								Lungo.Router.back();
							}
					},
					displayWeekAbbr : true
				}), $month = $('#custom-month').html(cal.getMonthName()), $year = $(
				'#custom-year').html(cal.getYear());
		
		//caldata : codropsEvents,
		
		$('#custom-next').on('click', function() {
			cal.gotoNextMonth(updateMonthYear);
		});
		$('#custom-prev').on('click', function() {
			cal.gotoPreviousMonth(updateMonthYear);
		});

		function updateMonthYear() {
			$month.html(cal.getMonthName());
			$year.html(cal.getYear());
		}
		
		// pasamos a variable global el calendario antes de perderlo
		cal_objeto = cal;
	   
	});