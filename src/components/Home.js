import React from 'react'
//import { useContext } from 'react'
//import NoteState from '../context/notes/NoteState'
import Notes from './Notes'
//import { AddNote } from './AddNote'



const Home=(props)=> {
  const {showAlert}=props
  return (
    <div>
      
      <Notes showAlert={showAlert}/>
      
    </div>
  )
}
export default Home;
