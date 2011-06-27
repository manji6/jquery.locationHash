/**
 * jQuery.locationHash.js
 *
 * @author Ryosuke Sawada<ryosuke.sawada@gmail.com>
 * @require jQuery
 * @licence MIT Licence
 */

/**
 * See (http://jquery.com/).
 * @name $
 * @class
 * See the jQuery Library  (http://jquery.com/) for full details.  This just
 * documents the function and classes that are added to jQuery by this plug-in.
 */

/**
 * See (http://jquery.com/)
 * @name $.fn
 * @class
 * See the jQuery Library  (http://jquery.com/) for full details.  This just
 * documents the function and classes that are added to jQuery by this plug-in.
 */

/**
 *
 * jQuery.locationHash()の設定を行う
 *
 * @param {Object} oSetting 設定オブジェクト
 **/
$.locationHash = {
	 'str_separaterKeyKey':    '&'
	,'str_separaterKeyValue':  '='
	,'str_separaterValueValue':  '|'
	,'str_locationhashBefore':  "#!"
}


/**
 *
 * jQuery.locationHash()のパラメーターをセットする
 * (該当キーが無い場合：追加、ある場合：削除)
 * (Value値も設定していたら、該当key&valueが有る場合にのみ削除を行う)
 *
 * @param {String} sKey   キー
 * @paran {String} sValue 値(null時は登録なし)
 **/
$.locationHashParameter = function(sKey,sValue){

	//sValueが指定されていない場合は処理せず終了
	if(typeof sValue === "undefined" || sValue === ""){
		return false;
	}
	//sKeyが指定されていない場合は処理せず終了
	if(typeof sKey === "undefined" || sKey === ""){
		return false;
	}

	var iTargetKeyNum = -1;

	// 現在のlocation.hash値配列を取得
	// (不要な文字列を削除して、keyとkeyの区切り記号で分割したものを用意)
	var aLocationHash = (function(){
		var sLocationHash = location.hash.slice($.locationHash.str_locationhashBefore.length);

		if(sLocationHash === ""){
			return [];
		}else{
			return sLocationHash.split($.locationHash.str_separaterKeyKey);
		}
	})();

	// 該当keyの状況を取得
	for(var i in aLocationHash){
		if(aLocationHash[i].toString().indexOf(sKey) > -1){
			iTargetKeyNum = i;
		}
	}

	// location.hash内に該当のkey値が有りValue値が同じ場合は削除、無い場合は値を追加
	if(iTargetKeyNum > -1){
		//判定結果：該当するキーがする
		//　既にvalueはセットしてあるかしてないかを判定
		aLocationHash = (function(){
			var sKeyName = aLocationHash[iTargetKeyNum].substring(0,aLocationHash[iTargetKeyNum].indexOf($.locationHash.str_separaterKeyValue));
			var sTmpValue = aLocationHash[iTargetKeyNum].substring(aLocationHash[iTargetKeyNum].indexOf($.locationHash.str_separaterKeyValue)+1);
			var aValue = sTmpValue.split($.locationHash.str_separaterValueValue);
			var iTargetValueNum = -1;

			for(var i in aValue){
				if(aValue[i].toString().indexOf(sValue) > -1){
					iTargetValueNum = i;
				}
			}

			if(iTargetValueNum > -1){
				//既にValue値が存在する＝値の削除
				//　値が複数ある場合はValue配列から該当値を削除、単数の場合は配列を初期化
				if(aValue.length === 1){
					aValue = [];
				}else{
					aValue.splice(iTargetValueNum,1);
				}
			}else{
				//Value値が存在しない＝同一KeyのValue値追加
				aValue.push(sValue.toString());
			}

			// 更新したValue値をセットする
			if(aValue.length === 0){
				aLocationHash.splice(iTargetKeyNum,1);
			}else{
				aValue.sort();
				aLocationHash[iTargetKeyNum] = sKeyName+$.locationHash.str_separaterKeyValue+aValue.join($.locationHash.str_separaterValueValue);
			}
			return aLocationHash;
		})();

	}else{
		// 判定結果：該当するキーが無い
		// キーと値の追加を行う
		aLocationHash.push(sKey+$.locationHash.str_separaterKeyValue+sValue.toString());
	}

	aLocationHash.sort();

	// location.hashに戻す
	location.hash = $.locationHash.str_locationhashBefore+aLocationHash.join($.locationHash.str_separaterKeyKey);

}

/**
 * 特定要素配下にある要素のinput要素を取得してLocationHash文字列を生成する
 *
 * mergeParam:セットしたキー名は値を複数もつことが可能。その際のキー名は"キー名__値"となっていること。
 *
 * @param {Object} oOption オプション定義オブジェクト
 * @return {String} LocationHash文字列
 **/
$.fn.getLocationHash = function(oOption){

	//設定オブジェクト
	oOption = $.extend(true,{},{
		mergeParam:[],		//@param {Array} 配列内にセットしたキー名は、値を複数持つ事が可能
		ignoreParam:[]		//@param {Array} 配列内にセットしたキー名は、処理をしない(値定義をしない)事が可能
	},oOption);

	//リクエスト配列
	var aRequest = $(this).serializeArray();
	//中間処理用リクエストオブジェクト
	var oRequest = {};
	//戻り値
	var aHash = [];

	// 1回目は強制的にループ処理をし、マージパラメーター処理が1個以上定義してあれば複数回ループ処理を行う
	var oTmpMergeParam = {};
	if(oOption.mergeParam.length > 0){
		for(var j = 0, leng = oOption.mergeParam.length; j < leng; j++){
			oTmpMergeParam[oOption.mergeParam[j]] = [];
		}
	}

	for(var i = 0,len = aRequest.length; i < len; i++){
		//ignoreParamに定義されている値の場合は処理しない
		if(oOption.ignoreParam.join(",").indexOf(aRequest[i].name) > -1){
			continue;
		}

		//Value値がnullの場合は処理しない
		if(aRequest[i].value === ""){continue;}

		//マージ対応するパラメーターはここで取り出しておく
		if(oOption.mergeParam.length > 0){
			var sExecutedName = "";
			for(var j = 0, leng = oOption.mergeParam.length; j < leng; j++){
				if(aRequest[i].name.indexOf(oOption.mergeParam[j]) > -1){
					oTmpMergeParam[oOption.mergeParam[j]].push(aRequest[i].name.split("__")[1]);
					sExecutedName = oOption.mergeParam[j];
				}
			}
			if(sExecutedName !== ""){
				oRequest[sExecutedName] = [];
				continue;
			}
		}

		if(typeof oRequest[aRequest[i].name] === "undefined"){
			oRequest[aRequest[i].name] = [];
		}
		oRequest[aRequest[i].name].push(aRequest[i].value);
	}

	//マージ処理用パラメータを結合してリクエストオブジェクトへ展開
	if(oOption.mergeParam.length > 0){
		for(var name in oTmpMergeParam){
			if(oTmpMergeParam[name].length > 0){
				oRequest[name] = oTmpMergeParam[name];
			}
		}
	}

	// 値を整理しながら文字列を生成
	for(name in oRequest){
		aHash.push(name+$.locationHash.str_separaterKeyValue+oRequest[name].join($.locationHash.str_separaterValueValue));
	}

	return aHash.join($.locationHash.str_separaterKeyKey);
}

/**
 * locationhashからパラメーターオブジェクトを取得する
 *
 * @param {Object} oSetting 設定オブジェクト
 * @return {Array}          パラメーターオブジェクト(array->object)
 **/
$.getParameterFromLocationHash = function(){

	// 値の定義
	var aReturn = new Array();
	var oReturn = {};
	var aHashParam = location.hash.slice(2).split($.locationHash.str_separaterKeyKey);

	for(i = 0,len = aHashParam.length; i < len; i++){
		if(aHashParam[i] === ""){
			continue;
		}
		var aHashSplitParam = aHashParam[i].split($.locationHash.str_separaterKeyValue);
		if(aHashSplitParam[1].indexOf($.locationHash.str_separaterValueValue) > -1){
			aHashSplitParam[1] = aHashSplitParam[1].split($.locationHash.str_separaterValueValue);
		}
		oReturn[aHashSplitParam[0]] = aHashSplitParam[1];
	}
	return oReturn;
}


