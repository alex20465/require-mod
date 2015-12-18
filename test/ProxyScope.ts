/**
 * Module tests for the requireProxy module.
 */

import expect = require("expect.js");

import {ProxyScope} from "../lib/ProxyScope";

describe( 'requireProxy - with mock environment', () => {

    var scope: ProxyScope, requireHandler, fakeModule;

    beforeEach( () => {

        fakeModule = {
            require: function( modulename ){
                switch (modulename) {
                    case "fs":
                        return "filesystem";
                    default:
                        return null;
                }
            },
            filename: 'foo/bar.js',
            loaded: true
        }

        scope = new ProxyScope(fakeModule);

    } );

    afterEach( () => {
        scope.reset();
    } );

    it("should redirect the required modulename", () => {

        scope.when(/.*?/).redirect('fs');

        var requireModulename, moduleExport, failed = false;

        try {
            moduleExport = fakeModule.require('any');
        } catch (e) {
            failed = true;
        }

        expect( failed ).be( false );
        expect( moduleExport ).to.be("filesystem");
    });

    it("should require the origin handler", () => {
        scope.when(/.*?/).use( (modulename) => {
            return "handler";
        } );

        var fs = scope.require('fs');

        expect(fs).to.be("filesystem");
    });

    it("should have reset the registered handlers", () => {

        var requireModulename, failed = false;

        try {
            require('any');
        } catch (e) {
            failed = true;
        }

        expect( failed ).be( true );
    });

    it("should use the function handler", () => {

        var requireModulename, failed = false, moduleExport;

        scope.when(/.*?/).use( (modulename) => {
            requireModulename = modulename;
            return "handler";
        } );


        try {
            moduleExport = fakeModule.require('any');
        } catch (e) {
            failed = true;
        }

        expect( failed ).be( false );
        expect( moduleExport ).to.be('handler');
        expect( requireModulename ).to.be('any');
    });

    it("should redirect a requirement", () => {

        var requireModulename, failed = false, moduleExport;

        scope.when(/.*?/).redirect("fs");

        try {
            moduleExport = fakeModule.require('any');
        } catch (e) {
            failed = true;
        }

        expect( failed ).be( false );
        expect( moduleExport ).to.be("filesystem");
    });
} );
