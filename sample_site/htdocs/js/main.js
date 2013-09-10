// ================
// = MAIN JS FILE =
// ================

/*

TO DO:
√ complete event delete function
- complete edit events
- augment random date access controls
- check email for anything else
*/

$(document).ready(main);


function main (event) {
	// main onready
	console.log('-- main says go');


	// init calendar
	$('#calendar').fullCalendar({
		dayClick: onDayClick,
		eventClick: onEventClick
		});

	var events_array;
	getEvents();

	// assign event handlers
	$('#add-event-form a.save').on('click', saveEvent);

	$('a.cancel').on('click', function(event) {
		$(this).parents('section').hide();
		return false;
	});

	$('.close').on('click', function(event){hideAllUIBoxes();});


	function onDayClick (date, allDay, jsEvent, view) {
		console.log(date);
		hideAllUIBoxes();
		$('.fc-day').removeClass('fc-state-highlight');
		$(this).addClass('fc-state-highlight');

		// position & show add event box
		var xoffset = ( $('#calendar').width() / 2 ) - ($('.event-entry-box').width() / 2 );
		console.log(xoffset);
		$('.event-entry-box').css({left: xoffset+'px'});
		$('.event-entry-box').slideDown(100).find('input').eq(0).focus();

		// clear out old any data hanging around
		$('.event-entry-box input').val('');
		$('.event-entry-title-date').text($.fullCalendar.formatDate(date, 'MMMM d, yyyy'));
		$('input[name=start], input[name=end]').val($.fullCalendar.formatDate(date, 'MMMM d, yyyy'));
	}

	function onEventClick (event, jsEvent, view) {
		console.dir(event);
		if (jsEvent.target.className === "fc-event-inner" || jsEvent.target.className === "fc-event-title") 
		{
			hideAllUIBoxes();
			var displayX = $(jsEvent.target).parent().offset().left;
			var displayY = $(jsEvent.target).parent().offset().top;
			console.log(displayX, displayY);

			// show the event info (edit?) popup
			$('.event-details-box .event-title').text(event.title);
			$('.event-details-box .event-start').text($.fullCalendar.formatDate(event.start, "h:mm tt"));

			if (event.end) {
				$('.event-details-box .event-end').text("to "+$.fullCalendar.formatDate(event.end, "h:mm tt"));
			} else {
				$('.event-details-box .event-end').text("");
			}

			$('.event-details-box .event-description').html(event.description);
			$('.event-details-box:visible').hide();
			$('.event-details-box').show().css({
				'top':(displayY - ($('.event-details-box').height() + 22))+'px', 
				'left':(displayX - 18)+'px'
				});

			// assign click handler parameters for the action buttons
			$('.event-details-box a.delete').off('click').on('click', function(e) {
				if (confirm("Really delete this event???")) {
					deleteEvent(event.id);
				};
			});
			$('.event-details-box a.edit').off('click').on('click', function(e) {
				editEvent(event);
			});
		};
		return false;
	}

	// ajax data functions
	function saveEvent(event) {
		console.log('-- save event');
		var formvals = {};
		$('#add-event-form').find('input').each(function(){
			formvals[this.name] = this.value;
			console.log(formvals[this.name]);
		});

		console.dir(formvals);

		hideAllUIBoxes();
		$.ajax(
			{
				url: "/event/ajaxadd",
				type: 'post',
				data: formvals,
				dataType: 'text',
				success: function(data) { 
					if (data == true) {
						getEvents();
						alert("Event saved!!!");
					} else {
						alert('Error saving event. Boo.');
					}
				}
			});
		return false;
	}

	function deleteEvent (event_id) {
		// delete an event from the DB

		console.log("-- delete id:"+event_id);
		hideAllUIBoxes();

		$.ajax(
			{
				url: "/event/ajaxdelete",
				type: 'post',
				data: {id: event_id},
				dataType: 'text',
				success: function(data) { 
					if (data == true) {
						getEvents();
						alert("Event "+event_id+" deleted.");
					} else {
						alert('Error deleting event. Boo.');
					}
				}
			});
		return false;
	}

	function editEvent (event_obj) {
		// edit event
		console.log('-- edit id:'+event_obj.id);
		hideAllUIBoxes();
		// position event entry box
		var xoffset = ( $('#calendar').width() / 2 ) - ($('.event-entry-box').width() / 2 );
		console.log(xoffset);
		$('.event-entry-box').css({left: xoffset+'px'});

		$('.event-entry-box').slideDown(100).find('input').eq(0).focus();


		// fill in the event add form and display
		$('.event-entry-box input[name=title]').val(event_obj.title);
		$('.event-entry-box input[name=start]').val(formatEventTime(event_obj.start));
		$('.event-entry-box input[name=end]').val(formatEventTime(event_obj.end));
		$('.event-entry-box input[name=description]').val(event_obj.description);
		$('.event-entry-box input[name=id]').val(event_obj.id);
		$('.event-entry-box').slideDown(100);
		return false;
	}


	function getEvents () {
		$('.loading').fadeIn();
		// return all events via ajax and update calendar data source. rerenders, too
		$.getJSON("/event/ajaxgetall", function(data) {
			if (data) {
				console.log("--- got event data");
				console.log(data);
				events_array = data;
				$('#calendar').fullCalendar('removeEvents');
				$('#calendar').fullCalendar('addEventSource', events_array);

			} else {
				console.log('no events found');
			}
			$('.loading').fadeOut();
		});
	}

	function hideAllUIBoxes () {
		// quick hide all input and detail pop ups
		$('.event-details-box, .event-entry-box').hide();
	}

	function formatEventTime(date_obj) {
		// format the date objs for display
		return $.fullCalendar.formatDate(date_obj, 'MMMM d, yyyy h:mm tt');
	}

}

