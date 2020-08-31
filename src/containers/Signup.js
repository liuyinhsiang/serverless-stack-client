import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { Auth } from 'aws-amplify';

import LoaderButton from '../components/LoaderButton';
import { useAppContext } from '../libs/contextLib';
import { useFormFields } from '../libs/hooksLib';
import { onError } from '../libs/errorLib';
import './Signup.css';

const Signup = () => {
  const [fields, handleFieldChange] = useFormFields({
    email: '',
    password: '',
    confirmPassword: '',
    confirmationCode: '',
  });
  const history = useHistory();
  const [newUser, setNewUser] = useState(null);
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () =>
    fields.email.length > 0 &&
    fields.password.length > 0 &&
    fields.password === fields.confirmPassword;

  const validateConfirmationForm = () => fields.confirmationCode.length > 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password,
      });
      setIsLoading(false);
      setNewUser(newUser);
    } catch (e) {
      onError(e);
      if (e.code === 'UsernameExistsException') {
        try {
          const tryAgain = await Auth.resendSignUp(fields.email);
          setNewUser(tryAgain);
        } catch (e) {
          onError(e);
        }
      }
      setIsLoading(false);
    }
  };

  const handleConfirmationSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);

      userHasAuthenticated(true);
      history.push('/');
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  };

  const renderConfirmationForm = () => {
    return (
      <form onSubmit={handleConfirmationSubmit}>
        <Form.Group controlId="confirmationCode">
          <Form.Label>Confirmation Code</Form.Label>
          <Form.Control
            autoFocus
            type="tel"
            onChange={handleFieldChange}
            value={fields.confirmationCode}
          />
          <Form.Text>Please check your email for the code.</Form.Text>
        </Form.Group>

        <LoaderButton
          block
          type="submit"
          isLoading={isLoading}
          disabled={!validateConfirmationForm()}
        >
          Verify
        </LoaderButton>
      </form>
    );
  };

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
        </Form.Group>
        <LoaderButton
          block
          type="submit"
          isLoading={isLoading}
          disabled={!validateForm()}
          size="lg"
        >
          Signup
        </LoaderButton>
      </form>
    );
  };

  return (
    <div className="Signup">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
};

export default Signup;
