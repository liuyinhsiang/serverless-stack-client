import React, { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { API } from 'aws-amplify';
import { Link } from 'react-router-dom';
import { useAppContext } from '../libs/contextLib';
import { onError } from '../libs/errorLib';
import './Home.css';
import { LinkContainer } from 'react-router-bootstrap';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const onLoad = async () => {
      if (!isAuthenticated) return;
      try {
        const notes = await loadNotes();
        setNotes(notes);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    };
    onLoad();
  }, [isAuthenticated]);

  // const loadNotes = () => API.get('notes', '/notes');
  function loadNotes() {
    return API.put('notes', '/notes');
  }

  const renderNotesList = (notes) =>
    [{}].concat(notes).map((note, i) =>
      i !== 0 ? (
        <LinkContainer key={note.noteId} to={`/notes/${note.noteId}`}>
          <ListGroup.Item>
            <h4>{note.content.trim().split('\n')[0]}</h4>
            {'Created: ' + new Date(note.createdAt).toLocaleString()}
          </ListGroup.Item>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/notes/new">
          <ListGroup.Item>
            <h4>
              <b>{'\uFF0B'}</b> Create a new note
            </h4>
          </ListGroup.Item>
        </LinkContainer>
      )
    );

  const renderLander = () => (
    <div className="lander">
      <h1>Scratch</h1>
      <p>A simple note taking app</p>
      <div>
        <Link to="/login" className="btn btn-info btn-lg">
          Login
        </Link>
        <Link to="/signup" className="btn btn-success btn-lg">
          Signup
        </Link>
      </div>
    </div>
  );

  const renderNotes = () => (
    <div className="notes">
      <h1
        className="pb-2 mt-4 mb-2 border-bottom"
        style={{ textAlign: 'start' }}
      >
        Your Notes
      </h1>
      <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
    </div>
  );

  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
};

export default Home;
