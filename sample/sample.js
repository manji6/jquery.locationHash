$(function(){
	$("#separater_keykey span").text($.locationHash.str_separaterKeyKey);
	$("#separater_keyvalue span").text($.locationHash.str_separaterKeyValue);
	$("#separater_valuevalue span").text($.locationHash.str_separaterValueValue);

	$("#sample2_textarea").val($("#sample2_form1").html());

});
$("#sample1 a.running").click(function(){
	location.hash = $("#sample1 input.input_param").val();
	$("#sample1 span.result").text($.param($.getParameterFromLocationHash()));
	$("#sample1 span.result2").text($.param($.getParameterFromLocationHash({preprocess:function(){
		if(location.hash.indexOf("?") > -1){
			return location.hash.slice(0,location.hash.indexOf("?"));
		}else{
			return location.hash;
		}
	}})));
	console.log($.getParameterFromLocationHash());
	console.log($.getParameterFromLocationHash({preprocess:function(){
		if(location.hash.indexOf("?") > -1){
			return location.hash.slice(0,location.hash.indexOf("?"));
		}else{
			return location.hash;
		}
	}}));
});

$("#sample2 a.running").click(function(){
	$("#sample2 span.result").text($("#sample2_form1").getLocationHash());

});

$("#sample2 #sample2_textarea").keyup(function(){
	$("#sample2_form1").html($("#sample2_textarea").val());
});
