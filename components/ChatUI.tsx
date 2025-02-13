'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';


interface ChatProps {
  userId?: string;
  email?: string;
}

export default function ChatUI({
  userId,
  email
}: ChatProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any>([]); // estado global en el que se almacenarán los mensajes
  const [subscribed, setSubscribed] = useState(false);
  const supabase = createClient();
  const channel = supabase.channel('general', {
    config:{
      broadcast: { self: true }
    }
  });

  useEffect(() => {
    channel.subscribe((status) => {
      console.log(status);
      if(status === 'SUBSCRIBED'){
        setSubscribed(true);
      }
    });

    channel.on('broadcast',{
      event: 'message'
    }, ({payload}) => { setMessages((prevState: any) => [...prevState, payload]) })

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const onHandleSubmit = (e: any) => {
    e.preventDefault();
    //si ya está subscrito, ya puede enviar mensajes
    if (subscribed) {
      channel.send({
        type: 'broadcast',
        event: 'message',
        payload:{
          message,
          user: userId,
          email,
        }
      });

      setMessage('');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex-1">
        <ul className='flex flex-col gap-1.5' >
          {messages.map(({ email, message }: any, index: number) => (
            <li key={index}>
              <div className='flex flex-col gap-1.5 bg-neutral-800 px-4 py-2'>
                <span className='font-bold' >{email}:</span>
                <p>{message}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <form className='flex gap-1 items-center' onSubmit={onHandleSubmit}>
        <input
        className='px-5 py-1.5 w-full bg-transparent placeholder:text-green-400 text-green-700 text-sm border border-green-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-green-500 hover:border-green-300 shadow-sm focus:shadow'
          value={message}
          onChange={(e) => setMessage(e.target.value)}  
          type="text" 
          placeholder="Type here..."
        />
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded' >Send</button>
      </form>
    </div>
  );
}
