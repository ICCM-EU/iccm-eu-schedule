var duration = 15000;
var fadeTime = 2000;

function initialize() {
	if ($('#active').length == 0) {
		$('.container').each(function(i, obj) {
			if (i == 0) {
				$(obj).attr('id', 'active');
			} else {
				$(obj).css('display', 'none');
			}
		})
	}
}

$(document).ready(function() {
	initialize();
	setTimeout(doToggle, duration);
});

function doToggle() {
	var active = 0;
	var total = $('.container').length;

	setTimeout(doToggle, duration);
	$('.container').each(function(i, obj) {
		if ($(obj).get(0).id == 'oldactive') {
			$(obj).removeAttr('id');
		}
		if ($(obj).get(0).id == 'active') {
			active = i;
		}
	});

	$('.container').each(function(i, obj) {
		if (i == active) {
			$(obj).attr('id', 'oldactive');
			$(obj).fadeOut(fadeTime);
		}
		if ((active < total - 1 && i == active + 1) ||
				(active >= total - 1 && i == 0)) {
			$(obj).attr('id', 'active')
			$(obj).fadeIn(fadeTime);
		}
	});
}
