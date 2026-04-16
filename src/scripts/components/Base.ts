export class Base <T extends HTMLElement> {
    private _template!: HTMLTemplateElement;
    private _hostElement!: HTMLDivElement;
    public element: T;
    constructor(
        private _templateId: string, 
        private _hostId: string, 
        private _positionElementStart: boolean, 
        private _elementId?: string
    ) {
            const [template, host] = this._targetElements(this._templateId, this._hostId);
            const templateContent = document.importNode(template.content, true);
            this.element = templateContent.firstElementChild as T;
            if (this._elementId) {
                this.element.id = this._elementId;
                this._insertElement(this._positionElementStart);
            }
        }

        /**
         * @desc targets element: template, host
         * @param1 templateId: string - the id of the template to be targeted 
         * @param2 hostId: string - the id of the host element where the targeted element is located
         * @return [template: HTMLTemplateElement, host: HTMLDivElement] - the targeted template and host elements
         */
        protected _targetElements(templateId: string, hostId: string): [HTMLTemplateElement, HTMLDivElement] {
             this._template = document.getElementById(templateId)! as HTMLTemplateElement;
            this._hostElement = document.getElementById(hostId)! as HTMLDivElement;
            return [this._template, this._hostElement];
        }

        private _insertElement(positionElementStart: boolean) {
            const isInsertStart = positionElementStart ? 'afterbegin' : 'beforeend';
            this._hostElement.insertAdjacentElement(isInsertStart, this.element);
        }
}