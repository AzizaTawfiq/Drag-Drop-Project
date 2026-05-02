import { Base } from './Base.js';
export class Popup extends Base {
    static _instance = null;
    _popupCard;
    _titleElement;
    _messageElement;
    _formElement;
    _confirmButton;
    _cancelButton;
    _closeButton;
    _onConfirm = null;
    _onCancel = null;
    _isForm = false;
    constructor() {
        super('popup_template', 'app', false, 'popup_container');
        this._popupCard = this.element.querySelector('.popup');
        this._titleElement = this.element.querySelector('.popup_title');
        this._messageElement = this.element.querySelector('.desc_popup');
        this._formElement = this.element.querySelector('.popup_form');
        this._confirmButton = this.element.querySelector('.confirm-popup-btn');
        this._cancelButton = this.element.querySelector('.cancel-popup-btn');
        this._closeButton = this.element.querySelector('.close');
        Popup._instance = this;
        this._registerEvents();
    }
    static showAlert(message, title = 'Alert') {
        Popup._ensureInstance()._show({
            title,
            message,
            variant: 'alert',
            confirmText: 'OK'
        });
    }
    static showConfirm(message, onConfirm, options) {
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
    static showForm(title, fields, onSubmit, options) {
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
    static _ensureInstance() {
        if (!Popup._instance) {
            throw new Error('Popup must be initialized before use.');
        }
        return Popup._instance;
    }
    _show(options) {
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
        const firstInput = this._formElement.querySelector('input');
        if (this._isForm && firstInput) {
            firstInput.focus();
            firstInput.select();
            return;
        }
        this._confirmButton.focus();
    }
    _hide() {
        this.element.classList.remove('visible_popup');
        this._onConfirm = null;
        this._onCancel = null;
        this._formElement.innerHTML = '';
        this._isForm = false;
    }
    _registerEvents() {
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
    _renderForm(fields) {
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
    _getFormValues() {
        const values = {};
        const inputs = this._formElement.querySelectorAll('.popup_form_input');
        for (const input of inputs) {
            values[input.name] = input.value;
        }
        return values;
    }
}
//# sourceMappingURL=popup.js.map