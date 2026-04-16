import type { validation } from './validation_types.js';
/**
 *@desc Assigns validation rules to the input fields of the form
 @param1 titleValue : string
 @param2 descValue : string
@return validation rules for title and description input fields
 */
export const assignValidateInputs = (titleValue: string, descValue: string) => {
    const titleInputRule: validation = {
        type: 'title',
        value: titleValue,
        required: true,
        minLength: 4,
        maxLength: 30
    };
    const descInputRule: validation = {
        type: 'description',
        value: descValue,
        required: true,
        minLength: 10,
        maxLength: 100
    };
    return [titleInputRule, descInputRule];
}  

/**
 @desc handle validation errors
 @param inputRule input pattern to validate
 @return error message if validation fails
 */

export const handleValidationErrors = (inputRule: validation): string => {
    let errorMessage: string  = '';
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
}
    