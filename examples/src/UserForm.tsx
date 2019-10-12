import * as React from 'react';
import { useForm } from '../../src';
import { User } from './types';

const defaultValues = {
  id: '123',
  firstName: 'Mark',
  lastName: 'Liu',
  age: 33,
  phone: '123',
};

function UserForm() {
  const {
    bind, values, dirty, reset, errors, triggerValidation,
  } = useForm<User>({
    defaultValues,
  });

  console.log(JSON.stringify(values), dirty);

  return (
    <form>
      <div>
        <label htmlFor="firstName">
          name
          <input
            {...bind('firstName')}
          />
        </label>
      </div>
      <div>
        <label htmlFor="lastName">
          name
          <input
            {...bind('lastName', { required: { value: true, message: 'need last name' } })}
          />
        </label>
      </div>
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
    </form>
  );
}

export default UserForm;
