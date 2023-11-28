import React from 'react';
import Conversation from '@/components/Conversation';

export default function FAQ() {
	const without_verifyforme_messages = [
		{
			sender: 'Scammer 👹',
			text: "Hello, I'm calling from your bank. We've noticed suspicious activity on your account.",
			isUser: false,
		},
		{ sender: 'You', text: 'Oh no, what kind of activity?', isUser: true },
		{
			sender: 'Scammer 👹',
			text: 'We need to verify your identity to give you the details. Can you confirm your account number and password?',
			isUser: false,
		},
		{
			sender: 'You',
			text: ' ... ah 😰',
			isUser: true,
		},
	];
	const with_verifyforme_messages = [
		{
			sender: 'Scammer 👿',
			text: "Hello, I'm calling from your bank. We've noticed suspicious activity on your account.",
			isUser: false,
		},
		{
			sender: 'You',
			text: 'Oh no, that sounds concerning. However, I cannot verify your identity over the phone. I will call my bank directly using the official number on their website.',
			isUser: true,
		},
		{
			sender: 'Scammer 👿',
			text: 'No need, we can handle it now. Can you confirm your account number and password?',
			isUser: false,
		},
		{
			sender: 'You',
			text: 'Can you send an email from your business email to please@verifyfor.me with 319510 in the subject - that will just tell me if you have an account in that business? Thank you.',
			isUser: true,
		},
		{
			sender: 'Scammer 👻',
			text: '💨',
			isUser: false,
		},
	];
	return (
		<div className="space-y-6">
			<h2 className="text-3xl font-bold text-gray-900 text-center">Scammer call with verifyfor.me</h2>

			<div className="border-t-2 border-b-2 border-blue-200 py-4">
				<Conversation messages={with_verifyforme_messages} />
			</div>

			<h2 className="text-3xl font-bold text-gray-900 text-center">Scammer call WITHOUT verifyfor.me</h2>

			<div className="border-t-2 border-b-2 border-blue-200 py-4">
				<Conversation messages={without_verifyforme_messages} />
			</div>

			<h2 className="text-3xl font-bold text-gray-900 text-center">
				If you are a customer service operator all you need to do is send an email to verifyfor.me
			</h2>

			<div className="max-w-lg mx-auto rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4 p-6">
				<form>
					<div className="mb-4 flex items-center justify-between">
						<label className="text-gray-700 text-sm font-bold" htmlFor="to">
							To:
						</label>
						<input
							className="shadow appearance-none border rounded w-3/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="to"
							type="text"
							placeholder="please@verifyfor.me"
						></input>
					</div>
					<div className="mb-4 flex items-center justify-between">
						<label className="text-gray-700 text-sm font-bold" htmlFor="subject">
							Subject:
						</label>
						<input
							className="shadow appearance-none border rounded w-3/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="subject"
							type="text"
							placeholder="319510"
						></input>
					</div>
					<div className="flex items-center justify-center">
						<button
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							type="submit"
						>
							Send
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
