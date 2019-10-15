import * as React from 'react';
import { useForm } from '../../../src';
import { FormContext } from '../../../src/useFormContext';
import { User } from '../types';
import UserForm from './UserForm';

const defaultValues = {
  id: '123',
  firstName: 'Mark',
  lastName: 'Liu',
  age: 33,
  phone: '123',
};

function UserFormOuter() {
  const formProps = useForm<User>({
    defaultValues,
  });

  const {
    dirty, errors, triggerValidation, reset,
  } = formProps;

  return (
    <>
      <FormContext {...formProps}>
        <UserForm />
      </FormContext>

      <div>
        dirty:
        {`${dirty}`}
      </div>
      <div>
        errors:
        {JSON.stringify(errors)}
      </div>
      <div>
        <button type="button" onClick={() => reset(defaultValues)}>
          reset
        </button>
        <button type="button" onClick={() => triggerValidation()}>
          validate
        </button>
      </div>
    </>
  );
}

export default UserFormOuter;
