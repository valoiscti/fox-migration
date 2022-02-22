function dispatchByPan(pageId, functionName) {
	var param1 = document.getElementById("voicePlb.pan:input").value;
	if (param1) {
		window.open(pageId + "." + functionName + ".dispatch?param1=" + param1);
	} else {
		window.open(pageId + "." + functionName + ".dispatch");
	}
	return false;
}

function dispatchByMerchant(pageId, functionName) {
	var param1 = document.getElementById("voicePlb.linkParamMerchantId:input").value;
	var param2 = document.getElementById("voicePlb.linkParamMandantId:input").value
	if (param1 && param2) {
		window.open(pageId + "." + functionName + ".dispatch?param1=" + param1 + "&param2=" + param2);
	} else {
		window.open(pageId + "." + functionName + ".dispatch");
	}
	return false;
}

function openPass(passServer, mandantId) {
	if (passServer && mandantId && passServer.length > 0 && mandantId.length > 0) {
		window.open(passServer + "?clientId=" + mandantId);
	} 
	return false;
}

function openPassByMerchant(passServer, mandantId) {
	var param = document.getElementById("voicePlb.linkParamMerchantId:input").value;
	if (passServer && mandantId && passServer.length > 0 && mandantId.length > 0 && param) {
		window.open(passServer + "?clientId=" + mandantId + "&simplesearch=" + param);
	} 
	return false;
}