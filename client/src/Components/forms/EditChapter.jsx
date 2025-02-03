import React, { useEffect } from 'react'
import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { updateChapter } from '../../Api/chapters'

const EditChapter = ({openEdit,setOpenEdit, chapterId, chDetails}) => {
    const open  = openEdit;
    const setOpen = setOpenEdit;

    const [chapterName, setChapterName] = useState(chDetails?.title || "");
    const [chapter_no, setChapter_No] = useState(chDetails?.chapter_no || "");
    const [description, setDescription] = useState(chDetails?.description || "");
    const [videoLink, setVideoLink] = useState(chDetails?.video_link || "") ;
  
    const handleSubmit = async (e) => {

      e.preventDefault();
      console.log(chapterId);
  if(!chapterId){
    console.log('provide chapter id');
    return;
  }
      const chapterData = {
        title: chapterName,
        description,
        video_link: videoLink,
        chapter_no: chapter_no, 
      };
      console.log(chapterData);

    try {
        const response = await updateChapter(chapterId,chapterData)
        console.log(response);
           // Clear form
           setOpen(!open)
           setChapterName('');
           setDescription('');
           setVideoLink('');
    } catch (error) {
      console.log(error);
    }
  
      
    };
   
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-md data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
           
      
           <div class="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <h2 class="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create New Chapter
          </h2>
          <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={handleSubmit}>
        <div>
         
          <label htmlFor="chapterName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Chapter Name
          </label>
          <input
            type="text"
            name="chapterName"
            value={chapterName}
            onChange={(e) => setChapterName(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Chapter name"
            required
          />
        </div>
        <div>
          <label htmlFor="cno" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Chapter Number
          </label>
          <input
            type="number"
            name="cno"
            value={chapter_no}
            onChange={(e) => setChapter_No(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Chapter number"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Description
          </label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Start writing..."
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="videoLink" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            YouTube Video Link
          </label>
          <input
            type="text"
            name="videoLink"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            placeholder="https://youtube.com/..."
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
          <p className='text-sm text-white'> <span className='text-yellow-500 font-semibold'> Note:</span> To get youtube video url  <br /> {'click on 3 dots -> share -> copy url'}</p>
        </div>

        <button
          type="submit"
          className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Done
        </button>
      </form>
      </div>


 
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default EditChapter
