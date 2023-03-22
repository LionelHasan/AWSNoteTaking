

import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import uuid from "react-uuid";
import Sidebar from "./Sidebar";
import { googleLogout, useGoogleLogin, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';


function Layout() {
  const navigate = useNavigate();
  const { noteID } = useParams();
  const [userLogged, setUserLogged] = useState(false);
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState([]);


  const [notes, setNotes] = useState(() => {
    const yesNote = localStorage.getItem('notes');
    if (yesNote) {
      const allNotes = JSON.parse(localStorage.notes)
      return allNotes;
    }

    return [];
  });

  const [currNote, setCurrNote] = useState(false);
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

  const onDeleteNote = async (idToDel) => {
    const answer = window.confirm("Are you sure?");
    if (answer) {
      setNotes(notes.filter((note) => note.id !== idToDel));
      const answer = window.confirm("Are you sure?");
    if (answer) {
      setNotes(notes.filter((note) => note.id !== idToDel));
      const newNote = getCurrNote();
      console.log(JSON.stringify({ ...newNote, email: profile.email }))
      console.log(newNote);

      const res = await fetch("https://vtsjzzb5g7o7myq3gpr4axc6bq0amqtj.lambda-url.ca-central-1.on.aws/",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...newNote, email: profile.email })
  
        }
      );
      const jsonRes = await res.json();
      console.log(JSON.stringify(jsonRes));

      
    }
  }
}

  const onUpdateNote = (updatedNote) => {
    const updatedNotesArr = notes.map((note) => {
      if (note.id === notes[currNote].id) {
        return updatedNote;
      }
      return note;
    });
    setNotes(updatedNotesArr);
  };

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));


  }, [notes]);

  const onHideSideBar = () => {
    const element = document.getElementById("left-side");
    const className = element.className;
    if (className == "hidden") {
      element.className = "visible";
    }
    else {
      element.className = "hidden";
    }
  }

  useEffect(() => {
    if (noteID != null) {
      setCurrNote(noteID - 1)
    }
  }, [noteID]);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => { setUser(codeResponse); setUserLogged(true); },
    onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(
    () => {
      if (user.length != 0) {
        axios
          .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: 'application/json'
            }
          })
          .then((res) => {
            setProfile(res.data);
          })
          .catch((err) => console.log(err));
      }
    },
    [user]
  );

  const logOut = () => {
    googleLogout();
    setProfile(null);
    setUserLogged(false);
  };

 

  return (
    <>
      <div id="main-container">
        <nav>
          <button id="notes-vision" onClick={() => onHideSideBar()}>&#9776;</button>
          <div className="nav-header">
            <h1>Lotion</h1>
            <h6>Like Notion, but worse</h6>
          </div>
          <div id="profile-container">
            {profile != null && <button id="logOutButton" onClick={logOut}>{profile.name} (Log Out)</button>}
          </div>
        </nav>

        <div id="googleLogin" className={(userLogged) ? "hideGoogle" : ""}>
          <button onClick={() => login()} className={(userLogged) ? "hideGoogle" : ""}>Sign in to Lotion with <i className="fab fa-google"></i> </button>
        </div>

        <div id="note-container" className={(userLogged) ? "" : "hideGoogle"}>
          <section id="left-side">
            <Sidebar notes={notes} onNewNote={onNewNote} currNote={currNote} setCurrNote={setCurrNote} noteID={noteID} />
          </section>
          <section id="right-side">
            <Outlet context={[getCurrNote, onDeleteNote, onUpdateNote, notes,profile, noteID]} />
          </section>
        </div>
      </div>
    </>
  )
}

export default Layout;
