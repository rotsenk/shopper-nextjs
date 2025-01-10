'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

interface ChatProps {
  userId?: string;
  email?: string;
}

export default function Chat({
  userId,
  email,
}: ChatProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any>([])
  const [subscribed, setSubscribed] = useState(false);
  const supabase = createClient();

  const channel = supabase.channel('general', {
    config: {
      broadcast: { self: true }
    }
  })

  useEffect(() => {
    channel.subscribe((status) => {
      console.log(status)
      if (status === 'SUBSCRIBED') {
        setSubscribed(true);
      }
    })

    channel.on('broadcast', {
      event: 'message'
    } , ({ payload }) => { setMessages((prevState: any) => [...prevState, payload]) })

    return () => {
      channel.unsubscribe();
    }
  }, [])

  const onHandleSubmit = (e: any) => {
    e.preventDefault();
    if (subscribed) {
      channel.send({
        type: 'broadcast',
        event: 'message',
        payload: {
          message,
          user: userId,
          email,
        },
      })

      setMessage('');
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex-1">
        <ul className="flex flex-col gap-1.5">
          {messages.map(({ email, message }: any, index: number) => (
            <li key={index}>
              <div className="flex flex-col gap-0.5 bg-red-950 px-4 py-2">
                <span className="font-bold">{email}:</span>
                <p>{message}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <form className="flex gap-1 items-center" onSubmit={onHandleSubmit}>
        <input
          className="px-3 py-1.5 flex-1 outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="message"
        />
        <button>Send</button>
      </form>
    </div>
  )
}