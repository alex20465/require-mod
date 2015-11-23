/**
 * Module tests for the requireProxy module.
 */

import expect = require("expect.js");

import {ProxyScope} from "../lib/require-proxy";

describe( 'requireProxy', () => {

    var scope: ProxyScope, requireHandler;

    beforeEach( () => {

        var fakeModule = {
            require: function( modulename ){
                 if( requireHandler ) {
                    return requireHandler(modulename);
                 } else {
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

        scope.when(/.*?/).redirect('foo');

        var requireModulename, moduleExport, failed = false;

        requireHandler = ( modulename ) => {
            requireModulename = modulename;

            return "working";
        }

        try {
            moduleExport = require('any');
        } catch (e) {
            failed = true;
        }

        expect( failed ).be( false );
        expect( moduleExport ).to.be('working');
        expect( requireModulename ).be('foo');
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

} )
