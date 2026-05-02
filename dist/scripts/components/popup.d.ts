import { Base } from './Base.js';
type PopupField = {
    name: string;
    label: string;
    value?: string;
    placeholder?: string;
};
export declare class Popup extends Base<HTMLDivElement> {
    private static _instance;
    private _popupCard;
    private _titleElement;
    private _messageElement;
    private _formElement;
    private _confirmButton;
    private _cancelButton;
    private _closeButton;
    private _onConfirm;
    private _onCancel;
    private _isForm;
    constructor();
    static showAlert(message: string, title?: string): void;
    static showConfirm(message: string, onConfirm: () => void, options?: {
        title?: string;
        confirmText?: string;
        cancelText?: string;
        onCancel?: () => void;
    }): void;
    static showForm(title: string, fields: PopupField[], onSubmit: (values: Record<string, string>) => void | false | string, options?: {
        message?: string;
        confirmText?: string;
        cancelText?: string;
        onCancel?: () => void;
    }): void;
    private static _ensureInstance;
    private _show;
    private _hide;
    private _registerEvents;
    private _renderForm;
    private _getFormValues;
}
export {};
//# sourceMappingURL=popup.d.ts.map