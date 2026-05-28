import { useMemo, useState } from 'react';
import styles from './calendar.module.css';
import {
  calendarEvents,
  calendarStats,
  eventCategories,
} from './mockData';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentDate] = useState(new Date(2026, 5)); // June 2026

  const monthName = currentDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayIndex = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const calendarDays = useMemo(() => {
    const days = [];

    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }

    return days;
  }, [daysInMonth, firstDayIndex]);

  const getEventsForDay = (day) => {
    const formatted = `2026-06-${String(day).padStart(2, '0')}`;

    return calendarEvents.filter((event) => event.date === formatted);
  };

  return (
    <div className={styles.page}>
      {/* ─── Header ───────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Family Calendar</h1>
          <p>Track gatherings, birthdays, prayer meetings & memories.</p>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.newEventBtn}>
            <span>＋</span>
            Add Event
          </button>

          <button className={styles.themeBtn}>☾</button>
        </div>
      </div>

      {/* ─── Stats ────────────────────────────────────────── */}
      <div className={styles.statsStrip}>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{
              background: 'rgba(45,90,61,0.1)',
            }}
          >
            📅
          </div>

          <div>
            <div className={styles.statValue}>
              {calendarStats.totalEvents}
            </div>
            <div className={styles.statLabel}>Total Events</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{
              background: 'rgba(61,90,138,0.1)',
            }}
          >
            ⏳
          </div>

          <div>
            <div className={styles.statValue}>
              {calendarStats.upcomingEvents}
            </div>
            <div className={styles.statLabel}>Upcoming</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{
              background: 'rgba(138,90,61,0.1)',
            }}
          >
            🎂
          </div>

          <div>
            <div className={styles.statValue}>
              {calendarStats.birthdays}
            </div>
            <div className={styles.statLabel}>Birthdays</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{
              background: 'rgba(201,168,76,0.12)',
            }}
          >
            🙏
          </div>

          <div>
            <div className={styles.statValue}>
              {calendarStats.prayerEvents}
            </div>
            <div className={styles.statLabel}>Prayer Events</div>
          </div>
        </div>
      </div>

      {/* ─── Layout ───────────────────────────────────────── */}
      <div className={styles.layout}>
        {/* ─── Main Calendar ─────────────────────────────── */}
        <div className={styles.leftCol}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>{monthName}</div>

              <div className={styles.calendarControls}>
                <button className={styles.controlBtn}>‹</button>
                <button className={styles.controlBtn}>›</button>
              </div>
            </div>

            {/* Week labels */}
            <div className={styles.weekHeader}>
              {weekDays.map((day) => (
                <div key={day} className={styles.weekDay}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className={styles.calendarGrid}>
              {calendarDays.map((day, index) => {
                const dayEvents = day ? getEventsForDay(day) : [];

                return (
                  <div
                    key={index}
                    className={`${styles.dayCell} ${
                      !day ? styles.emptyCell : ''
                    }`}
                  >
                    {day && (
                      <>
                        <div className={styles.dayNumber}>{day}</div>

                        <div className={styles.eventStack}>
                          {dayEvents.slice(0, 3).map((event) => (
                            <button
                              key={event.id}
                              className={styles.eventPill}
                              style={{
                                background: `${event.color}15`,
                                borderColor: `${event.color}30`,
                                color: event.color,
                              }}
                              onClick={() => setSelectedEvent(event)}
                            >
                              <span>{event.icon}</span>
                              <span>{event.title}</span>
                            </button>
                          ))}

                          {dayEvents.length > 3 && (
                            <div className={styles.moreEvents}>
                              +{dayEvents.length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── Sidebar ───────────────────────────────────── */}
        <div className={styles.rightCol}>
          {/* Categories */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>Event Categories</div>
            </div>

            <div className={styles.categoryList}>
              {eventCategories.map((category) => (
                <div key={category.label} className={styles.categoryItem}>
                  <div
                    className={styles.categoryDot}
                    style={{
                      background: category.color,
                    }}
                  >
                    {category.icon}
                  </div>

                  <span>{category.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>Upcoming Events</div>
            </div>

            <div className={styles.upcomingList}>
              {calendarEvents.map((event) => (
                <button
                  key={event.id}
                  className={styles.upcomingItem}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div
                    className={styles.upcomingIcon}
                    style={{
                      background: `${event.color}15`,
                      color: event.color,
                    }}
                  >
                    {event.icon}
                  </div>

                  <div className={styles.upcomingBody}>
                    <div className={styles.upcomingTitle}>
                      {event.title}
                    </div>

                    <div className={styles.upcomingMeta}>
                      {event.date} • {event.time}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Event Modal ─────────────────────────────────── */}
      {selectedEvent && (
        <div
          className={styles.overlay}
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <button
                className={styles.closeBtn}
                onClick={() => setSelectedEvent(null)}
              >
                ✕
              </button>

              <div
                className={styles.modalIcon}
                style={{
                  background: `${selectedEvent.color}15`,
                  color: selectedEvent.color,
                }}
              >
                {selectedEvent.icon}
              </div>

              <div className={styles.modalTitle}>
                {selectedEvent.title}
              </div>

              <div className={styles.modalPill}>
                {selectedEvent.type}
              </div>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Date</span>
                <span>{selectedEvent.date}</span>
              </div>

              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Time</span>
                <span>{selectedEvent.time}</span>
              </div>

              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Location</span>
                <span>{selectedEvent.location}</span>
              </div>

              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Host</span>
                <span>{selectedEvent.host}</span>
              </div>

              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Attendees</span>
                <span>{selectedEvent.attendees}</span>
              </div>

              <div className={styles.modalDescription}>
                {selectedEvent.description}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.secondaryBtn}>
                Edit Event
              </button>

              <button className={styles.primaryBtn}>
                View Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;