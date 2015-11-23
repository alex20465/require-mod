/**
 * This module-file exports the class **ProxyScope**.
 *
 * @author Alexandros Fotiadis <fotiadis90@gmail.com>
 */

import { IModule } from "./IModule";

import assert = require("assert");

/**
 * This class represents the proxy scope of a nodejs-module-object.
 */
export class ProxyScope {

    /**
     * The module of the scope, we override the ``require`` function
     * with our a wrapper-handler and modify the process.
     *
     * @type {IModule}
     */
    protected module: IModule;

    /**
     * Backup of the origin require function of the module.
     *
     * @type {Function}
     */
    protected requireOrigin: Function;

    /**
     * Contructor of the class.
     *
     * @param {any} _module the module object.
     */
    constructor( _module: any ) {

        try {
            assert.ok( (<IModule>_module).loaded );
            assert.ok( (<IModule>_module).filename );
        } catch(e) {
            throw new Error("unhandled module object");
        }

        this.module = <IModule>_module;
    }

    /**
     * Method to define the execution pattern.
     *
     * @param  {RegEx}     RegEx the regex pattern which should match to the
     *                           require string.
     *
     * @return {ProxyScope}
     */
    when ( RegEx ): ProxyScope {

        return this;
    }

    use ( fn: Function ){ }

    redirect( modulename: string ) {}

    resolve( exports: any ) {}

    reset () { }

}