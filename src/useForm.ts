import * as _ from 'lodash';
import { ChangeEvent, useCallback, useState } from 'react';
import { ValuesType } from 'utility-types';

interface Options<T> {
  defaultValues?: T;
}

interface RuleTypeComplex<T> {
  value: T;
  message: string;
}

type RuleType<T> = RuleTypeComplex<T> | T;

interface Rule<T> {
  required?: RuleType<boolean>;
  pattern?: RuleType<RegExp>;
  validate?: RuleType<(value: ValuesType<T>) => boolean>;
}

interface Rules<T> {
  [key: string]: Rule<T>
}

interface Errors {
  [key: string]: string;
}

interface Bind<T, P extends ValuesType<T> = ValuesType<T>> {
  (name: keyof T, rule?: Rule<T>): {
    value?: P;
    onChange: (value: P | ChangeEvent<HTMLInputElement>) => void;
  }
}

interface UseForm<T> {
  bind: Bind<T>;
  reset: (values: T) => void;
  values: T;
  triggerValidation: (keys?: [keyof T]) => boolean;
  dirty: boolean;
  errors: Errors;
  setErrors: (errors: Errors) => void;
}

const defaultErrorMessage: { [key: string]: string } = {
  required: '必填项需填写',
  pattern: '格式不匹配',
  validate: '验证未通过',
};

function formatRuleType<T>(ruleType: RuleType<T>, name: string): RuleTypeComplex<T> {
  if (typeof ruleType === 'object') {
    return ruleType as RuleTypeComplex<T>;
  }

  return {
    value: ruleType as T,
    message: defaultErrorMessage[name],
  };
}

function validate<T>(value: ValuesType<T>, rule: Rule<T>): string | null {
  if (rule.required) {
    const { value: ruleValue, message } = formatRuleType(rule.required, 'required');
    if (ruleValue && _.isEmpty(value)) {
      return message;
    }
  }

  if (rule.pattern) {
    const { value: ruleValue, message } = formatRuleType(rule.pattern, 'pattern');
    if (!ruleValue.test(`${value}`)) {
      return message;
    }
  }

  if (rule.validate) {
    const { value: ruleValue, message } = formatRuleType(rule.validate, 'validate');
    if (!ruleValue(value)) {
      return message;
    }
  }

  return null;
}

function useForm<T extends { [key: string]: any }>(options: Options<T>): UseForm<T> {
  const [defaultValues, setDefaultValues] = useState<T>(options.defaultValues || {} as T);
  const [values, setValues] = useState<T>(defaultValues);
  const [errors, setErrors] = useState<Errors>({});
  const [dirty, setDirty] = useState<boolean>(false);

  const rules: Rules<T> = {};

  const bind = useCallback<Bind<T>>((name, rule) => {
    if (rule) {
      rules[`${name}`] = rule;
    }

    return {
      value: values && values[name],
      onChange: valueOrEvent => {
        const value = 'target' in valueOrEvent ? valueOrEvent.target.value : valueOrEvent;
        const valuesNew = {
          ...values,
          [name]: value,
        };

        if (name in errors) {
          setErrors(_.omit(errors, [`${name}`]));
        }

        setValues(valuesNew);
        setDirty(!_.isEqual(valuesNew, defaultValues));
      },
    };
  }, [values, rules, errors]);

  const triggerValidation = useCallback<(keys?: [keyof T]) => boolean>(
    k => {
      const keys = k || Object.keys(values);
      const errs: Errors = {};

      keys.forEach(key => {
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
    }, [values, rules]);

  const reset = useCallback<(values: T) => void>((values1 => {
    setDefaultValues(values1);
    setValues(values1);
    setDirty(false);
  }), []);

  return {
    bind,
    reset,
    values,
    triggerValidation,
    dirty,
    errors,
    setErrors,
  };
}

export default useForm;
