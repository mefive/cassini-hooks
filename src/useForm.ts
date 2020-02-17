import * as _ from 'lodash';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
// eslint-disable-next-line
import { ValuesType } from 'utility-types';

export interface FormProps<T> {
  defaultValues?: T | null;
  compare?: _.IsEqualCustomizer;
}

export interface RuleTypeComplex<T> {
  value: T;
  message: string;
}

export type RuleType<T> = RuleTypeComplex<T> | T;

export interface Rule<T> {
  required?: RuleType<boolean>;
  pattern?: RuleType<RegExp>;
  validate?: RuleType<(value: T) => boolean>;
}

export interface Rules<T> {
  [key: string]: Rule<ValuesType<T>>;
}

export interface Errors {
  [key: string]: string;
}

export interface Bind<T> {
  <P>(name: keyof T, rule?: Rule<P>): {
    value?: P;
    onChange: (
      value?:
        | P
        | ChangeEvent<HTMLInputElement>
        | ChangeEvent<HTMLTextAreaElement>
        | null,
    ) => void;
  };
}

export interface UseForm<T> {
  bind: Bind<T>;
  reset: (values: T | null) => void;
  values: T;
  triggerValidation: (keys?: [keyof T]) => boolean;
  dirty: boolean;
  errors: Errors;
  setErrors: (errors: Errors) => void;
  getValues: () => T;
  setValue: (name: keyof T, value: any) => void;
  setValues: (values: T) => void;
}

const defaultErrorMessage: { [key: string]: string } = {
  required: '必填项需填写',
  pattern: '格式不匹配',
  validate: '验证未通过',
};

function formatRuleType<T>(
  ruleType: RuleType<T>,
  name: string,
): RuleTypeComplex<T> {
  if (typeof ruleType === 'object' && 'value' in ruleType) {
    return ruleType as RuleTypeComplex<T>;
  }

  return {
    value: ruleType as T,
    message: defaultErrorMessage[name],
  };
}

function validate<T>(value: T, rule: Rule<T>): string | null {
  if (rule.required) {
    const { value: ruleValue, message } = formatRuleType(
      rule.required,
      'required',
    );
    if (
      ruleValue &&
      (value == null ||
        `${value}` === '' ||
        (Array.isArray(value) && _.isEmpty(value)))
    ) {
      return message;
    }
  }

  if (rule.pattern) {
    const { value: ruleValue, message } = formatRuleType(
      rule.pattern,
      'pattern',
    );
    if (!ruleValue.test(`${value}`)) {
      return message;
    }
  }

  if (rule.validate) {
    const { value: ruleValue, message } = formatRuleType(
      rule.validate,
      'validate',
    );
    if (!ruleValue(value)) {
      return message;
    }
  }

  return null;
}

function useForm<T extends { [key: string]: any }>(
  options: FormProps<T>,
): UseForm<T> {
  const [defaultValues, setDefaultValues] = useState<T>(
    options.defaultValues || ({} as T),
  );
  const [values, setValues] = useState<T>(defaultValues);
  const [errors, setErrors] = useState<Errors>({});
  const dirty = useMemo<boolean>(
    () => !_.isEqualWith(defaultValues, values, options.compare),
    [defaultValues, values],
  );

  const rules: Rules<T> = {};

  const bind = useCallback<Bind<T>>(
    (name, rule) => {
      if (rule) {
        rules[`${name}`] = rule;
      }

      return {
        value: values && values[name],
        onChange: (valueOrEvent) => {
          if (valueOrEvent != null) {
            const value =
              typeof valueOrEvent === 'object' && 'target' in valueOrEvent
                ? valueOrEvent.target.value
                : valueOrEvent;

            const valuesNew = {
              ...values,
              [name]: value,
            };

            if (name in errors) {
              setErrors(_.omit(errors, [`${name}`]));
            }

            setValues(valuesNew);
          }
        },
      };
    },
    [values, rules, errors],
  );

  const triggerValidation = useCallback<(keys?: [keyof T]) => boolean>(
    (k) => {
      const keys = k || Object.keys(rules);
      const errs: Errors = {};

      keys.forEach((key) => {
        const rule = rules[`${key}`];

        if (rule == null) {
          return;
        }

        const value = values[key];

        const message = validate(value, rule);

        if (message) {
          errs[`${key}`] = message;
        }
      });

      setErrors(errs);

      return Object.keys(errs).length === 0;
    },
    [values, rules],
  );

  const getValues = useCallback<() => T>(() => values, [values]);

  const setValue = useCallback<(name: keyof T, value: any) => void>(
    (name, value) => {
      setValues({
        ...values,
        [name]: value,
      });
    },
    [values],
  );

  const reset = useCallback<(values: T | null) => void>((values1) => {
    const d = values1 || ({} as T);
    setDefaultValues(d);
    setValues(d);
    setErrors({});
  }, []);

  return {
    bind,
    reset,
    values,
    triggerValidation,
    dirty,
    errors,
    setErrors,
    getValues,
    setValue,
    setValues,
  };
}

export default useForm;
