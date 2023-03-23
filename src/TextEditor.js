

import ReactQuill from 'react-quill';
import { useOutletContext } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";

function TextEditor( ) {
    const [getCurrNote , onDeleteNote, onUpdateNote, notes,profile, noteID,user] = useOutletContext();
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
        console.log(JSON.stringify({ ...newNote, email: profile.email}))
        console.log(newNote);
        const res = await fetch("https://6e5qripldydrxqklas6c3e5xxu0bnqst.lambda-url.ca-central-1.on.aws/", //CHANGE TO YOUR LAMBDA-URL
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            }, 
            body: JSON.stringify({ ...newNote, email: profile.email })
    
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