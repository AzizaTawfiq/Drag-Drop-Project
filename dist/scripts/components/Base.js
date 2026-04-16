export class Base {
    _templateId;
    _hostId;
    _positionElementStart;
    _elementId;
    _template;
    _hostElement;
    element;
    constructor(_templateId, _hostId, _positionElementStart, _elementId) {
        this._templateId = _templateId;
        this._hostId = _hostId;
        this._positionElementStart = _positionElementStart;
        this._elementId = _elementId;
        const [template, host] = this._targetElements(this._templateId, this._hostId);
        const templateContent = document.importNode(template.content, true);
        this.element = templateContent.firstElementChild;
        if (this._elementId) {
            this.element.id = this._elementId;
            this._insertElement(this._positionElementStart);
        }
    }
    _targetElements(templateId, hostId) {
        this._template = document.getElementById(templateId);
        this._hostElement = document.getElementById(hostId);
        return [this._template, this._hostElement];
    }
    _insertElement(positionElementStart) {
        const isInsertStart = positionElementStart ? 'afterbegin' : 'beforeend';
        this._hostElement.insertAdjacentElement(isInsertStart, this.element);
    }
}
//# sourceMappingURL=Base.js.map