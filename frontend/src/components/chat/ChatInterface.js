// src/components/chat/ChatInterface.js
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getCVById } from '../../redux/slices/cvSlice';
import {
  createSession,
  sendMessage,
  reset,
} from '../../redux/slices/chatSlice';
import ChatMessage from './ChatMessage';

function ChatInterface() {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentCV } = useSelector((state) => state.cv);
  const { currentSession, messages, isLoading } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }

    dispatch(getCVById(id));
    dispatch(createSession(id));

    return () => {
      dispatch(reset());
    };
  }, [dispatch, id, navigate, user]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageInput.trim() && currentSession) {
      dispatch(
        sendMessage({
          sessionId: currentSession.id,
          message: messageInput,
        })
      );
      setMessageInput('');
    }
  };

  if (!currentCV) {
    return <div className="flex justify-center items-center h-64">Loading CV details...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col h-[80vh]">
        <div className="bg-white shadow rounded-t-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Chatting about: {currentCV.title}
              </h1>
              <p className="text-sm text-gray-500">
                Ask questions about this CV
              </p>
            </div>
            <Link
              to={`/cvs/${currentCV.id}`}
              className="text-indigo-600 hover:text-indigo-800"
            >
              View CV Details
            </Link>
          </div>
        </div>

        <div className="flex-grow bg-gray-50 p-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-gray-500 mb-2">
                No messages yet. Start the conversation by asking a question about the CV.
              </p>
              <p className="text-gray-400 text-sm">
                For example: "What are the candidate's skills?" or "What was their last job?"
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="bg-white shadow rounded-b-lg p-4">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              disabled={isLoading}
              placeholder="Type your question here..."
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isLoading || !messageInput.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;