import { Base } from './Base.js';

type PopupVariant = 'alert' | 'confirm' | 'form';

type PopupField = {
    name: string;
    label: string;
    value?: string;
    placeholder?: string;
};

type PopupOptions = {
    title: string;
    message: string;
    variant: PopupVariant;
    confirmText: string;
    cancelText?: string;
    fields?: PopupField[];
    onConfirm?: (() => void | false | string) | undefined;
    onCancel?: (() => void) | undefined;
};

export class Popup extends Base<HTMLDivElement> {
    private static _instance: Popup | null = null;
    private _popupCard: HTMLDivElement;
    private _titleElement: HTMLHeadingElement;
    private _messageElement: HTMLParagraphElement;
    private _formElement: HTMLDivElement;
    private _confirmButton: HTMLButtonElement;
    private _cancelButton: HTMLButtonElement;
    private _closeButton: HTMLButtonElement;
    private _onConfirm: (() => void | false | string) | null = null;
    private _onCancel: (() => void) | null = null;
    private _isForm = false;

    constructor() {
        super('popup_template', 'app', false, 'popup_container'); 
        this._popupCard = this.element.querySelector('.popup')! as HTMLDivElement;
        this._titleElement = this.element.querySelector('.popup_title')! as HTMLHeadingElement;
        this._messageElement = this.element.querySelector('.desc_popup')! as HTMLParagraphElement;
        this._formElement = this.element.querySelector('.popup_form')! as HTMLDivElement;
        this._confirmButton = this.element.querySelector('.confirm-popup-btn')! as HTMLButtonElement;
        this._cancelButton = this.element.querySelector('.cancel-popup-btn')! as HTMLButtonElement;
        this._closeButton = this.element.querySelector('.close')! as HTMLButtonElement;
        Popup._instance = this;
        this._registerEvents();
    }

    /**
     * @desc Show alert popup with message.
     */
    public static showAlert(message: string, title: string = 'Alert') : void {
        Popup._ensureInstance()._show({
            title,
            message,
            variant: 'alert',
            confirmText: 'OK'
        });
    }

    /**
     * @desc Show confirmation popup.
     */
    public static showConfirm(message: string, onConfirm: () => void, options?: { title?: string; confirmText?: string; cancelText?: string; onCancel?: () => void; }) : void {
        Popup._ensureInstance()._show({
            title: options?.title ?? 'Confirm Delete',
            message,
            variant: 'confirm',
            confirmText: options?.confirmText ?? 'Delete',
            cancelText: options?.cancelText ?? 'Cancel',
            onConfirm,
            onCancel: options?.onCancel
        });
    }

    /**
     * @desc Show form popup.
     */
    public static showForm(
        title: string,
        fields: PopupField[],
        onSubmit: (values: Record<string, string>) => void | false | string,
        options?: { message?: string; confirmText?: string; cancelText?: string; onCancel?: () => void; }
    ) : void {
        const popup = Popup._ensureInstance();

        popup._show({
            title,
            message: options?.message ?? '',
            variant: 'form',
            confirmText: options?.confirmText ?? 'Save',
            cancelText: options?.cancelText ?? 'Cancel',
            fields,
            onConfirm: () => onSubmit(popup._getFormValues()),
            onCancel: options?.onCancel
        });
    }

    private static _ensureInstance() : Popup {
        if (!Popup._instance) {
            throw new Error('Popup must be initialized before use.');
        }
        return Popup._instance;
    }

    private _show(options: PopupOptions) : void {
        this._popupCard.classList.remove('popup--alert', 'popup--confirm', 'popup--form');
        this._titleElement.textContent = options.title;
        this._messageElement.textContent = options.message;
        this._messageElement.classList.remove('desc_popup--error');
        this._confirmButton.textContent = options.confirmText;
        this._onConfirm = options.onConfirm ?? null;
        this._onCancel = options.onCancel ?? null;
        this._isForm = options.variant === 'form';
        this._renderForm(options.fields ?? []);

        const isConfirmPopup = options.variant === 'confirm';
        const popupClass = isConfirmPopup ? 'popup--confirm' : (this._isForm ? 'popup--form' : 'popup--alert');
        this._popupCard.classList.add(popupClass);
        this._cancelButton.textContent = options.cancelText ?? 'Cancel';
        this._cancelButton.classList.toggle('hidden', options.variant === 'alert');
        this._confirmButton.classList.toggle('danger', isConfirmPopup);

        this.element.classList.add('visible_popup');
        const firstInput = this._formElement.querySelector('input') as HTMLInputElement | null;
        if (this._isForm && firstInput) {
            firstInput.focus();
            firstInput.select();
            return;
        }
        this._confirmButton.focus();
    }

    private _hide() : void {
        this.element.classList.remove('visible_popup');
        this._onConfirm = null;
        this._onCancel = null;
        this._formElement.innerHTML = '';
        this._isForm = false;
    }

    /**
     * @desc Attach popup events.
     */
    private _registerEvents() : void {
        this._closeButton.addEventListener('click', () => {
            this._onCancel?.();
            this._hide();
        });

        this._cancelButton.addEventListener('click', () => {
            this._onCancel?.();
            this._hide();
        });

        this._confirmButton.addEventListener('click', () => {
            const result = this._onConfirm?.();
            if (typeof result === 'string') {
                this._messageElement.textContent = result;
                this._messageElement.classList.add('desc_popup--error');
                return;
            }
            if (result === false) {
                return;
            }
            this._hide();
        });

        this.element.addEventListener('click', (event) => {
            if (event.target === this.element) {
                this._onCancel?.();
                this._hide();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.element.classList.contains('visible_popup')) {
                this._onCancel?.();
                this._hide();
                return;
            }
            if (event.key === 'Enter' && this.element.classList.contains('visible_popup') && this._isForm) {
                event.preventDefault();
                this._confirmButton.click();
            }
        });
    }

    private _renderForm(fields: PopupField[]) : void {
        this._formElement.innerHTML = '';
        const shouldShowForm = fields.length > 0;
        this._formElement.classList.toggle('hidden', !shouldShowForm);
        this._messageElement.classList.toggle('hidden', false);

        if (!shouldShowForm) {
            return;
        }

        for (const field of fields) {
            const row = document.createElement('div');
            row.className = 'popup_form_row';

            const label = document.createElement('label');
            label.className = 'popup_form_label';
            label.textContent = field.label;
            label.setAttribute('for', `popup-field-${field.name}`);

            const input = document.createElement('input');
            input.className = 'popup_form_input';
            input.id = `popup-field-${field.name}`;
            input.name = field.name;
            input.type = 'text';
            input.value = field.value ?? '';
            input.placeholder = field.placeholder ?? '';

            row.append(label, input);
            this._formElement.append(row);
        }
    }

    private _getFormValues() : Record<string, string> {
        const values: Record<string, string> = {};
        const inputs = this._formElement.querySelectorAll('.popup_form_input') as NodeListOf<HTMLInputElement>;

        for (const input of inputs) {
            values[input.name] = input.value;
        }

        return values;
    }
}