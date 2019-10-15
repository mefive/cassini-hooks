import * as React from 'react';
import useFormContext from '../../../src/useFormContext';
import { User } from '../types';

function UserForm() {
  const context = useFormContext<User>();
  const { bind } = context;

  return (
    <form>
      <div>
        <label htmlFor="firstName">
          name
          <input
            {...bind('firstName', { pattern: { value: /^1/, message: 'should start with 1' } })}
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
    </form>
  );
}

export default UserForm;
