import React, { FC } from 'react';

type MessageProps = {
	sender: string;
	text: string;
	isUser: boolean;
};

const Message: FC<MessageProps> = ({ sender, text, isUser }) => (
	<div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
		<div className={`p-2 my-1 mx-3 rounded-lg w-4/5 ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
			{!isUser && <strong>{sender}</strong>}
			<p>{text}</p>
		</div>
	</div>
);

type ConversationProps = {
	messages: MessageProps[];
};

const Conversation: FC<ConversationProps> = ({ messages }) => (
	<div className="flex justify-center items-start pt-10 bg-gray-200 min-h-screen">
		<div className="p-3 rounded-lg shadow-lg bg-white h-4/5 w-80 overflow-auto">
			{messages.map((message, index) => (
				<Message key={index} sender={message.sender} text={message.text} isUser={message.isUser} />
			))}
		</div>
	</div>
);

export default Conversation;
