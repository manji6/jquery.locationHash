/*
 * jquery.locationHash.js
 * unittest code (required Qunit)
 * 
 * @author Ryosuke Sawada
 * @require jQuery,Qunit
 */

module("$.locationHashParameter")

/* test1: location.hashが無い場合に値を追加する */
test("値の追加処理",function(){

	// location.hashの値をクリアする
	location.hash = "";

	// key => "key" value => "2" を追加処理
	$.locationHashParameter('key',2);
	same(location.hash,"#!key=2","key=2を追加");

	// key => "key" value => "1" を追加処理
	$.locationHashParameter('key',1);
	same(location.hash,"#!key=1|2","key=1を追加、値はsort()して順番を整える");
});


/* test2: パラメータの削除処理 */
test("値の削除処理",function(){

	// location.hashの値を定義する
	location.hash = "#!key=1|2";

	// key => "key" value => "1" を追加処理
	$.locationHashParameter('key',1);
	same(location.hash,"#!key=2","key=1の削除");

	// key => "key" value => "2" を追加処理
	$.locationHashParameter('key',2);
	same(location.hash,"#!","key自体の削除");

});

/* test3: 複数パラメーターの追加 */
test("複数キー値の追加処理",function(){

	// location.hash の値をクリアする
	location.hash = "";

	// key => "h-spa" value => "1" を追加処理
	$.locationHashParameter('h-spa',1);
	same(location.hash,"#!h-spa=1","キー'h-spa'の追加");

	// key => "h-parking" value => "1" を追加処理
	$.locationHashParameter('h-parking',1);
	same(location.hash,"#!h-parking=1&h-spa=1","キー'h-parking'の追加");


	// key => "h-big_bath" value => "1" を追加処理
	$.locationHashParameter('h-big_bath',1);
	same(location.hash,"#!h-big_bath=1&h-parking=1&h-spa=1","キー'h-big_bath'の追加");


});


/* test4: 複数パラメーターの削除 */
test("複数キー値が設定してある状態での削除処理",function(){

	location.hash = "#!h-big_bath=1&h-parking=1&h-spa=1";

	// key => "h-parking" value => "1" を追加処理
	$.locationHashParameter('h-parking',1);
	same(location.hash,"#!h-big_bath=1&h-spa=1","キー'h-parking'の削除");

	// key => "h-big_bath" value => "1" を追加処理
	$.locationHashParameter('h-big_bath',1);
	same(location.hash,"#!h-spa=1","キー'h-big_bath'の削除");

	// key => "h-spa" value => "1" を追加処理
	$.locationHashParameter('h-spa',1);
	same(location.hash,"#!","キー'h-spa'の削除");

});

/* test5: null値の追加 */
test("エラー処理",function(){

	// 一旦パラメーターを削除
	location.hash = "";

	var sReturn = "";

	// location.hashが"#"のみの場合、IE系は"#",それ以外は""となるので、対応させる

	if(!jQuery.support.noCloneEvent){
		sReturn = "#";
	}

	// key => "h-spa" value => undefined を追加処理
	$.locationHashParameter('h-spa');
	same(location.hash,sReturn,"valueがundefined時は処理せず終了");

	// 一旦パラメーターを削除
	location.hash = "";


	// key => "h-spa" value => "" を追加処理
	$.locationHashParameter('h-spa','');
	same(location.hash,"#!","valueが空文字時は値の削除処理をしてデフォルトパラメータを付けて終了");

	// 一旦パラメーターを削除
	location.hash = "";

	// key => undefined value => undefined を追加処理
	$.locationHashParameter();
	same(location.hash,sReturn,"keyがundefined時は処理せず終了");

	// 一旦パラメーターを削除
	location.hash = "";

	// key => "" value => undefined を追加処理
	$.locationHashParameter("");
	same(location.hash,sReturn,"keyが空文字時は処理せず終了");

});


module("$.locationHash");

/* 区切り文字列を書き換えて追加と削除を行う */
test("区切り文字列などの定義値変更処理",function(){

	// 区切り値を変更する
	$.locationHash = {
		"str_separaterKeyKey": '&',
	"str_separaterKeyValue": '=',
	"str_separaterValueValue": ',',
	"str_locationhashBefore": '#'
	};

	same($.locationHash.str_separaterKeyKey,"&","key値とkey値の区切り文字列を'&'へ変更");
	same($.locationHash.str_separaterKeyValue,"=","key値とvalue値の区切り文字列を'='へ変更");
	same($.locationHash.str_separaterValueValue,",","value値とvalue値の区切り文字列を','へ変更");
	same($.locationHash.str_locationhashBefore,"#","location.hashの先頭文字列からパラメータ値までにある不要な文字列を'#'へ変更");

	//値の追加を行う

	location.hash = "";

	// key => "key" value => "1" を追加処理
	$.locationHashParameter('key',1);
	same(location.hash,"#key=1","key=1を追加");

	// key => "key" value => "2" を追加処理
	$.locationHashParameter('key',2);
	same(location.hash,"#key=1,2","key=2を追加");

	// key => "key2" value => "ok" を追加処理
	$.locationHashParameter('key2',"ok");
	same(location.hash,"#key2=ok&key=1,2","key2=okを追加");

	// key => "key" value => "2" を追加処理
	$.locationHashParameter('key',2);
	same(location.hash,"#key2=ok&key=1","key=2を削除");

});

//最後に余計なハッシュフラグメントを取っておく
location.hash = "";


module("$.getLocationHash",{
	setup: function(){
		
		// 区切り文字指定を初期化
		$.locationHash = {
		    'str_separaterKeyKey':    '&'
		    ,'str_separaterKeyValue':  '='
		    ,'str_separaterValueValue':  '|'
		    ,'str_locationhashBefore':  "#!"
		}

	}
});


test("正常系の実行",function(){

	// テスト用のHTMLを生成する
	var aHtml = [];
	aHtml.push("<form id='testForm'>");
	aHtml.push("<input id='text1' name='text1' value='yes' />");
	aHtml.push("</form>");
	$("body").append(
		$("<div id='testFrame' />").append(aHtml.join("\n"))
	);
	
	same($("#testForm").getLocationHash(),"text1=yes","単体input値を判定");

	//複数パラメーターをセットした場合
	$("#testForm").append("<input id='text2' name='text2' value='hogehoge' />");
	same($("#testForm").getLocationHash(),"text1=yes&text2=hogehoge","複数input値を判定");

	// radioボタンを追加
	$("#testForm").append("<input type='radio' value='1' name='radio1' id='radio1__1' checked='checked'/>");
	same($("#testForm").getLocationHash(),"text1=yes&text2=hogehoge&radio1=1","radioパラメーター追加");

	// checkboxを追加
	$("#testForm").append("<input type='checkbox' value='1' name='checkbox1' id='checkbox1__1' checked='checked'/><input type='checkbox' value='2' name='checkbox1' id='checkbox1__2'/>");
	same($("#testForm").getLocationHash(),"text1=yes&text2=hogehoge&radio1=1&checkbox1=1","checkbox追加");

	// checkboxを追加
	$("#testForm").append("<input type='checkbox' value='3' name='checkbox1' id='checkbox1__3' checked='checked'/><input type='checkbox' value='4' name='checkbox1' id='checkbox1__4'/>");
	same($("#testForm").getLocationHash(),"text1=yes&text2=hogehoge&radio1=1&checkbox1=1|3","checkbox複数選択状態");

	// マージパラメーター処理を付与し、該当パラメーターを増やす

	$("#testForm").append("<input type='checkbox' value='1' name='checkbox2__1' id='checkbox2__1' checked='checked'/><input type='checkbox' value='1' name='checkbox2__2' id='checkbox2__2' checked='checked'/>");
	same($("#testForm").getLocationHash({mergeParam: ["checkbox2"]}),"text1=yes&text2=hogehoge&radio1=1&checkbox1=1|3&checkbox2=1|2","パラメーターのマージ処理付与");

	// selectboxを追加
	$("#testForm").append("<select name='select1' id='select1'><option value=''>未定</option><option value='1'>One.</option><option value='2' selected='selected'>Two.</value></select>");
	same($("#testForm").getLocationHash({mergeParam: ["checkbox2"]}),"text1=yes&text2=hogehoge&radio1=1&checkbox1=1|3&checkbox2=1|2&select1=2","セレクトボックス処理");

});


test("オプションパラメーター",function(){

	// location.hashの値をクリアする
	location.hash = "#!";

	// key => "key" value => "2" を追加処理
	$.locationHashParameter('key',2);
	same(location.hash,"#!key=2","key=2を追加");

	// key => "key" value => "2" を追加処理
	$.locationHashParameter('key',3,{"forceUpdate": true});
	same(location.hash,"#!key=3","forceUpdateモードなので値は書き換えられて3になる");

	// key => "key" value => "2" を追加処理
	$.locationHashParameter('key',"",{"forceUpdate": true});
	same(location.hash,"#!","値が消える");

	// key => "key" value => "2" を追加処理
	$.locationHashParameter('key',3,{"forceUpdate": true});
	same(location.hash,"#!key=3","forceUpdateモードなので値は書き換えられて3になる");

	// key => "key" value => "2" を追加処理
	$.locationHashParameter('key',1,{"forceUpdate": false});
	same(location.hash,"#!key=1|3","値の追加");

	// key => "key" value => "2" を追加処理
	$.locationHashParameter('key',"",{"forceUpdate": true});
	same(location.hash,"#!","値が消えるべき");


});
