/**
 * This module-file exports the class **ProxyScope**.
 *
 * @author Alexandros Fotiadis <fotiadis90@gmail.com>
 */

import { IModule } from "./IModule";

import assert = require("assert");

/**
 * The ``use`` function hander for a proxy registration.
 */
export interface IRequireHandler {
    (modulename: string): void
}

/**
 * The possible proxy scenarios.
 */
export enum SCENARIOS {REDIRECTION, HANDER, STORE}

/**
 * Proxy registration interface.
 */
export interface IProxyRegister {

    expression: RegExp;

    scenario: SCENARIOS;

    definition: any;
}

/**
 * This class represents the proxy scope of a nodejs-module-object.
 */
export class ProxyScope {

    /**
     * The current active target of the chaining.
     *
     * @type {RegExp}
     */
    protected activeTarget: RegExp;

    /**
     * The registration list-container.
     *
     * @type {Array<IProxyRegister>}
     */
    protected registry: Array<IProxyRegister>;

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
        this.registry = [];
        this.requireOrigin = this.module.require;
        this.module.require = this.requireHandler.bind(this);
    }

    /**
     * The require override wrapper, to modify the process and add
     * modifications such as proxy handlers or registered exports.
     *
     * By no pattern match we just continue to the origin-require
     * method.
     *
     * @param  {string} modulename the required modulename
     * @return {any} the module export
     */
    protected requireHandler( modulename ): any {

        var firstMatch: IProxyRegister, Exports;

        for (var i = 0; i < this.registry.length; ++i) {
            var reg = this.registry[i];
            if( reg.expression.exec( modulename ) ) {
                firstMatch = reg;
                break;
            }
        }

        if( firstMatch !== undefined ) {

            switch (firstMatch.scenario) {

                case SCENARIOS.HANDER:
                    Exports = (<IRequireHandler>firstMatch.definition)
                        .call(this.module, modulename);
                    break;

                case SCENARIOS.REDIRECTION:
                    Exports = this.requireOrigin
                        .call(this.module, firstMatch.definition);
                    break;

                case SCENARIOS.STORE:
                    Exports = firstMatch.definition;
                    break;

                default:
                    throw new Error("scenario out of range");
                    break;
            }
        } else {
            Exports = this.requireOrigin.call( this.module, modulename );
        }

        return Exports;
    }

    /**
     * Method to define the execution pattern.
     *
     * @param {RegEx} RegEx the regex pattern which should match
     * to the require string.
     *
     * @return {ProxyScope}
     */
    when ( RegEx ): ProxyScope {

        this.activeTarget = RegEx;

        return this;
    }

    /**
     * Register the regex pattern with a function-hanlder callback.
     *
     * @param {Function} fn the require handler
     */
    use ( fn: Function ){
        this.registry.push( {
            expression: this.activeTarget,
            definition: fn,
            scenario: SCENARIOS.HANDER
        } );

        this.activeTarget = undefined;
    }

    /**
     * Register the regex pattern with a string modulename redirection.
     *
     * @param {string} modulename the modulename destionation
     */
    redirect( modulename: string ) {

        this.registry.push( {
            expression: this.activeTarget,
            definition: modulename,
            scenario: SCENARIOS.REDIRECTION
        } );

        this.activeTarget = undefined;
    }

    /**
     * Register the regex pattern the the export value.
     *
     * @param {any} exports the proxy export value
     */
    resolve( exports: any ) {
        this.registry.push( {
            expression: this.activeTarget,
            definition: exports,
            scenario: SCENARIOS.STORE
        } );

        this.activeTarget = undefined;
    }

    /**
     * Remove all define registered handlers.
     */
    reset () {
        this.registry = [];
    }
}