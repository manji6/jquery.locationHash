$(function(){
	$("#separater_keykey span").text($.locationHash.str_separaterKeyKey);
	$("#separater_keyvalue span").text($.locationHash.str_separaterKeyValue);
	$("#separater_valuevalue span").text($.locationHash.str_separaterValueValue);

	$("#sample2_textarea").val($("#sample2_form1").html());

});
$("#sample1 a.running").click(function(){
	location.hash = $("#sample1 input.input_param").val();
	$("#sample1 span.result").text($.param($.getParameterFromLocationHash()));
	console.log($.getParameterFromLocationHash());
});

$("#sample2 a.running").click(function(){
	$("#sample2 span.result").text($("#sample2_form1").getLocationHash());

});

$("#sample2 #sample2_textarea").keyup(function(){
	$("#sample2_form1").html($("#sample2_textarea").val());
});
