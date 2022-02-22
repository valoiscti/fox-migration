function dispatchByMerchant(pageId, functionName, merchantId, mandantId) {
	if (merchantId && mandantId) {
		window.open(pageId + "." + functionName + ".dispatch?param1=" + merchantId + "&param2=" + mandantId);
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

function openPassByMerchant(passServer, merchantId, mandantId) {
	if (passServer && mandantId && passServer.length > 0 && mandantId.length > 0 && merchantId) {
		window.open(passServer + "?clientId=" + mandantId + "&simplesearch=" + merchantId);
	} 
	return false;
}