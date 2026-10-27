// src/components/cv/CVDetail.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getCVById, deleteCV, reset } from '../../redux/slices/cvSlice';

function CVDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentCV, isLoading, isError, message } = useSelector((state) => state.cv);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }

    dispatch(getCVById(id));

    return () => {
      dispatch(reset());
    };
  }, [dispatch, id, navigate, user]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this CV?')) {
      dispatch(deleteCV(id));
      navigate('/cvs');
    }
  };

  if (isLoading || !currentCV) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <h3 className="text-red-800 font-medium">Error</h3>
          <p className="text-red-700 mt-1">{message || 'Failed to load CV details'}</p>
          <button
            onClick={() => navigate('/cvs')}
            className="mt-4 bg-red-100 text-red-800 px-4 py-2 rounded-md hover:bg-red-200"
          >
            Back to CV List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{currentCV.title}</h1>
            <div className="flex space-x-2">
              <Link
                to={`/chat/${currentCV.id}`}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Chat with this CV
              </Link>
              <Link
                to={`/cvs/${currentCV.id}/edit`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900 mb-2">CV File</h2>
            {currentCV.file_url ? (
              <a
                href={currentCV.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800"
              >
                View Original File
              </a>
            ) : (
              <p className="text-gray-500">No file available</p>
            )}
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Extracted Content
            </h2>
            {currentCV.is_processed ? (
              <div className="bg-gray-50 p-4 rounded-md">
                <pre className="whitespace-pre-wrap">{currentCV.content}</pre>
              </div>
            ) : (
              <div className="bg-yellow-50 p-4 rounded-md">
                <p className="text-yellow-700">
                  CV content is still being processed...
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-500">
            <div>
              <span>Uploaded: {new Date(currentCV.created_at).toLocaleString()}</span>
            </div>
            <div>
              <span>Last updated: {new Date(currentCV.updated_at).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => navigate('/cvs')}
          className="text-indigo-600 hover:text-indigo-800"
        >
          &larr; Back to CV List
        </button>
      </div>
    </div>
  );
}

export default CVDetail;