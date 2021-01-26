sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return {
		debug: function (param) {
			console.log(".............debug", param);
			return "";
		},
		encodeUri: function(sData) {
			return encodeURIComponent(sData);
		}
	};

});