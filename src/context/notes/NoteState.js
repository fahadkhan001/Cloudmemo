import React, { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://127.0.0.1:5000"
  const notesInitial = []
  const [notes, setNotes] = useState(notesInitial)
//get all notes
const getNotes=async()=>{
  const response = await fetch(`${host}/api/notes/fetchallnotes`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "Auth-token":localStorage.getItem('token')

    },
  });
  const json = await response.json()
  console.log(json)
  setNotes(json)
}


  //add a note
  const addNote =async (title, description, tag) => {
    //to add a note we need 3 things a title,descrip,and tag
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Auth-token":localStorage.getItem('token')

      },
      body: JSON.stringify({title,description,tag}), 
    });
    const note =await response.json();
    setNotes(notes.concat(note))
  }


  //delete a note 
  //the problem we are facing over here is that the note is not getting deleted
  const deleteNote = async(id) => {
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Auth-token":localStorage.getItem('token')

      },
    });
    const json= response.json(); 
    console.log(json)

    const newNotes = notes.filter((note) => { return note._id !== id })
    setNotes(newNotes);
  }


  //edit a note
  const editNote = async (id, title, description, tag) => {
    //api call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Auth-token":localStorage.getItem('token')

      },
      body: JSON.stringify({title,description,tag}), // 
    });
    const json=await response.json(); 
  
  
  let newNotes = JSON.parse(JSON.stringify(notes))
    // Logic to edit in client
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
      setNotes(newNotes)
  }

  

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote ,getNotes}}>
      {props.children}
    </NoteContext.Provider>
  )
}


export default NoteState;