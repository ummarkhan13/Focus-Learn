import React from 'react'
import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import YouTubeApp from './YoutubeApp.jsx'

const VideoPlayer = ({openV,setOpenV,videoId}) => {

   
   
  return (
    <Dialog open={openV} onClose={setOpenV} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-[60rem] data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
           
        <YouTubeApp videoId={videoId} />



 
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}


export default VideoPlayer
