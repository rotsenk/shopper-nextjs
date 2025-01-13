'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

interface ChatProps {
  userId?: string;
}

export default function ChatUI({
  userId
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
          user: userId
        }
      });

      setMessage('');
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex-1">
        <ul>
          {messages.map(({ message }: any, index: number) => (
            <li key={index} >{message}</li>
          ))}
        </ul>
      </div>
      <form onSubmit={onHandleSubmit}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}  
          type="text" 
          placeholder="message" 
        />
        <button>Send</button>
      </form>
    </div>
  );
}
