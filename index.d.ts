declare module 'require-mod/lib/IModule' {
    /**
     * The nodejs module interface.
     */
    export interface IModule {
        require: Function;
        exports: Object;
        filename: string;
        loaded: boolean;
        children: Array<IModule>;
        paths: Array<string>;
    }

}
declare module 'require-mod/lib/ProxyScope' {
    /**
     * This module-file exports the class **ProxyScope**.
     *
     * @author Alexandros Fotiadis <fotiadis90@gmail.com>
     */
    import { IModule } from 'require-mod/lib/IModule';
    /**
     * The ``use`` function hander for a proxy registration.
     */
    export interface IRequireHandler {
        (modulename: string): void;
    }
    /**
     * The possible proxy scenarios.
     */
    export enum SCENARIOS {
        REDIRECTION = 0,
        HANDER = 1,
        STORE = 2,
    }
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
        constructor(_module: any);
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
        protected requireHandler(modulename: any): any;
        /**
         * Method to define the execution pattern.
         *
         * @param {RegEx} RegEx the regex pattern which should match
         * to the require string.
         *
         * @return {ProxyScope}
         */
        when(RegEx: any): ProxyScope;
        /**
         * Register the regex pattern with a function-hanlder callback.
         *
         * @param {Function} fn the require handler
         */
        use(fn: Function): void;
        /**
         * Register the regex pattern with a string modulename redirection.
         *
         * @param {string} modulename the modulename destionation
         */
        redirect(modulename: string): void;
        /**
         * Register the regex pattern the the export value.
         *
         * @param {any} exports the proxy export value
         */
        resolve(exports: any): void;
        /**
         * Remove all define registered handlers.
         */
        reset(): void;
        /**
         * Pass the requirement to the origin handler.
         * @param  {string} modulename
         * @return {any}
         */
        require(modulename: string): any;
    }

}
declare module 'require-mod' {
    import main = require('require-mod/lib/ProxyScope');
    export = main;
}
