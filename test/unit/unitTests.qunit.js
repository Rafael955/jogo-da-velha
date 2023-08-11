/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"jogo_da_velha/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
