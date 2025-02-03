import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { calculateProgress, extractVideoId, journey, textss } from "../Constants";
import CreateChapter from "../Components/forms/CreateChapter";
import AddNotes from "../Components/forms/AddNotes";
import EditChapter from "../Components/forms/EditChapter";
import VideoPlayer from "../Components/VideoPlayer";
import { getJourneyById } from "../Api/journeys";
import {
  deleteChapter,
  getChaptersByJourneyId,
  updateChapterComplete,
} from "../Api/chapters";

const JourneyPage = () => {
  const [toggleDropDown, setToggleDD] = useState("hidden");
  const toggleDD = () => {
    setToggleDD(toggleDropDown === "hidden" ? " " : "hidden");
  };

  const [chapters, setChapters] = useState([]);

  const { jId } = useParams();
  const [open, setOpen] = useState(false);
  const [chapterId, setChapterId] = useState(null);
  const [chDetails, setChDetails] = useState(null);
  const [openNotes, setOpenNotes] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [jData, setJData] = useState("");
  const [progress, setProgress] = useState(0);

  

  const deleteOneChapter = async (chapterId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this chapter?"
    );

    if (isConfirmed) {
      try {
        await deleteChapter(chapterId);
        console.log("chapter deleted successfully.");
        fetchData();
      } catch (error) {
        console.error("Error deleting journey:", error);
      }
    } else {
      console.log("Deletion canceled.");
    }
  };

  const updateCheckBox = async (check, chId) => {
    const chapterData = {
      is_completed: !check, // Toggle the completion status
    };
  
    try {
      const response = await updateChapterComplete(chId, chapterData);
      console.log(response);
      await fetchData(); // Wait for the data to be fetched before calculating progress
    } catch (error) {
      console.error('Error updating chapter:', error);
    }
  };
  
  const fetchData = async () => {
    try {
      const journeys = await getJourneyById(jId);
      const chapterList = await getChaptersByJourneyId(jId);
  
      if (journeys) {
        setJData(journeys);
        console.log('Journey data:', journeys);
      }
  
      if (chapterList) {
        setChapters(chapterList);
        console.log('Chapters:', chapterList);
        getProgress(chapterList);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const getProgress = (chapterList) => {
    if(chapterList.length !== 0){

      const percent = calculateProgress(chapterList);
      console.log('Progress:', percent);
      setProgress(percent);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [open, setOpen, setOpenEdit]); // Only dependencies necessary for re-fetching
  
  

  return (
    <div>
      {/* Banner  */}
      <section class="bg-white px-4 py-3 antialiased dark:bg-gray-900 md:py-8">
        <div class="mx-auto grid max-w-screen-xl rounded-lg bg-gray-50 p-4 dark:bg-gray-800 md:p-8 lg:grid-cols-12 lg:gap-8 lg:p-16 xl:gap-16">
          <div class="lg:col-span-10 lg:mt-0">
            <div className="flex flex-col gap-3">
              <div className="font-bold text-4xl text-white">{jData.title}</div>
              <div className=" font-medium text-xl text-white">
                {jData.description}
              </div>
              <div className="font-semi text-md font-semibold text-white bg-slate-600 rounded-md w-fit p-1 ">
                {jData.is_public ? "public" : "private"}
              </div>

              <div class="my-6 w-full bg-gray-300 rounded-full h-4">
                <div class={`bg-blue-600 h-4 rounded-full `} style={{width:`${progress}%`}}></div>
                <div className="font-semi text-xl text-white my-1">
                  Progress: {progress}%
                </div>
              </div>
            </div>
          </div>

          <div class="my-5 me-auto place-content-end place-self-start place-items-center  lg:col-span-1">
            <Link
              to={`/notes/${jData.id}`}
              class="inline-flex items-center justify-center rounded-lg bg-primary-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
            >
              Notes
            </Link>
          </div>
        </div>

        <div className="my-4 mx-auto max-w-screen-xl rounded-lg text-white bg-gray-500 p-4 md:p-8 flex flex-col">
          <h1 className="text-4xl font-bold my-4">Chapters</h1>

          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                <button
                  onClick={() => setOpen(!open)}
                  type="button"
                  id="createProductModalButton"
                  data-modal-target="createProductModal"
                  data-modal-toggle="createProductModal"
                  className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                >
                  <span className="font-bold text-2xl pb-1 mx-2"> +</span> Add
                  New Chapter
                </button>
                <CreateChapter open={open} setOpen={setOpen} journeyId={jId} />
                <EditChapter
                  openEdit={openEdit}
                  setOpenEdit={setOpenEdit}
                  chapterId={chapterId}
                  chDetails={chDetails}
                />
              </div>
              {textss[0]}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-4">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Chapter Id
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Chapter Title
                    </th>
                    <th scope="col" className="px-4 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Actions
                    </th>
                    <th scope="col" className="px-4 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {chapters &&
                    chapters?.map((chapter, index) => (
                      <tr
                        key={chapter.id}
                        className="border-b dark:border-gray-700"
                      >
                        <td className="px-4 py-3 text-md font-semibold">
                          <input
                            type="checkbox"
                            checked={chapter.is_completed}
                            onClick={() => {
                              updateCheckBox(chapter.is_completed, chapter.id);
                            }}
                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                          />
                        </td>
                        <th
                          scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {index + 1}
                        </th>
                        <td className="px-4 py-3 text-md font-semibold cursor-pointer hover:underline">
                          <Link
                            to={`/player/${chapter.id}`}
                          >
                            {chapter.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            className="text-yellow-500 rounded hover:bg-slate-900 p-2 text-md font-semibold border"
                            onClick={() => console.log("Add Notes clicked")}
                          >
                            Notes
                          </button>
                        </td>

                        <td className="px-4 py-3 max-w-[12rem] truncate">
                          <button
                            className="text-green-500 rounded hover:bg-slate-900 p-2 text-md font-semibold border"
                            onClick={() => {
                              console.log(chapter.id);
                              setChDetails(chapter);
                              setChapterId(chapter.id);
                              console.log(chDetails, "/n", chapterId);
                              setOpenEdit(!openEdit);
                            }}
                          >
                            Edit
                          </button>
                        </td>
                        <td className="px-4 py-3 max-w-[12rem] truncate">
                          <button
                            className="text-red-500 rounded hover:bg-slate-900 p-2 text-md font-semibold border"
                            onClick={() => deleteOneChapter(chapter.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}

                  {/* <tr className="border-b dark:border-gray-700">
                    <td className="px-4 py-3 text-md font-semibold">
                      <input type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                    </td>
                    <th
                      scope="row"
                      className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      1
                    </th>
                    <td className="px-4 py-3 text-md font-semibold cursor-pointer hover:underline"  >
                     <Link to={'/player/1'} >Introduction</Link> 
                    </td>
                    <td className="px-4 py-3">
                      <button 
                      className="text-yellow-500 rounded hover:bg-slate-900 p-2 text-md font-semibold border"
                      onClick={()=>setOpenNotes(!openNotes)}
                      >
                        Add Notes
                      </button>
                    </td>
                    <td className="px-4 py-3 max-w-[12rem] truncate">
                      <button 
                      className="text-green-500 rounded hover:bg-slate-900 p-2 text-md font-semibold border"
                      onClick={()=>setOpenEdit(!openEdit)}
                      
                      >
                        Edit
                      </button>
                    </td>
                    <td className="px-4 py-3 max-w-[12rem] truncate">
                      <button className="text-red-500 rounded hover:bg-slate-900 p-2 text-md font-semibold border">
                        Delete
                      </button>
                    </td>
                  </tr> */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JourneyPage;
