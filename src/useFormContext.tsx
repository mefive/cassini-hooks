import * as React from 'react';
import { UseForm } from './useForm';

const FormGlobalContext = React.createContext<UseForm<any> | null>(null);

function useFormContext<T>(): UseForm<T> {
  return React.useContext<UseForm<T>>(FormGlobalContext as any);
}

export default useFormContext;

export function FormContext<T>(props: UseForm<T> & { children?: React.ReactElement }) {
  const { children, ...formProps } = props;

  return (
    <FormGlobalContext.Provider
      value={formProps as any}
    >
      {children}
    </FormGlobalContext.Provider>
  );
}
