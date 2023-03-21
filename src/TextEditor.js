

import ReactQuill from 'react-quill';
import { useOutletContext } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";

function TextEditor( ) {
    const [getCurrNote , onDeleteNote, onUpdateNote, notes,user, noteID] = useOutletContext();
    const currNote = getCurrNote();
    const navigate = useNavigate();

    const handleChange = (value) => {
        onUpdateNote({
          ...currNote,
          body: value,
        });
    }; 

    const onSaveChange = (key, value) => {
        onUpdateNote({
            ...currNote,
            [key]: value,
        });
    };

    const onSaveNote = async () => {
        const newNote = getCurrNote();
        console.log(JSON.stringify({ ...newNote, email: user }))
        console.log(newNote);
        const res = await fetch("https://si43ha6zkkuq3pr3ja7pf4t7zu0xfpbt.lambda-url.ca-central-1.on.aws/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...newNote, email: user })
    
          }
        );
        const jsonRes = await res.json();
        console.log(JSON.stringify(jsonRes));
        navigate(`/notes/${noteID}`);
      }

    if(!currNote) return <div className="no-active-note">Select a note, or create a new one</div>;

    return (
        <>
            <section id="right-side" className="other-div">
                <div id="titleName">
                    <div id='titleText'>
                        <input type="text" id="noteName" value={currNote.title} onChange={(event) => onSaveChange("title", event.target.value)} autoFocus />
                        <input type="datetime-local" id="datetime-input" value={currNote.date} onChange={(event) => onSaveChange("date", event.target.value)} />
                    </div>
                        
                    <button id="edit-save-text" onClick={() => onSaveNote()}>&emsp;Save&emsp;</button>
                    <button id="delete-text" onClick={() => onDeleteNote(currNote.id)}>&emsp;Delete&emsp;</button>
                </div>

                <div id="bodyText">
                    <ReactQuill id='body' readOnly={false} value={currNote.body} onChange={handleChange} placeholder="Write something here..." onBlur={() => onSaveChange("body", currNote.body)} />
                </div>
            </section>
        </> 
    );
};

export default TextEditor;