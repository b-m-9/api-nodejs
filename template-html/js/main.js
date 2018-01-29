jQuery(document).ready(function($) {
	$(function() {

	  $('select, input').styler();

	});

	$('.list-code > li').each(function(index, el) {
		$(el).prepend('<span>'+ ++index +'</span>')
	});
});