

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useOutletContext } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


function SavedText( ) {
    const [getCurrNote , onDeleteNote, onUpdateNote, notes,profile, noteID,user] = useOutletContext();
    const currNote = getCurrNote();
    const navigate = useNavigate();

    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    };
    
    const formatDate = (when) => {
        const formatted = new Date(when).toLocaleString("en-US", options);
        if (formatted === "Invalid Date") {
            return "";
        }
        return formatted;
    };

    if(!currNote) return <div className="no-active-note">Select a note, or create a new one</div>;

    return (
        <>
            <section id="right-side" className="other-div">
                <div id="titleName">
                    <div>
                        <h1 id='noteName-read-only'>{currNote.title}</h1>
                        <h6 id='datetime-input-read-only'>{formatDate(currNote.date)}</h6>
                    </div>

                    <button id="edit-save-text" onClick={() => navigate(`/notes/${noteID}/edit`)}>&emsp;Edit&emsp;</button>
                    <button id="delete-text" onClick={() => onDeleteNote(currNote.id)}>&emsp;Delete&emsp;</button>
                </div>

                <div id="bodyText">
                    <ReactQuill id='body-read-only' readOnly={true} value={currNote.body} placeholder="Write something here..." modules={{ toolbar: false }}/>
                </div>
            </section>
        </> 
    );
};
  
export default SavedText;