

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
  const [profile, setProfile] = useState(null);

  // const [profile, setProfile] = useState(() => {
  //   if (profile) {
  //     getAllNotes();
  //   }
  //   return false;
  // });

  const [user, setUser] = useState([]);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => { setUser(codeResponse); setUserLogged(true);},
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
            // setTimeout(getAllNotes(profile), 3000);
            // getAllNotes(profile);
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
  };

  // const [notes, setNotes] = useState(() => {
  //   const yesNote = localStorage.getItem('notes');
  //   if (yesNote) {
  //     const allNotes = JSON.parse(localStorage.notes)
  //     return allNotes;
  //   }

  //   return [];
  // });
  const [notes, setNotes] = useState([]);
  // console.log(profile.email)

  // const getAllNotes = async (prfile) => {
  //   console.log(profile)
  //   try {
  //     // let res = await fetch("https://yxjnz7looh3r3fuxvn2u4bfvsu0idmtz.lambda-url.ca-central-1.on.aws/?email=ericmeiemail@gmail.com&id=4bd3221b-05c9-13c8-a7ba-5f526dc389b8", {
  //     let res = await fetch("https://yxjnz7looh3r3fuxvn2u4bfvsu0idmtz.lambda-url.ca-central-1.on.aws/?email=ericmeiemail@gmail.com", {
  //     // let res = await fetch(`https://yxjnz7looh3r3fuxvn2u4bfvsu0idmtz.lambda-url.ca-central-1.on.aws/?email='${profile.email}`, {
  //     });
  //     let jsonRes = await res.json();
  //     // console.log(JSON.stringify(jsonRes));
  //     console.log(JSON.stringify(jsonRes));
  //     setNotes(prevNotes => [...prevNotes, ...jsonRes])
  //   }
  //   catch (error) {
  //     console.log('error fetching data:', error)
  //   }
  // };
  // getAllNotes();

  // useEffect(() => { if(profile != null){
  //   const asyncEffect = async() => {
  //     let promise = await fetch(`https://yxjnz7looh3r3fuxvn2u4bfvsu0idmtz.lambda-url.ca-central-1.on.aws/?email='${profile.email}`, {});
  //     if (promise.status === 200) {
  //       let jsonRes = await promise.json();
  //       setNotes(jsonRes)
  //     }
  //   }
  //   asyncEffect();
  // }
  // }, [profile])

  useEffect(() => { if(profile) { //if user not null, get notes
    const asyncEffect = async() => {
    // let promise = await fetch(`https://yxjnz7looh3r3fuxvn2u4bfvsu0idmtz.lambda-url.ca-central-1.on.aws/?email='${profile.email}`, {});
    // let promise = await fetch('https://yxjnz7looh3r3fuxvn2u4bfvsu0idmtz.lambda-url.ca-central-1.on.aws/?email=ericmeiemail@gmail.com');
    let promise = await fetch(`https://drkawvbhcf4g7aepkc6lju2yoq0fjzfj.lambda-url.ca-central-1.on.aws//?email=${profile.email}`, //CHANGE TO YOUR LAMBDA-URL
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access_token": user.access_token,
      }, 

    }
  );
    if (promise.status == 200) {
      // const notes = await promise.json()
      // console.log(JSON.stringify(notes));
      // setNotes(prevNotes => [...prevNotes, ...notes])
      // // setNotes(notes)

      let jsonRes = await promise.json();
      console.log(JSON.stringify(jsonRes));
      setNotes(prevNotes => [...prevNotes, ...jsonRes])
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
      // const answer = window.confirm("Are you sure?"); //I DONT THINK YOU NEED THIS 1 BC IF GIVES THE WINDOW 2 TIMES
    if (answer) {
      setNotes(notes.filter((note) => note.id !== idToDel));
      const newNote = getCurrNote();
      console.log(JSON.stringify({ ...newNote, email: profile.email }))


      const res = await fetch(`https://vtsjzzb5g7o7myq3gpr4axc6bq0amqtj.lambda-url.ca-central-1.on.aws/?email=${profile.email}&id=${newNote.id}`, //CHANGE TO YOUR DELETE-URL LAMBDA FNC 
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

        <div id="googleLogin" className={(userLogged) ? "hideGoogle" : ""}>
          <button onClick={() => login()} className={(userLogged) ? "hideGoogle" : ""}>Sign in to Lotion with <i className="fab fa-google"></i> </button>
        </div>

        <div id="note-container" className={(userLogged) ? "" : "hideGoogle"} >
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
