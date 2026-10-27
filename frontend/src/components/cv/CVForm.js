// src/components/cv/CVForm.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createCV, getCVById, updateCV, reset } from '../../redux/slices/cvSlice';

function CVForm() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const { currentCV, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.cv
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }

    if (isEditing) {
      dispatch(getCVById(id));
    }

    return () => {
      dispatch(reset());
    };
  }, [dispatch, id, isEditing, navigate, user]);

  useEffect(() => {
    if (isEditing && currentCV) {
      setTitle(currentCV.title);
    }
  }, [currentCV, isEditing]);

  useEffect(() => {
    if (isSuccess && !isLoading) {
      navigate('/cvs');
    }
  }, [isSuccess, isLoading, navigate]);

  const validateFile = (file) => {
    if (!file) return false;
    
    const allowedExtensions = ['.pdf', '.docx'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!allowedExtensions.includes(fileExt)) {
      setFileError('Only PDF and DOCX files are allowed.');
      return false;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
      setFileError('File size should not exceed 5MB.');
      return false;
    }
    
    setFileError('');
    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    
    if (isEditing) {
      if (file) {
        formData.append('file', file);
      }
      dispatch(updateCV({ id, cvData: formData }));
    } else {
      if (!file) {
        setFileError('Please select a file.');
        return;
      }
      formData.append('file', file);
      dispatch(createCV(formData));
    }
  };

  if (isLoading && isEditing) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-md mx-auto bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditing ? 'Update CV' : 'Upload New CV'}
        </h1>

        {isError && <p className="text-red-500 mb-4">{message}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              CV Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., My Professional CV"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              CV File (PDF or DOCX)
            </label>
            <input
              type="file"
              id="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none ${
                fileError ? 'border-red-500' : 'focus:ring-indigo-500 focus:border-indigo-500'
              }`}
              required={!isEditing}
            />
            {fileError && <p className="mt-1 text-sm text-red-500">{fileError}</p>}
            {isEditing && (
              <p className="mt-1 text-sm text-gray-500">
                Leave blank to keep the current file.
              </p>
            )}
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate('/cvs')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            >
              {isEditing ? 'Update CV' : 'Upload CV'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CVForm;