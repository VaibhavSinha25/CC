import React, { useState } from 'react';
import MessageTypeContent from './MessageTypeContent';

const MessageContent = ({ 
  message, 
  isSelected, 
  selectedChat,
  handleReplyMessage,
  handleEditMessage,
  setShowEmojiReactionPicker,
  handleStarMessage
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className={`relative group ${isSelected ? 'bg-blue-50' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Reply header if message is a reply */}
      {message.replyTo && (
        <div className="text-sm text-gray-500 bg-gray-100 p-2 rounded-t-lg">
          Replying to {message.replyTo.sender}
          <p className="text-xs truncate">{message.replyTo.text}</p>
        </div>
      )}

      {/* Message content */}
      <div className="relative">
        {/* Group chat sender name */}
        {selectedChat?.isGroup && message.sender !== 'me' && (
          <p className="text-xs font-medium text-blue-600 mb-1">{message.sender}</p>
        )}

        {/* Edited indicator */}
        {message.edited && (
          <span className="text-xs text-gray-400 ml-1">(edited)</span>
        )}

        {/* Message content based on type */}
        <MessageTypeContent message={message} />

        {/* Message actions */}
        {showActions && (
          <div className="absolute right-0 -top-8 bg-white shadow-lg rounded-lg flex items-center space-x-1 px-1">
            <button
              onClick={() => handleReplyMessage(message)}
              className="p-1 hover:bg-gray-100 rounded"
              title="Reply"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>

            {message.sender === 'me' && (
              <button
                onClick={() => handleEditMessage(message)}
                className="p-1 hover:bg-gray-100 rounded"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}

            <button
              onClick={() => setShowEmojiReactionPicker(message.id)}
              className="p-1 hover:bg-gray-100 rounded"
              title="React"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            <button
              onClick={() => handleStarMessage(message.id)}
              className="p-1 hover:bg-gray-100 rounded"
              title="Star"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
          </div>
        )}

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {message.reactions.map((reaction, index) => (
              <span key={index} className="bg-white/50 rounded-full px-2 py-0.5 text-xs">
                {reaction}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageContent; 