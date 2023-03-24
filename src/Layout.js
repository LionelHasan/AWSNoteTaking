

import { useEffect, useState } from "react";
import { json, Outlet, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import uuid from "react-uuid";
import Sidebar from "./Sidebar";
import { googleLogout, useGoogleLogin, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';


function Layout() {
  const navigate = useNavigate();
  const { noteID } = useParams();
  const [userLogged, setUserLogged] = useState(false);

  // const [profile, setProfile] = useState(null)

  const [profile, setProfile] = useState(() => {
    console.log("fafaa")
    const yesNote = localStorage.getItem('email');
    console.log(yesNote, "fafa")
    if(yesNote){
      const allNotes = JSON.parse(localStorage.email)
      return allNotes;
    }
    return null;
    // return [];
  });
  // console.log(profile)

  const [user, setUser] = useState([]);
  console.log(user, "USER")

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => { setUser(codeResponse); setUserLogged(true); setProfile(); },
    // onSuccess: (codeResponse) => { setUser(codeResponse); setUserLogged(true); },
    onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(
    () => {
      console.log(user, "JFiajf")
      if (user.length != 0) {
        axios
          .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, { 
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: 'application/json'
            }
          })
          .then((res) => {
            localStorage.setItem('email', JSON.stringify(res.data)) //saves email to storage
            console.log(res.data, 'ifajfja')
            setProfile(res.data)
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
    setNotes([]);
    localStorage.clear() //removes email when logout
  };

  const [notes, setNotes] = useState([]);

  useEffect(() => { 
    console.log("nfao")
    console.log(profile)
     if(profile) { //if user not null, get notes
    const asyncEffect = async() => {
    // let promise = await fetch(`https://drkawvbhcf4g7aepkc6lju2yoq0fjzfj.lambda-url.ca-central-1.on.aws//?email=${profile.email}`, //CHANGE TO YOUR GET-URL
    let promise = await fetch(`https://yxjnz7looh3r3fuxvn2u4bfvsu0idmtz.lambda-url.ca-central-1.on.aws//?email=${profile.email}`, //CHANGE TO YOUR GET-URL
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access_token": user.access_token,
      }, 
    }
  );
    if (promise.status == 200) {
      let jsonRes = await promise.json();
      console.log(JSON.stringify(jsonRes));
      console.log("response")
      // setNotes(prevNotes => [...prevNotes, ...jsonRes])
      setNotes(jsonRes)
      }
    }
    asyncEffect();
    } }, [profile])

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
    if (answer) {
      setNotes(notes.filter((note) => note.id !== idToDel));
      const newNote = getCurrNote();
      console.log(JSON.stringify({ ...newNote, email: profile.email }))
      // const res = await fetch(`https://vtsjzzb5g7o7myq3gpr4axc6bq0amqtj.lambda-url.ca-central-1.on.aws/?email=${profile.email}&id=${newNote.id}`, //CHANGE TO YOUR DELETE-URL LAMBDA FNC 
      const res = await fetch(`https://rwpszsvvclus6p5cbemavgwrje0ghvxq.lambda-url.ca-central-1.on.aws/?email=${profile.email}&id=${newNote.id}`, //CHANGE TO YOUR DELETE-URL LAMBDA FNC 
        {

          version:"2.0",
          method: "DELETE",
          rawPath: "/my/path",
          rawQueryString: "parameter1=value1&parameter1=value2&parameter2=value",
          headers: {
            "Content-Type": "application/json",
              "access_token": user.access_token,
              "email": profile.email,
              "id": newNote.id
          },
          queryStringParameters: {
            "id": newNote.id,
            "email": profile.email
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

  // useEffect(() => {
  //   setProfile(localStorage.getItem('email'))
  // });


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
            {profile != null &&<button id="logOutButton" onClick={logOut}>{profile.name} (Log Out)</button>}
          </div>
        </nav>

        <div id="googleLogin" className={(profile != null) ? "hideGoogle" : ""}>
          <button onClick={() => login()} className={(userLogged) ? "hideGoogle" : ""}>Sign in to Lotion with <i className="fab fa-google"></i> </button>
        </div>

        <div id="note-container" className={(profile != null) ? "" : "hideGoogle"} >
          <section id="left-side">
            <Sidebar notes={notes} onNewNote={onNewNote} currNote={currNote} setCurrNote={setCurrNote} noteID={noteID} />
          </section>
          <section id="right-side">
            <Outlet context={[getCurrNote, onDeleteNote, onUpdateNote, notes,profile, noteID,user]} />
          </section>
        </div>
      </div>
    </>
  )
}

export default Layout;
