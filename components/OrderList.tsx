'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

interface OrderListProps {
  orders: Array<any>;
}

export default function OrderList({
  orders = []
}: OrderListProps) {
  const supabase = createClient();
  const [internalOrders, setInternalOrders] = useState(orders);

  useEffect(() => {
    const subscriber = supabase.channel('order')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
      }, (payload: any) => {
        setInternalOrders((prevOrders) => [...prevOrders, payload.new]);
      })
      .subscribe();

    // Actividad: Implementar la lógica para aplicar los cambios en el arreglo de orders
    // con los datos provenientes de la base de datos (hint: Update).

    return () => {
      subscriber.unsubscribe();
    }
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Subtotal</th>
          <th>Discount</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {internalOrders?.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.subtotal}</td>
            <td>{order.discount}</td>
            <td>{order.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}