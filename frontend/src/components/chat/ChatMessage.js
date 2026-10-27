// src/components/chat/ChatMessage.js
import React from 'react';

function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {!isUser && message.citations?.length > 0 && (
          <div className="mt-2 border-t border-gray-300 pt-2 text-xs text-gray-600">
            <span className="font-semibold">Evidence: </span>
            {message.citations.map((citation) => citation.id).join(', ')}
          </div>
        )}
        <div
          className={`text-xs mt-1 ${
            isUser ? 'text-indigo-200' : 'text-gray-500'
          }`}
        >
          {message.created_at
            ? new Date(message.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
