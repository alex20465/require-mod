
/**
 * The nodejs module interface.
 */
export interface IModule {
    require: Function;
    exports: Object;
    filename: string;
    loaded:boolean;
    children: Array<IModule>;
    paths: Array<string>;
}
