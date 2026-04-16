export declare class Base<T extends HTMLElement> {
    private _templateId;
    private _hostId;
    private _positionElementStart;
    private _elementId?;
    private _template;
    private _hostElement;
    element: T;
    constructor(_templateId: string, _hostId: string, _positionElementStart: boolean, _elementId?: string | undefined);
    protected _targetElements(templateId: string, hostId: string): [HTMLTemplateElement, HTMLDivElement];
    private _insertElement;
}
//# sourceMappingURL=Base.d.ts.map