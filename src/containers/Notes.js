import React, { useRef, useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { API, Storage } from 'aws-amplify';

import { s3Upload, s3Delete } from '../libs/awsLib';
import { onError } from '../libs/errorLib';
import config from '../config';
import Form from 'react-bootstrap/Form';
import LoaderButton from '../components/LoaderButton';
import './Notes.css';

const Notes = () => {
  const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadNote = () => API.get('notes', `/notes/${id}`);

    const onLoad = async () => {
      try {
        const note = await loadNote();
        const { content, attachment } = note;
        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment);
        }
        setContent(content);
        setNote(note);
      } catch (e) {
        onError(e);
      }
    };

    onLoad();
  }, [id]);

  const validateForm = () => content.length > 0;

  const formatFilename = (str) => str.replace(/^\w+-/, '');

  const handleFileChange = (event) => {
    file.current = event.target.files[0];
  };

  const saveNote = (note) => API.put('notes', `/notes/${id}`, { body: note });

  const handleSubmit = async (event) => {
    let attachment;
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
      if (file.current) {
        attachment = await s3Upload(file.current);
      }

      await saveNote({ content, attachment: attachment || note.attachment });

      history.push('/');
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  };

  const deleteNote = () => API.del('notes', `/notes/${id}`);

  const handleDelete = async (event) => {
    event.preventDefault();

    const confirmed = window.confirm(
      'Are you sure you want to delete this note?'
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      await s3Delete(note.attachment);
      await deleteNote();
      history.push('/');
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  };

  return (
    <div className="Notes">
      {note && (
        <form onSubmit={handleSubmit}>
          <Form.Group controlId="content">
            <Form.Control
              value={content}
              as="textarea"
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
          {note.attachment && (
            <Form.Group>
              <Form.Label>Attachment</Form.Label>

              <div>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={note.attachmentURL}
                >
                  {formatFilename(note.attachment)}
                </a>
              </div>
            </Form.Group>
          )}
          <Form.Group controlId="file">
            {!note.attachment && <Form.Label>Attachment</Form.Label>}
            <Form.Control onChange={handleFileChange} type="file" />
          </Form.Group>
          <LoaderButton
            block
            type="submit"
            size="lg"
            variant="primary"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            size="lg"
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </form>
      )}
    </div>
  );
};

export default Notes;
