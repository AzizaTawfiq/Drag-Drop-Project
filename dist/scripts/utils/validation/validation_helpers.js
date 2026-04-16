export const assignValidateInputs = (titleValue, descValue) => {
    const titleInputRule = {
        type: 'title',
        value: titleValue,
        required: true,
        minLength: 4,
        maxLength: 30
    };
    const descInputRule = {
        type: 'description',
        value: descValue,
        required: true,
        minLength: 10,
        maxLength: 100
    };
    return [titleInputRule, descInputRule];
};
export const handleValidationErrors = (inputRule) => {
    let errorMessage = '';
    if (inputRule.required && inputRule.value.trim().length === 0) {
        errorMessage = `${inputRule.type} is required.`;
    }
    if (inputRule.minLength && inputRule.value.length < inputRule.minLength) {
        errorMessage = `${inputRule.type} must be at least ${inputRule.minLength} characters long.`;
    }
    if (inputRule.maxLength && inputRule.value.length > inputRule.maxLength) {
        errorMessage = `${inputRule.type} must be less than ${inputRule.maxLength} characters long.`;
    }
    return errorMessage;
};
//# sourceMappingURL=validation_helpers.js.map