import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import AddEventModal from './AddEventModal';

const WeeklyPlanner = () => {

          const [workDays, setWorkDays] = useState({
                    0: false,  // Sunday
                    1: true,   // Monday
                    2: true,   // Tuesday
                    3: true,   // Wednesday
                    4: true,   // Thursday
                    5: true,   // Friday
                    6: false   // Saturday
          });

          const [currentDate, setCurrentDate] = useState(new Date());
          const [view, setView] = useState('week');

          const [menu, setMenu] = useState(false);

          // AddEventModal
          const [events, setEvents] = useState([]);
          const [isModalOpen, setIsModalOpen] = useState(false);
          const [selectedSlot, setSelectedSlot] = useState(null);


          const handleTimeSlotClick = (date, hour) => {
                    const [hourNum, period] = hour.split(' ');
                    let hours = parseInt(hourNum);
                    if (period === 'PM' && hours !== 12) {
                              hours += 12;
                    } else if (period === 'AM' && hours === 12) {
                              hours = 0;
                    }

                    const slotDate = new Date(date);
                    slotDate.setHours(hours, 0, 0, 0);

                    setSelectedSlot({
                              date: slotDate,
                              time: `${hours.toString().padStart(2, '0')}:00`
                    });
                    setIsModalOpen(true);
          };

          const handleAddEvent = (newEvent) => {
                    setEvents(prevEvents => [...prevEvents, newEvent]);
          };

          const getEventsForTimeSlot = (date, hour) => {
                    return events.filter(event => {
                              const [hourNum, period] = hour.split(' ');
                              let slotHour = parseInt(hourNum);
                              if (period === 'PM' && slotHour !== 12) {
                                        slotHour += 12;
                              } else if (period === 'AM' && slotHour === 12) {
                                        slotHour = 0;
                              }

                              const slotStart = new Date(date);
                              slotStart.setHours(slotHour, 0, 0, 0);

                              return (
                                        event.start.getTime() >= slotStart.getTime() &&
                                        event.start.getTime() < new Date(slotStart.getTime() + 3600000).getTime()
                              );
                    });
          };

          // Get the start of the period based on view
          const getStartDate = (date, viewType) => {
                    const newDate = new Date(date);
                    if (viewType === 'week') {
                              const day = newDate.getDay();
                              newDate.setDate(newDate.getDate() - day);
                    } else if (viewType === '3days' || viewType === '5days' || viewType === '1day') {
                              // For other views, start from the current date
                              newDate.setDate(newDate.getDate());
                    }
                    return newDate;
          };

          // Get dates based on view type
          const getDates = (startDate, viewType) => {
                    const length = viewType === 'week' ? 7 :
                              viewType === '3days' ? 3 :
                                        viewType === '5days' ? 5 :
                                                  viewType === '1day' ? 1 : 42;
                    return Array.from({ length }, (_, i) => {
                              const date = new Date(startDate);
                              date.setDate(startDate.getDate() + i);
                              return {
                                        name: date.toLocaleString('en-US', { weekday: 'short' }).toUpperCase(),
                                        date: date.getDate(),
                                        month: date.getMonth(),
                                        year: date.getFullYear(),
                                        fullDate: date,
                                        isToday: isSameDay(date, new Date()),
                                        isCurrentMonth: viewType === 'month' ? date.getMonth() === currentDate.getMonth() : true
                              };
                    });
          };

          // Get month dates
          const getMonthDates = (date) => {
                    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                    const startDate = new Date(firstDay);
                    startDate.setDate(startDate.getDate() - startDate.getDay());
                    return getDates(startDate, 'month');
          };

          // Check if two dates are the same day
          const isSameDay = (date1, date2) => {
                    return date1.getDate() === date2.getDate() &&
                              date1.getMonth() === date2.getMonth() &&
                              date1.getFullYear() === date2.getFullYear();
          };

          const hours = [
                    '9 AM', '10 AM', '11 AM', '12 PM',
                    '1 PM', '2 PM', '3 PM', '4 PM',
                    '5 PM', '6 PM', '7 PM', '8 PM', '9 PM'
          ];

          // Navigation functions
          const navigate = (direction) => {
                    const newDate = new Date(currentDate);
                    if (view === 'week') {
                              newDate.setDate(currentDate.getDate() + direction * 7);
                    } else if (view === '3days') {
                              newDate.setDate(currentDate.getDate() + direction * 3);
                    } else if (view === '5days') {
                              newDate.setDate(currentDate.getDate() + direction * 5);
                    } else if (view === '1day') {
                              newDate.setDate(currentDate.getDate() + direction);
                    } else {
                              newDate.setMonth(currentDate.getMonth() + direction);
                    }
                    setCurrentDate(newDate);
          };

          const goToToday = () => {
                    setCurrentDate(new Date());
          };

          const changeView = (newView) => {
                    setView(newView);
          };

          const days = view === 'month'
                    ? getMonthDates(currentDate)
                    : getDates(getStartDate(currentDate, view), view);

          const toggleWorkDay = (dayIndex) => {
                    setWorkDays(prev => ({
                              ...prev,
                              [dayIndex]: !prev[dayIndex]
                    }));
          };

          const WorkdaySettings = ({ workDays, onToggle }) => {
                    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

                    return (
                              <div className="flex items-center gap-2 mb-4">
                                        <span className="text-sm font-medium text-gray-700">Work days:</span>
                                        <div className="flex gap-1">
                                                  {days.map((day, index) => (
                                                            <button
                                                                      key={day}
                                                                      onClick={() => onToggle(index)}
                                                                      className={`px-3 py-1 text-sm rounded-md ${workDays[index]
                                                                                ? 'bg-blue-600 text-white'
                                                                                : 'bg-gray-100 text-gray-600'
                                                                                }`}
                                                            >
                                                                      {day}
                                                            </button>
                                                  ))}
                                        </div>
                              </div>
                    );
          };


          const renderTimeGrid = () => {
                    const isWorkDay = (date) => {
                      return workDays[date.getDay()];
                    };
                  
                    return (
                      <div className="flex w-full overflow-hidden">
                        {/* Time Column */}
                        <div className="w-24 flex-shrink-0 pr-4">
                          <div className="h-12"></div>
                          {hours.map((hour) => (
                            <div
                              key={hour}
                              className="h-16 flex items-start justify-end pr-4 text-sm text-gray-600"
                              style={{ borderTop: '1px solid #e5e7eb' }}
                            >
                              {hour}
                            </div>
                          ))}
                        </div>
                  
                        {/* Days Grid */}
                        <div className={`flex-grow grid ${
                          view === '1day' ? 'grid-cols-1' :
                          view === '3days' ? 'grid-cols-3' :
                          view === '5days' ? 'grid-cols-5' :
                          'grid-cols-7'
                        } divide-x divide-gray-200`}>
                          {days.map((day) => (
                            <div
                              key={`${day.fullDate}`}
                              className={`text-center ${!isWorkDay(day.fullDate) ? 'bg-gray-50' : ''}`}
                            >
                              <div className="h-12 flex flex-col justify-end pb-2">
                                <div className={`text-sm ${
                                  !isWorkDay(day.fullDate) ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                  {day.name}
                                </div>
                                <div className={`text-xl font-normal inline-flex justify-center ${
                                  day.isToday ? 'text-white bg-blue-600 rounded-full w-8 h-8 items-center mx-auto' :
                                  !isWorkDay(day.fullDate) ? 'text-gray-400' : ''
                                }`}>
                                  {day.date}
                                </div>
                              </div>
                              {hours.map((hour, idx) => {
                                const slotEvents = getEventsForTimeSlot(day.fullDate, hour);
                                return (
                                  <div
                                    key={`${day.fullDate}-${hour}`}
                                    className={`h-16 border-t border-gray-200 cursor-pointer relative ${
                                      !isWorkDay(day.fullDate) ? 'bg-gray-50' : ''
                                    }`}
                                    onClick={() => handleTimeSlotClick(day.fullDate, hour)}
                                  >
                                    {slotEvents.map(event => (
                                      <div
                                        key={event.id}
                                        className={`absolute left-1 right-1 p-1 rounded text-white text-sm ${event.color}`}
                                        style={{
                                          top: '4px',
                                          minHeight: '24px'
                                        }}
                                      >
                                        <div className="font-semibold truncate">{event.title}</div>
                                        <div className="text-xs">
                                          {event.start.toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true
                                          })}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  };

          return (
                    <div className="max-w-full mx-auto p-4">
                              {/* Navigation */}
                              <div className="flex justify-between items-center mb-4  md:px-10">
                                        <div className="flex items-center gap-4">
                                                  <button
                                                            onClick={() => navigate(-1)}
                                                            className="p-2 hover:bg-gray-100 rounded-full"
                                                  >
                                                            <ChevronLeft className="w-5 h-5" />
                                                  </button>
                                                  <h2 className="text-lg flex items-center gap-4">
                                                            <span className="font-semibold text-sm md:text-lg">
                                                                      {currentDate.toLocaleString('en-US', {
                                                                                month: 'long',
                                                                                year: 'numeric',
                                                                                ...(view !== 'month' && {
                                                                                          day: 'numeric'
                                                                                })
                                                                      })}
                                                            </span>
                                                  </h2>
                                                  <button
                                                            onClick={() => navigate(1)}
                                                            className="p-2 hover:bg-gray-100 rounded-full"
                                                  >
                                                            <ChevronRight className="w-5 h-5" />
                                                  </button>
                                        </div>
                                        <div className="md:flex items-center gap-2 hidden">
                                                  <button
                                                            onClick={goToToday}
                                                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                                  >
                                                            Today
                                                  </button>
                                                  <button
                                                            onClick={() => changeView('1day')}
                                                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                                  >
                                                            1 Day
                                                  </button>
                                                  <button
                                                            onClick={() => changeView('3days')}
                                                            className={`px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-black
              ${view === '3days' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                                                  >
                                                            3 Days
                                                  </button>
                                                  <button
                                                            onClick={() => changeView('5days')}
                                                            className={`px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-black
              ${view === '5days' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                                                  >
                                                            5 Days
                                                  </button>
                                                  <button
                                                            onClick={() => changeView('week')}
                                                            className={`px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-black
              ${view === 'week' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                                                  >
                                                            Week
                                                  </button>
                                                  <button
                                                            onClick={() => changeView('month')}
                                                            className={`px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2
              ${view === 'month' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                                                  >
                                                            <Calendar className="w-4 h-4" />
                                                            Month
                                                  </button>
                                        </div>

                                        <div className="md:hidden relative z-10">
                                                  <button
                                                            className="p-2 px-4 border rounded-xl"
                                                            onClick={() => setMenu(!menu)}
                                                  >
                                                            {menu ? 'Close' : 'Menu'}
                                                  </button>

                                                  <div className='absolute top-12 right-0 bg-white shadow-md rounded-lg p-4 w-40 flex-col items-center gap-2' style={{ display: menu ? 'flex' : 'none' }}>
                                                            <button
                                                                      onClick={goToToday}
                                                                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                                            >
                                                                      Today
                                                            </button>
                                                            <button
                                                                      onClick={() => changeView('1day')}
                                                                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                                            >
                                                                      1 Day
                                                            </button>
                                                            <button
                                                                      onClick={() => changeView('3days')}
                                                                      className={`px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-black
              ${view === '3days' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                                                            >
                                                                      3 Days
                                                            </button>
                                                            <button
                                                                      onClick={() => changeView('5days')}
                                                                      className={`px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-black
              ${view === '5days' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                                                            >
                                                                      5 Days
                                                            </button>
                                                            <button
                                                                      onClick={() => changeView('week')}
                                                                      className={`px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-black
              ${view === 'week' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                                                            >
                                                                      Week
                                                            </button>
                                                            <button
                                                                      onClick={() => changeView('month')}
                                                                      className={`px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2
              ${view === 'month' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                                                            >
                                                                      <Calendar className="w-4 h-4" />
                                                                      Month
                                                            </button>
                                                  </div>

                                        </div>
                              </div>

                              {/* Calendar Content */}
                              {view === 'month' ? (
                                        <div className="grid grid-cols-7 gap-px bg-gray-200 mt-10">
                                                  {/* Day headers */}
                                                  {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                                                            <div key={day} className="bg-white p-2 text-center text-sm text-gray-600">
                                                                      {day}
                                                            </div>
                                                  ))}

                                                  {/* Date grid */}
                                                  {days.map((day, index) => {
                                                            // Get events for this day (without hour parameter for month view)
                                                            const dayEvents = events.filter(event =>
                                                                      isSameDay(new Date(event.start), new Date(day.fullDate))
                                                            );

                                                            return (
                                                                      <div
                                                                                key={index}
                                                                                className={`bg-white p-2 h-32 cursor-pointer relative ${!day.isCurrentMonth ? 'text-gray-400' : ''
                                                                                          }`}
                                                                                onClick={() => handleTimeSlotClick(day.fullDate, '9 AM')}
                                                                      >
                                                                                <div className={`text-right mb-2 ${day.isToday ?
                                                                                          'w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center ml-auto' : ''
                                                                                          }`}>
                                                                                          {day.date}
                                                                                </div>
                                                                                <div className="overflow-y-auto max-h-24">
                                                                                          {dayEvents.map(event => (
                                                                                                    <div
                                                                                                              key={event.id}
                                                                                                              className={`${event.color} rounded p-1 mb-1 text-white text-sm`}
                                                                                                    >
                                                                                                              <div className="font-semibold truncate">{event.title}</div>
                                                                                                              <div className="text-xs">
                                                                                                                        {event.start.toLocaleTimeString('en-US', {
                                                                                                                                  hour: 'numeric',
                                                                                                                                  minute: '2-digit',
                                                                                                                                  hour12: true
                                                                                                                        })}
                                                                                                              </div>
                                                                                                    </div>
                                                                                          ))}
                                                                                </div>
                                                                      </div>
                                                            );
                                                  })}
                                        </div>
                              ) : (
                                        renderTimeGrid()
                              )}
                              <AddEventModal
                                        isOpen={isModalOpen}
                                        onClose={() => setIsModalOpen(false)}
                                        selectedSlot={selectedSlot}
                                        onAddEvent={handleAddEvent}
                              />
                    </div>
          );
};

export default WeeklyPlanner;