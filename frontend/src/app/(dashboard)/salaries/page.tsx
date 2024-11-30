'use client';

import { Calendar } from 'primereact/calendar';
import { useState } from 'react';

import { UserSalariesTable } from './UserSalariesTable';

export default function Page() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="card">
      <Calendar value={date} onChange={(e) => setDate(e.value || new Date())} view="month" dateFormat="mm/yy" />
      <UserSalariesTable month={date.getMonth()} year={date.getFullYear()} />
    </div>
  );
}
