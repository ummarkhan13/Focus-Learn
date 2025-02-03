import React, { useEffect } from "react";
import { useState } from "react";
// import {
//   Dialog,
//   DialogBackdrop,
//   DialogPanel,
//   DialogTitle,
// } from "@headlessui/react";
// import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { textss } from "../../Constants";
import { createNote, getNotesByChapter, updateNote } from "../../Api/notes";

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ color: [] }, { background: [] }], // Add color and background color options
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "color",
  "background", // Add color and background to formats
  "align",
];

const AddNotes = ({journeyId,chapterId}) => {

    const [value, setValue] = useState("");
    const [noteId, setNoteId] = useState("");
    const [submitMode, setSubmit] = useState(true);

    const handleSubmit = async() => {
      try {
        const response = await createNote(journeyId,chapterId,value)
        console.log('notes added '+response);
        fetchNotes()
        alert('Notes added successfully')
      } catch (error) {
        console.log(error);
      }
    };

    const handleUpdate = async()=>{
      try {
        const response = await updateNote(noteId,value)
        fetchNotes()
        console.log(response);
        alert('notes updated successfully')
      } catch (error) {
        console.log(error);
      }
    }

    const fetchNotes = async()=>{
      try {
        const response = await getNotesByChapter(chapterId);
        if(response){

          setValue(response[0].content)
          setSubmit(false)
          setNoteId(response[0].id)
        }
        console.log("response: "+response);
      } catch (error) {
        console.log(error);
      }
    }

    useEffect(()=>{
      console.log("chapterid:", chapterId);
      fetchNotes();
      console.log('fetching notes--------');
    },[])

    return (
      <section class="bg-white block dark:bg-gray-900">
        <div class="py-8 px-4 mx-auto max-w-4xl lg:py-16">
          <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            ADD Notes
          </h2>
          <form onSubmit={(e)=>{
            e.preventDefault();
            if (submitMode) {
              handleSubmit()
            } else {
              handleUpdate()
            }
          }}
           className="text-white ">
            <ReactQuill
              value={value}
              onChange={setValue}
              modules={modules}
              formats={formats}
            />

            <button
              type="submit"
              class="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
            >
              Add Notes
            </button>
          </form>
        </div>
      </section>
    );
  };

export default AddNotes;
