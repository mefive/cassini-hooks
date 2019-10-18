import { ChangeEvent } from 'react';
export interface FormProps<T> {
    defaultValues?: T;
}
interface RuleTypeComplex<T> {
    value: T;
    message: string;
}
declare type RuleType<T> = RuleTypeComplex<T> | T;
interface Rule<T> {
    required?: RuleType<boolean>;
    pattern?: RuleType<RegExp>;
    validate?: RuleType<(value: T) => boolean>;
}
interface Errors {
    [key: string]: string;
}
interface Bind<T> {
    <P>(name: keyof T, rule?: Rule<P>): {
        value?: P;
        onChange: (value?: P | ChangeEvent<HTMLInputElement>) => void;
    };
}
export interface UseForm<T> {
    bind: Bind<T>;
    reset: (values: T) => void;
    values: T;
    triggerValidation: (keys?: [keyof T]) => boolean;
    dirty: boolean;
    errors: Errors;
    setErrors: (errors: Errors) => void;
    getValues: () => T;
}
declare function useForm<T extends {
    [key: string]: any;
}>(options: FormProps<T>): UseForm<T>;
export default useForm;
