

import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import uuid from "react-uuid";
import Sidebar from "./Sidebar";

function Layout( ) {
  const navigate = useNavigate();
  const { noteID } = useParams();

  const[notes, setNotes] = useState(() => {
    const yesNote = localStorage.getItem('notes');
    if(yesNote){
      const allNotes = JSON.parse(localStorage.notes)
      return allNotes;
    }
    return [];
  });

  const[currNote, setCurrNote] = useState(false);
  const getCurrNote = () => {
    return notes[currNote]
  }

  const onNewNote = () => {
    const newNote = {
      id: uuid(),
      title: "Untilted",
      body: "",
      date: "",
    };

    setNotes([newNote, ...notes]);
    navigate(`/notes/1/edit`)
  };

  const onDeleteNote = (idToDel) => {
    const answer  = window.confirm("Are you sure?");
    if (answer) {
      setNotes(notes.filter((note) => note.id !== idToDel ));
    }
  }

  const onUpdateNote = (updatedNote) => {
    const updatedNotesArr = notes.map((note)=>{
      if(note.id === notes[currNote].id) { 
        return updatedNote;
      }
      return note;
    });
    setNotes(updatedNotesArr);
  };

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  },[notes]);

  const onHideSideBar = () => {
    const element = document.getElementById("left-side");
    const className = element.className;
    if (className == "visible") {
      element.className = "hidden";
    }
    else {
      element.className = "visible";
    }
  }

  useEffect(()=>{
    if (noteID != null){
      setCurrNote(noteID-1)
    }
  }, [noteID]);

  return (
    <>
      <div id="main-container">
          <nav>
              <button id="notes-vision" onClick={() => onHideSideBar()}>&#9776;</button>
              <div className="nav-header">
                  <h1>Lotion</h1>
                  <h6>Like Notion, but worse</h6>
              </div>
          </nav>

          <div id="note-container"> 
              <section id="left-side" className="visible">
                  <Sidebar notes={notes} onNewNote={onNewNote} currNote={currNote} setCurrNote={setCurrNote} noteID={noteID}/>
              </section>
              <section id="right-side">
                  <Outlet context={[getCurrNote, onDeleteNote, onUpdateNote, notes, noteID]}/>
              </section>
          </div>
      </div>
    </>
  )
}

export default Layout;
