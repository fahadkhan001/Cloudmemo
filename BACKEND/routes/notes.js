const express = require('express');
const router = express.Router()
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator')
//Route 1: get all the notes using: GET "/api/notes".login required 
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    //finding all the notes
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Internal server occured")
    }
})

//Route 2 : Add a new Notes using: POST  "/api/addnotes".login required
router.post("/addnote", fetchuser, [
    body('title', 'Enter a valid tittle').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            //i can run a .save()which will return a promise 
            title, description, tag, user: req.user.id
        })
        const savenote = await note.save()
        res.json(savenote)
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Internal server occured")
    }
})

//Route 3 : updates Note using: PUT "/api/updatenote".login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
    try {
        //for updation we need to use put 
        //destructuring to get all the element
        const { title, description, tag } = req.body;
        //create a new note object
        const newnote = {};
        if (title) { newnote.title = title };
        if (description) { newnote.description = description };
        if (tag) { newnote.tag = tag };

        //find note and update it
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not found")
        }
        //checking if this notes user is this notes creator or not
        //to string will return us a id string
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }
        //noew now the noter is weith the user
        // findbyidupdate Creates a findOneAndUpdate query, filtering by the given _id.
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newnote }, { new: true }) //creating a object neew to true if new contact comes it ll be created
        res.json(note)
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Internal server occured")
    }
})


//Route 4 : delete a existing Note using: DELETE "/api/updatenote".login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
    //find note and delete it
    try {
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not found")
        }
        //allow deletion only if user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }
        //Creates a findByIdAndDelete query, filtering by the given _id.
        note = await Note.findByIdAndDelete(req.params.id) //creating a object neew to true if new contact comes it ll be created
        res.json({ "Success": "Note has been deleted", note: note })
    } catch (error) {
        console.error(error.message);
        res.status(400).send("Internal server occured")
    }
})
module.exports = router