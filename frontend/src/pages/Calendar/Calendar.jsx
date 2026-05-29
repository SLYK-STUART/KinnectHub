import { useState, useMemo } from 'react';
import AppShell from '../../components/layout/AppShell/AppShell';
import styles from './calendar.module.css';
import { mockEvents, RECURRENCE_LABELS, EVENT_TYPE_COLORS } from './mockData';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-UG', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
}

function toYMD(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

function getDaysInMonth(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev  = new Date(year, month, 0).getDate();
  const cells = [];

  // Previous month overflow
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, daysInPrev - i);
    cells.push({ date: d, current: false });
  }
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ date: new Date(year, month, i), current: true });
  }
  // Next month overflow — fill to 42 cells (6 rows)
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) {
    cells.push({ date: new Date(year, month + 1, i), current: false });
  }
  return cells;
}

// ─── Add Event Modal ──────────────────────────────────────────────────────────
function AddEventModal({ defaultDate, onClose, onAdd }) {
  const [title,      setTitle]      = useState('');
  const [date,       setDate]       = useState(defaultDate || toYMD(new Date()));
  const [time,       setTime]       = useState('');
  const [type,       setType]       = useState('event');
  const [recurrence, setRecurrence] = useState('none');
  const [description,setDescription]= useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({ title, date, time: time || null, type, recurrence, description,
            color: type === 'birthday' ? '#C9A84C' : '#2D5A3D',
            id: `e${Date.now()}`,
            createdBy: 'You', createdByInitials: 'RN', createdByColor: '#2D5A3D' });
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.addEventModal} onClick={e => e.stopPropagation()}>
        <div className={styles.addEventModalHeader}>
          <p className={styles.addEventModalTitle}>Add Event</p>
          <p className={styles.addEventModalSub}>All family members will see this event</p>
        </div>

        <div className={styles.addEventModalBody}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Title</label>
            <input className={styles.formInput} placeholder="Event name..."
              value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Type</label>
            <div className={styles.typeSelector}>
              {[
                { value:'event',    label:'📌 Event'    },
                { value:'birthday', label:'🎂 Birthday' },
              ].map(opt => (
                <div key={opt.value}
                  className={`${styles.typeOption} ${type === opt.value ? styles.selected : ''}`}
                  onClick={() => setType(opt.value)}>
                  {opt.label}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Date</label>
              <input className={styles.formInput} type="date"
                value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Time (optional)</label>
              <input className={styles.formInput} type="time"
                value={time} onChange={e => setTime(e.target.value)} />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Recurrence</label>
            <select className={styles.formSelect}
              value={recurrence} onChange={e => setRecurrence(e.target.value)}>
              <option value="none">No recurrence</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Description (optional)</label>
            <textarea className={styles.formTextarea} placeholder="Add details..."
              value={description} onChange={e => setDescription(e.target.value)} />
          </div>
        </div>

        <div className={styles.addEventModalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.submitBtn} onClick={handleSubmit}
            disabled={!title.trim()}>
            Add to Calendar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Event Detail Modal ───────────────────────────────────────────────────────
function EventDetailModal({ event, onClose }) {
  const colors = EVENT_TYPE_COLORS[event.type];
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.eventDetailModal} onClick={e => e.stopPropagation()}>
        <div className={styles.eventDetailTop}>
          <div className={styles.eventDetailTopAccent} style={{ background: event.color }} />
          <span className={styles.eventDetailEmoji}>
            {event.type === 'birthday' ? '🎂' : '📌'}
          </span>
          <p className={styles.eventDetailTitle}>{event.title}</p>
          <p className={styles.eventDetailDate}>{formatDate(event.date)}</p>
        </div>

        <div className={styles.eventDetailBody}>
          {event.time && (
            <div className={styles.eventDetailRow}>
              <span className={styles.eventDetailRowIcon}>🕐</span>
              <div className={styles.eventDetailRowContent}>
                <div className={styles.eventDetailRowLabel}>Time</div>
                <div className={styles.eventDetailRowValue}>{event.time}</div>
              </div>
            </div>
          )}

          <div className={styles.eventDetailRow}>
            <span className={styles.eventDetailRowIcon}>🔖</span>
            <div className={styles.eventDetailRowContent}>
              <div className={styles.eventDetailRowLabel}>Type</div>
              <div className={styles.eventDetailRowValue} style={{ textTransform:'capitalize' }}>
                {event.type}
              </div>
            </div>
          </div>

          {event.recurrence !== 'none' && (
            <div className={styles.eventDetailRow}>
              <span className={styles.eventDetailRowIcon}>🔁</span>
              <div className={styles.eventDetailRowContent}>
                <div className={styles.eventDetailRowLabel}>Recurrence</div>
                <div className={styles.eventDetailRowValue} style={{ textTransform:'capitalize' }}>
                  {event.recurrence}
                </div>
              </div>
            </div>
          )}

          {event.description && (
            <div className={styles.eventDetailRow}>
              <span className={styles.eventDetailRowIcon}>📝</span>
              <div className={styles.eventDetailRowContent}>
                <div className={styles.eventDetailRowLabel}>Details</div>
                <div className={styles.eventDetailRowValue}>{event.description}</div>
              </div>
            </div>
          )}

          <div className={styles.eventDetailRow}>
            <span className={styles.eventDetailRowIcon}>👤</span>
            <div className={styles.eventDetailRowContent}>
              <div className={styles.eventDetailRowLabel}>Added By</div>
              <div className={styles.eventDetailRowValue}>{event.createdBy}</div>
            </div>
          </div>
        </div>

        <div className={styles.eventDetailFooter}>
          <button className={styles.detailCloseBtn} onClick={onClose}>Close</button>
          <button className={styles.detailDeleteBtn}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Calendar Page ────────────────────────────────────────────────────────────
export default function Calendar() {
  const today          = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(toYMD(today));
  const [showAdd,      setShowAdd]      = useState(false);
  const [detailEvent,  setDetailEvent]  = useState(null);
  const [events,       setEvents]       = useState(mockEvents);

  const cells = useMemo(() => getDaysInMonth(year, month), [year, month]);

  // Map events by date string
  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach(e => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return map;
  }, [events]);

  // Selected day events
  const selectedEvents = eventsByDate[selectedDate] || [];

  // Upcoming events (from today onwards, next 8)
  const upcomingEvents = useMemo(() => {
    const todayStr = toYMD(today);
    return [...events]
      .filter(e => e.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 8);
  }, [events]);

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else              setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else               setMonth(m => m + 1);
  };

  const goToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    setSelectedDate(toYMD(today));
  };

  const handleAddEvent = (newEvent) => {
    setEvents(prev => [...prev, newEvent]);
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480;

  return (
    <AppShell>
      <div className={styles.page}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>📅 Family Calendar</h1>
            <p>Shared events, birthdays and recurring reminders for the whole family</p>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.addEventBtn} onClick={() => setShowAdd(true)}>
              + Add Event
            </button>
          </div>
        </div>

        {/* Body */}
        <div className={styles.body}>

          {/* Left — Monthly grid */}
          <div className={styles.calendarCard}>

            {/* Month navigation */}
            <div className={styles.monthNav}>
              <span className={styles.monthTitle}>{MONTHS[month]} {year}</span>
              <div className={styles.monthNavBtns}>
                <button className={styles.navBtn} onClick={prevMonth}>‹</button>
                <button className={styles.todayBtn} onClick={goToday}>Today</button>
                <button className={styles.navBtn} onClick={nextMonth}>›</button>
              </div>
            </div>

            {/* Day labels */}
            <div className={styles.dayHeaders}>
              {DAYS.map(d => (
                <div key={d} className={styles.dayHeader}>{d}</div>
              ))}
            </div>

            {/* Grid */}
            <div className={styles.calGrid}>
              {cells.map((cell, idx) => {
                const ymd       = toYMD(cell.date);
                const dayEvents = eventsByDate[ymd] || [];
                const isToday   = ymd === toYMD(today);
                const isSelected= ymd === selectedDate;
                const maxShow   = 2;

                return (
                  <div
                    key={idx}
                    className={[
                      styles.dayCell,
                      !cell.current ? styles.otherMonth : '',
                      isToday    ? styles.today    : '',
                      isSelected ? styles.selected : '',
                    ].join(' ')}
                    onClick={() => setSelectedDate(ymd)}
                  >
                    <span className={styles.dayNum}>{cell.date.getDate()}</span>

                    {/* Mobile: show dots only */}
                    {isMobile ? (
                      <div className={styles.eventDotOnly}>
                        {dayEvents.slice(0, 3).map(e => (
                          <div key={e.id} className={styles.eventDot}
                            style={{ background: e.color }} />
                        ))}
                      </div>
                    ) : (
                      <>
                        {dayEvents.slice(0, maxShow).map(e => (
                          <div
                            key={e.id}
                            className={styles.eventPill}
                            style={{
                              background: `${e.color}18`,
                              color: e.color,
                              border: `1px solid ${e.color}33`,
                            }}
                            onClick={ev => { ev.stopPropagation(); setDetailEvent(e); }}
                          >
                            <div className={styles.eventPillDot} style={{ background: e.color }} />
                            <span className={styles.eventPillLabel}>{e.title}</span>
                          </div>
                        ))}
                        {dayEvents.length > maxShow && (
                          <span className={styles.moreEvents}>
                            +{dayEvents.length - maxShow} more
                          </span>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className={styles.legendStrip}>
              <div className={styles.legendItem}>
                <div className={styles.legendDot} style={{ background: '#2D5A3D' }} />
                Event
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendDot} style={{ background: '#C9A84C' }} />
                Birthday
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendDot} style={{ background: '#9A9590' }} />
                🔁 Recurring
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className={styles.rightCol}>

            {/* Selected day panel */}
            <div className={styles.selectedDayCard}>
              <div className={styles.selectedDayHeader}>
                <div className={styles.selectedDayTitle}>
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-UG', {
                    weekday: 'long', day: 'numeric', month: 'long'
                  })}
                </div>
                <div className={styles.selectedDaySub}>
                  {selectedEvents.length === 0
                    ? 'No events'
                    : `${selectedEvents.length} event${selectedEvents.length > 1 ? 's' : ''}`}
                </div>
              </div>

              <div className={styles.selectedDayEvents}>
                {selectedEvents.length === 0 ? (
                  <div className={styles.noEventsMsg}>
                    <span className={styles.noEventsEmoji}>📭</span>
                    Nothing scheduled for this day
                    <button className={styles.cardAction}
                      style={{ marginTop: 4 }}
                      onClick={() => setShowAdd(true)}>
                      + Add Event
                    </button>
                  </div>
                ) : (
                  selectedEvents.map(e => {
                    const colors = EVENT_TYPE_COLORS[e.type];
                    return (
                      <div key={e.id} className={styles.selectedEventItem}
                        onClick={() => setDetailEvent(e)}>
                        <div className={styles.selectedEventColor}
                          style={{ background: e.color }} />
                        <div className={styles.selectedEventInfo}>
                          <div className={styles.selectedEventTitle}>{e.title}</div>
                          <div className={styles.selectedEventMeta}>
                            {e.time && (
                              <span className={styles.selectedEventTime}>🕐 {e.time}</span>
                            )}
                            <span className={styles.selectedEventType}
                              style={{ background: colors.bg, color: colors.text }}>
                              {e.type}
                            </span>
                            {e.recurrence !== 'none' && (
                              <span className={styles.selectedEventRecurrence}>
                                {RECURRENCE_LABELS[e.recurrence]}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Upcoming events */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>🗓 Upcoming</span>
                <span style={{ fontSize: 12, color: '#9A9590' }}>
                  {upcomingEvents.length} events
                </span>
              </div>
              <div className={styles.agendaList}>
                {upcomingEvents.map(e => {
                  const d      = new Date(e.date + 'T00:00:00');
                  const month3 = d.toLocaleDateString('en-UG', { month: 'short' });
                  const dayNum = d.getDate();
                  const colors = EVENT_TYPE_COLORS[e.type];
                  return (
                    <div key={e.id} className={styles.agendaItem}
                      onClick={() => { setDetailEvent(e); setSelectedDate(e.date); }}>
                      <div className={styles.agendaDateBox}
                        style={{ borderColor:`${e.color}55`, color:e.color, background:`${e.color}0D` }}>
                        <span className={styles.agendaDateMonth}>{month3}</span>
                        <span className={styles.agendaDateNum}>{dayNum}</span>
                      </div>
                      <div className={styles.agendaInfo}>
                        <div className={styles.agendaTitle}>{e.title}</div>
                        <div className={styles.agendaMeta}>
                          {e.time && (
                            <span className={styles.agendaTime}>🕐 {e.time}</span>
                          )}
                          {e.recurrence !== 'none' && (
                            <span className={styles.agendaRecurrence}>
                              {RECURRENCE_LABELS[e.recurrence]}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={styles.agendaTypeBadge}>
                        {e.type === 'birthday' ? '🎂' : '📌'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAdd && (
        <AddEventModal
          defaultDate={selectedDate}
          onClose={() => setShowAdd(false)}
          onAdd={handleAddEvent}
        />
      )}

      {/* Event Detail Modal */}
      {detailEvent && (
        <EventDetailModal
          event={detailEvent}
          onClose={() => setDetailEvent(null)}
        />
      )}
    </AppShell>
  );
}