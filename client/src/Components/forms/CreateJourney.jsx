import React, { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { createJourney, createJourneyWithPlaylist, getAllJourneys } from "../../Api/journeys";
import { useNavigate } from "react-router-dom";
import { extractPlaylistId } from "../../Constants";

const CreateJourney = ({ open, setOpen }) => {
  const [title, setTitle] = useState("");
  const [playlist, setPlaylist] = useState("");
  const [description, setDescription] = useState("");
  const [is_public, setIsPublic] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const journeyData = {
      title,
      description,
      is_public,
    };
    console.log(journeyData);

    try {
      const result = await createJourney(journeyData);
      await getAllJourneys();
      console.log(result);
      setOpen(!open);
    } catch (error) {
      console.error("Error creating journey:", error);
    }
  };

  const createWithPlayist = async (e) => {
    e.preventDefault();
    const journeyData = {
      playlistId : extractPlaylistId(playlist),
      is_public,
    };
    console.log(journeyData);

    try {
      const result = await createJourneyWithPlaylist(journeyData);
      await getAllJourneys();
      console.log(result);
      setOpen(!open);
    } catch (error) {
      console.error("Error creating journey:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-10"
    >
      <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="flex gap-5 justify-center items-center relative transform overflow-hidden rounded-lg bg-transparent text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
            {/* Form to create custom journey */}
            <div className="w-full p-6 bg-gray-800 rounded-lg shadow dark:border sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
              <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create Custom Journey
              </h2>
              <form
                onSubmit={handleSubmit}
                className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
              >
                <div>
                  <label
                    htmlFor="jn"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Journey Name
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    name="jn"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Journey Name"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    name="description"
                    placeholder="Start writing..."
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="Visibility"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Visibility
                  </label>
                  <div className="flex items-center mb-4">
                    <input
                      type="radio"
                      id="private"
                      name="visibility"
                      value="private"
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      onChange={(e) => setIsPublic(false)}
                      checked={!is_public}
                      required
                    />
                    <label
                      htmlFor="private"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Private
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="public"
                      name="visibility"
                      value="public"
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      onChange={(e) => setIsPublic(true)}
                      checked={is_public}
                      required
                    />
                    <label
                      htmlFor="public"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Public
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Done
                </button>
              </form>
            </div>

            {/* Form to create with playlist */}
            <h1 className="text-2xl font-bold text-center text-white">OR</h1>

            <div className="w-full p-6 bg-white rounded-lg shadow dark:border sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
              <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create with Playlist
              </h2>
              <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" 
              onSubmit={(e)=>createWithPlayist(e)}
              >
                <div>
                  <label
                    htmlFor="playlist"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Playlist URL
                  </label>
                  <input
                    type="text"
                    value={playlist}
                    onChange={(e) => setPlaylist(e.target.value)}
                    name="playlist"
                    placeholder="Playlist URL..."
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="Visibility"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Visibility
                  </label>
                  <div className="flex items-center mb-4">
                    <input
                      type="radio"
                      id="private"
                      name="visibility"
                      value="private"
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      onChange={() => setIsPublic(false)}
                      checked={!is_public}
                      required
                    />
                    <label
                      htmlFor="private"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Private
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="public"
                      name="visibility"
                      value="public"
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      onChange={() => setIsPublic(true)}
                      checked={is_public}
                      required
                    />
                    <label
                      htmlFor="public"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Public
                    </label>
                  </div>
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
  );
};

export default CreateJourney;
