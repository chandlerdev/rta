'use client';

import { useMemo } from 'react';

export interface CalEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  meta?: any;
}

export type CalView = 'month' | 'week' | 'day';

interface Props {
  view: CalView;
  viewDate: Date;
  events: CalEvent[];
  dayStartHour?: number;
  dayEndHour?: number;
  onEventClick?: (ev: CalEvent) => void;
  onSlotClick?: (date: Date) => void;
}

const HOUR_HEIGHT = 48; // px per hour

function startOfWeek(d: Date) {
  const x = new Date(d);
  x.setDate(x.getDate() - x.getDay());
  x.setHours(0, 0, 0, 0);
  return x;
}
function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function Calendar({
  view,
  viewDate,
  events,
  dayStartHour = 7,
  dayEndHour = 20,
  onEventClick,
  onSlotClick,
}: Props) {
  const hours = useMemo(() => {
    const arr: number[] = [];
    for (let h = dayStartHour; h <= dayEndHour; h++) arr.push(h);
    return arr;
  }, [dayStartHour, dayEndHour]);

  // ---------- DAY VIEW ----------
  function renderDay(day: Date) {
    const dayEvents = events.filter((e) => sameDay(e.start, day));
    return (
      <div className="relative border-l border-gray-200" style={{ flex: 1 }}>
        {hours.map((h) => (
          <div
            key={h}
            className="relative border-b border-gray-100"
            style={{ height: HOUR_HEIGHT }}
            onClick={() => {
              if (!onSlotClick) return;
              const d = new Date(day);
              d.setHours(h, 0, 0, 0);
              onSlotClick(d);
            }}
          />
        ))}
        {dayEvents.map((e) => {
          const startMins =
            e.start.getHours() * 60 + e.start.getMinutes() - dayStartHour * 60;
          const endMins =
            e.end.getHours() * 60 + e.end.getMinutes() - dayStartHour * 60;
          const top = (startMins / 60) * HOUR_HEIGHT;
          // minimum visible block height (matches the original minimumEventHeight)
          const height = Math.max(
            40,
            ((Math.max(endMins, startMins + 15) - startMins) / 60) *
              HOUR_HEIGHT,
          );
          return (
            <button
              key={e.id}
              onClick={(ev) => {
                ev.stopPropagation();
                onEventClick?.(e);
              }}
              className="absolute left-1 right-1 overflow-hidden rounded bg-blue-600 px-2 py-1 text-left text-xs text-white shadow hover:bg-blue-700"
              style={{ top, height }}
            >
              <div className="font-semibold">{e.title}</div>
              {e.meta?.ftime_format && (
                <div className="opacity-90">
                  {e.meta.ftime_format}
                  {e.meta.to_format ? ` - ${e.meta.to_format}` : ''}
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (view === 'day') {
    return (
      <div className="overflow-auto rounded-lg border bg-white">
        <div className="flex min-w-[320px]">
          {/* hour gutter */}
          <div className="w-12 shrink-0 sm:w-16">
            <div className="h-8 border-b" />
            {hours.map((h) => (
              <div
                key={h}
                className="border-b border-gray-100 pr-1 text-right text-[10px] text-gray-500 sm:pr-2 sm:text-xs"
                style={{ height: HOUR_HEIGHT }}
              >
                {h % 12 === 0 ? 12 : h % 12}
                {h < 12 ? ' AM' : ' PM'}
              </div>
            ))}
          </div>
          <div className="flex-1">
            <div className="flex h-8 items-center justify-center border-b bg-gray-50 text-sm font-semibold">
              {viewDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </div>
            {renderDay(viewDate)}
          </div>
        </div>
      </div>
    );
  }

  // ---------- WEEK VIEW ----------
  if (view === 'week') {
    const weekStart = startOfWeek(viewDate);
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
    return (
      <div className="overflow-auto rounded-lg border bg-white">
        <div className="flex min-w-[640px]">
          <div className="w-12 shrink-0 sm:w-16">
            <div className="h-8 border-b" />
            {hours.map((h) => (
              <div
                key={h}
                className="border-b border-gray-100 pr-1 text-right text-[10px] text-gray-500 sm:pr-2 sm:text-xs"
                style={{ height: HOUR_HEIGHT }}
              >
                {h % 12 === 0 ? 12 : h % 12}
                {h < 12 ? ' AM' : ' PM'}
              </div>
            ))}
          </div>
          {days.map((day, idx) => (
            <div key={idx} className="flex flex-1 flex-col">
              <div
                className={`flex h-8 items-center justify-center border-b text-xs font-semibold ${
                  sameDay(day, new Date()) ? 'bg-blue-50' : 'bg-gray-50'
                }`}
              >
                {day.toLocaleDateString('en-US', {
                  weekday: 'short',
                  day: 'numeric',
                })}
              </div>
              {renderDay(day)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ---------- MONTH VIEW ----------
  const monthStart = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const gridStart = startOfWeek(monthStart);
  const weeks: Date[][] = [];
  let cursor = new Date(gridStart);
  for (let w = 0; w < 6; w++) {
    const row: Date[] = [];
    for (let d = 0; d < 7; d++) {
      row.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(row);
  }
  return (
    <div className="overflow-auto rounded-lg border bg-white">
      <div className="min-w-[560px]">
      <div className="grid grid-cols-7 bg-gray-50 text-center text-[10px] font-semibold text-gray-600 sm:text-xs">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="border-b py-2">
            {d}
          </div>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7">
          {week.map((day, di) => {
            const inMonth = day.getMonth() === viewDate.getMonth();
            const dayEvents = events.filter((e) => sameDay(e.start, day));
            return (
              <div
                key={di}
                className={`min-h-[90px] border-b border-r p-1 text-xs ${
                  inMonth ? '' : 'bg-gray-50 text-gray-400'
                }`}
                onClick={() => onSlotClick?.(day)}
              >
                <div
                  className={`mb-1 text-right ${
                    sameDay(day, new Date())
                      ? 'font-bold text-blue-600'
                      : ''
                  }`}
                >
                  {day.getDate()}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((e) => (
                    <button
                      key={e.id}
                      onClick={(ev) => {
                        ev.stopPropagation();
                        onEventClick?.(e);
                      }}
                      className="block w-full truncate rounded bg-blue-600 px-1 text-left text-white"
                    >
                      {e.meta?.ftime_format ? `${e.meta.ftime_format} ` : ''}
                      {e.title}
                    </button>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-[10px] text-gray-500">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
      </div>
    </div>
  );
}
