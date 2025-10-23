import React, { useContext, useEffect, useRef, useState } from 'react'
import uniqid from 'uniqid'
import Quill from 'quill'
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddCourse = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const {backendUrl,getToken}=useContext(AppContext)
  const [courseTitle, setCourseTitle] = useState('');
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lecturedetails, setLecturedetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false,
  });

  // ✅ Handle Chapters
const handleChapter = (action, chapterId) => {
  if (action === 'add') {
    const title = prompt('Enter Chapter Name: ');
    if (title) {
      const newChapter = {
        chapterId: uniqid(),
        chapterTitle: title,
        chapterContent: [],
        collapsed: false,
        chapterOrder:
          chapters.length > 0
            ? chapters[chapters.length - 1].chapterOrder + 1
            : 1,
      };
      setChapters([...chapters, newChapter]);
    }
  } else if (action === 'remove') {
    setChapters(chapters.filter((c) => c.chapterId !== chapterId));
  } else if (action === 'toggle') {
    setChapters(
      chapters.map((c) =>
        c.chapterId === chapterId ? { ...c, collapsed: !c.collapsed } : c
      )
    );
  }
};

// ✅ Handle Lectures
const handleLecture = (action, chapterId, lectureIndex) => {
  if (action === 'add') {
    setCurrentChapterId(chapterId);
    setShowPopup(true);
  } else if (action === 'remove') {
    setChapters(
      chapters.map((c) =>
        c.chapterId === chapterId
          ? {
              ...c,
              chapterContent: c.chapterContent.filter(
                (_, i) => i !== lectureIndex
              ),
            }
          : c
      )
    );
  }
};

// ✅ Add Lecture Popup
const addLecture = () => {
    if (
  !lecturedetails.lectureTitle.trim() ||
  !lecturedetails.lectureDuration ||
  !lecturedetails.lectureUrl.trim()
) {
  alert("All fields are required!");
  return; // stop execution if any field is empty
}
  setChapters(
    chapters.map((c) => {
      if (c.chapterId === currentChapterId) {
        const newLecture = {
          ...lecturedetails,
          lectureOrder:
            c.chapterContent.length > 0
              ? c.chapterContent[c.chapterContent.length - 1].lectureOrder + 1
              : 1,
          lectureId: uniqid(),
        };
        return {
          ...c,
          chapterContent: [...c.chapterContent, newLecture],
        };
      }
      return c;
    })
  );

  setShowPopup(false);
  setLecturedetails({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false,
  });
};

// ✅ Initialize Quill
useEffect(() => {
  if (!quillRef.current && editorRef.current) {
    quillRef.current = new Quill(editorRef.current, { theme: 'snow' });
  }
}, []);

const handleSubmit = async (e) => {
  try {
    e.preventDefault()
    if(!image){
      toast.error('Thumbnail not selected')
    }
    const courseData={
      courseTitle,
      courseDescription:quillRef.current.root.innerHTML,
      coursePrice:Number(coursePrice),
      discount:Number(discount),
      courseContent:chapters,
    }
    const formData=new FormData()
    formData.append('courseData',JSON.stringify(courseData))
    formData.append('image',image)
    const token=await getToken();
    const {data}=await axios.post(backendUrl+'/api/educator/add-course',formData,
      {headers:{Authorization:`Bearer ${token}`}})

      if(data.success){
        toast.success(data.message)
        setCourseTitle('');
        setCoursePrice(0)
        setDiscount(0)
        setImage(null)
        setChapters([])
        quillRef.current.root.innerHTML=""
      }else{
        toast.error(data.message);
      }
  } catch (error) {
    toast.error(error.message)
  }
};

return (
  <div className="h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-md w-full text-gray-500"
    >
      {/* Course Title */}
      <div className="flex flex-col gap-1">
        <p>Course Title</p>
        <input
          onChange={(e) => setCourseTitle(e.target.value)}
          value={courseTitle}
          type="text"
          placeholder="Type here"
          className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500"
          required
        />
      </div>

      {/* Course Description */}
      <div className="flex flex-col gap-1">
        <p>Course Description</p>
        <div ref={editorRef}></div>
      </div>

      {/* Price and Thumbnail */}
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex flex-col gap-1">
          <p>Course Price</p>
          <input
            onChange={(e) => setCoursePrice(e.target.value)}
            value={coursePrice}
            type="number"
            placeholder="0"
            className="outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500"
            required
          />
        </div>

        <div className="flex flex-col items-center md:flex-row gap-3">
          <p>Course Thumbnail</p>
          <label
            htmlFor="thumbnailImage"
            className="flex items-center gap-3"
          >
            <img
              src={assets.file_upload_icon}
              alt=""
              className="p-3 bg-blue-500 rounded cursor-pointer"
            />
            <input
              type="file"
              id="thumbnailImage"
              onChange={(e) => setImage(e.target.files[0])}
              accept="image/*"
              hidden
            />
            {image && (
              <img src={URL.createObjectURL(image)} alt="" width={80} />
            )}
          </label>
        </div>
      </div>

      {/* Discount */}
      <div className="flex flex-col gap-1">
        <p>Discount %</p>
        <input
          onChange={(e) => setDiscount(e.target.value)}
          value={discount}
          type="number"
          placeholder="0"
          min={0}
          max={100}
          className="outline-none md:py-2.5 w-28 px-3 rounded border border-gray-500"
          required
        />
      </div>

      {/* Chapters and Lectures */}
      <div>
        {chapters.map((chapter, chapterIndex) => (
          <div
            key={chapter.chapterId}
            className="bg-white border rounded-lg mb-4"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center">
                <img
                  onClick={() => handleChapter('toggle', chapter.chapterId)}
                  src={assets.dropdown_icon}
                  width={14}
                  alt=""
                  className={`mr-2 cursor-pointer transition-all ${
                    chapter.collapsed && '-rotate-90'
                  }`}
                />
                <span className="font-semibold">
                  {chapterIndex + 1} {chapter.chapterTitle}
                </span>
              </div>
              <span className="text-gray-500">
                {chapter.chapterContent.length} Lectures
              </span>
              <img
                onClick={() => handleChapter('remove', chapter.chapterId)}
                src={assets.cross_icon}
                alt=""
                className="cursor-pointer"
              />
            </div>

            {!chapter.collapsed && (
              <div className="p-4">
                {chapter.chapterContent.map((lecture, lectureIndex) => (
                  <div
                    key={lecture.lectureId}
                    className="flex justify-between items-center mb-2"
                  >
                    <span>
                      {lectureIndex + 1}. {lecture.lectureTitle} -{' '}
                      {lecture.lectureDuration} mins -{' '}
                      <a
                        href={lecture.lectureUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500"
                      >
                        Link
                      </a>{' '}
                      - {lecture.isPreviewFree ? 'Free Preview' : 'Paid'}
                    </span>
                    <img
                      src={assets.cross_icon}
                      alt=""
                      onClick={() =>
                        handleLecture(
                          'remove',
                          chapter.chapterId,
                          lectureIndex
                        )
                      }
                      className="cursor-pointer"
                    />
                  </div>
                ))}

                <div
                  className="inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2"
                  onClick={() => handleLecture('add', chapter.chapterId)}
                >
                  + Add Lectures
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add Chapter */}
        <div
          className="bg-blue-100 p-2 flex items-center justify-center rounded-lg cursor-pointer"
          onClick={() => handleChapter('add')}
        >
          + Add Chapter
        </div>

        {/* Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30">
              <div className="bg-white text-gray-700 p-6 rounded-lg shadow-lg relative w-full max-w-md">
              <h2 className="font-semibold text-lg mb-4">Add Lecture</h2>
              <div>
                <p>Lecture Title</p>
                <input className='border rounded  w-full'
                  type="text"
                  value={lecturedetails.lectureTitle}
                  onChange={(e) =>
                    setLecturedetails({
                      ...lecturedetails,
                      lectureTitle: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <p>Duration (minutes)</p>
                <input className='border rounded w-full'
                  required
                  min={1}
                  type="number"
                  value={lecturedetails.lectureDuration}
                  onChange={(e) =>
                    setLecturedetails({
                      ...lecturedetails,
                      lectureDuration: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-2">
                <p>Lecture URL</p>
                <input
                  type="text"
                  
                  className="mt-1 block w-full border rounded py-1 px-2"
                  value={lecturedetails.lectureUrl}
                  onChange={(e) =>
                    setLecturedetails({
                      ...lecturedetails,
                      lectureUrl: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex gap-2 my-4">
                <p>Is Preview Free?</p>
                <input
                  type="checkbox"
                  className="mt-1 scale-125"
                  checked={lecturedetails.isPreviewFree}
                  onChange={(e) =>
                    setLecturedetails({
                      ...lecturedetails,
                      isPreviewFree: e.target.checked,
                    })
                  }
                />
              </div>

              <button
                type="button"
                className="w-full bg-blue-400 text-white px-4 py-2 rounded cursor-pointer"
                onClick={addLecture}
              >
                Add
              </button>

              <img
                onClick={() => setShowPopup(false)}
                src={assets.cross_icon}
                className="absolute top-4 right-4 w-4 cursor-pointer"
                alt=""
              />
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="bg-black text-white w-max py-2.5 px-8 rounded my-4"
      >
        ADD
      </button>
    </form>
  </div>
);
};

export default AddCourse;
