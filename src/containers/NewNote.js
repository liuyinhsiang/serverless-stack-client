import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { API } from 'aws-amplify';

import LoaderButton from '../components/LoaderButton';
import { onError } from '../libs/errorLib';
import { s3Upload } from '../libs/awsLib';
import config from '../config';
import './NewNote.css';

const NewNote = () => {
  const file = useRef(null);
  const history = useHistory();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => content.length > 0;

  const handleFileChange = (event) => (file.current = event.target.files[0]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }
    setIsLoading(true);

    try {
      const attachment = file.current ? await s3Upload(file.current) : null;

      await createNote({ content, attachment });
      history.push('/');
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  };

  const createNote = (note) => API.post('notes', '/notes', { body: note });

  return (
    <div className="NewNote">
      <form onSubmit={handleSubmit}>
        <Form.Group controlId="content">
          <Form.Control
            value={content}
            as="textarea"
            onChange={(e) => setContent(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="file">
          <Form.Control onChange={handleFileChange} type="file" />
        </Form.Group>
        <LoaderButton
          block
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </form>
    </div>
  );
};

export default NewNote;
