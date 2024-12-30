import React, { useState } from "react";
import { Calendar, momentLocalizer, Views, DateLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import the edit and delete icons
import "./calendar.css"; // Import your custom CSS file
import { FaArrowLeftLong, FaArrowRight } from "react-icons/fa6";
import { CiSettings } from "react-icons/ci";

const localizer = momentLocalizer(moment);

export default function CalendarComponent() {
          const [events, setEvents] = useState([]);
          const [modalOpen, setModalOpen] = useState(false);
          const [eventTitle, setEventTitle] = useState("");
          const [eventType, setEventType] = useState("");
          const [filterType, setFilterType] = useState("");
          const [selectedEvent, setSelectedEvent] = useState(null); // New state for the selected event
          const [eventStart, setEventStart] = useState(new Date()); // Add state for event start time
          const [eventEnd, setEventEnd] = useState(new Date()); // Add state for event end time
          const [view, setView] = useState('month'); // Add view state
          const [date, setDate] = useState(new Date());
          const [showArrow, setShowArrow] = useState({
                    next: false,
                    previous: false,
                    menu: false
          });

          const meetingTypes = ["Interview", "Team Meeting", "Other"];

          const viewMapping = {
                    'month': 'month',
                    'week': 'week',
                    'day': 'day',
                    'agenda': 'agenda',
                    'work_week': 'work_week',
                    'three_day': 'three_day'
          };

          const handleViewChange = (e) => {
                    const selectedView = viewMapping[e.target.value.toLowerCase()];
                    setView(selectedView);
                    setShowArrow(prev => ({ ...prev, menu: false }));
          };

          const handleNavigation = (action) => {
                    const newDate = new Date(date);
                    if (action === 'PREV') {
                              switch (view) {
                                        case 'month':
                                                  newDate.setMonth(date.getMonth() - 1);
                                                  break;
                                        case 'week':
                                        case 'work_week':
                                                  newDate.setDate(date.getDate() - 7);
                                                  break;
                                        case 'day':
                                                  newDate.setDate(date.getDate() - 1);
                                                  break;
                                        default:
                                                  newDate.setMonth(date.getMonth() - 1);
                              }
                    } else if (action === 'NEXT') {
                              switch (view) {
                                        case 'month':
                                                  newDate.setMonth(date.getMonth() + 1);
                                                  break;
                                        case 'week':
                                        case 'work_week':
                                                  newDate.setDate(date.getDate() + 7);
                                                  break;
                                        case 'day':
                                                  newDate.setDate(date.getDate() + 1);
                                                  break;
                                        default:
                                                  newDate.setMonth(date.getMonth() + 1);
                              }
                    }
                    setDate(newDate);
          };


          // Define a color map for each meeting type
          const typeColors = {
                    Interview: "#38a169", // Green for Interviews
                    "Team Meeting": "#dd6b20", // Orange for Team Meetings
                    Other: "#f6e05e", // Yellow for Other meetings
          };

          const handleSelect = ({ start, end }) => {
                    setEventTitle("");
                    setEventType("");
                    setEventStart(start); // Set start date from the selected slot
                    setEventEnd(end); // Set end date from the selected slot
                    setSelectedEvent(null); // Reset for new events
                    setModalOpen(true);
          };

          const handleEventSelect = (event) => {
                    setSelectedEvent(event);
                    setEventTitle(event.title);
                    setEventType(event.type);
                    setEventStart(event.start); // Set start date for editing
                    setEventEnd(event.end); // Set end date for editing
                    setModalOpen(true);
          };

          const handleAddOrUpdateEvent = () => {
                    if (selectedEvent) {
                              // Update the existing event
                              const updatedEvents = events.map((event) =>
                                        event === selectedEvent
                                                  ? {
                                                            ...event,
                                                            title: eventTitle,
                                                            type: eventType,
                                                            start: eventStart,
                                                            end: eventEnd,
                                                  }
                                                  : event
                              );
                              setEvents(updatedEvents);
                    } else {
                              // Add a new event
                              const newEvent = {
                                        title: eventTitle,
                                        type: eventType,
                                        start: eventStart, // Set start from the state
                                        end: eventEnd, // Set end from the state
                                        allDay: false,
                              };
                              setEvents([...events, newEvent]);
                    }

                    setModalOpen(false);
                    setEventTitle("");
                    setEventType("");
                    setSelectedEvent(null); // Reset the selected event
          };

          const handleDeleteEvent = (event) => {
                    const updatedEvents = events.filter((e) => e !== event);
                    setEvents(updatedEvents);
          };

          const handleFilterChange = (e) => {
                    setFilterType(e.target.value);
          };

          const filteredEvents = filterType
                    ? events.filter((event) => event.type === filterType)
                    : events;

          // Customize event styles based on type
          const eventStyleGetter = (event) => {
                    const backgroundColor = typeColors[event.type] || "bg-gray-400"; // Default to gray if no type
                    return {
                              style: {
                                        backgroundColor: backgroundColor,
                                        border: "none",
                                        borderRadius: "0.5rem",
                                        color: "white",
                                        fontSize: "10px",
                              },
                    };
          };

          const eventPropGetter = (event) => ({
                    className: "transition-transform transform", 
                    style: {
                      backgroundColor: typeColors[event.type] || "#gray-400",
                      border: "none",
                      borderRadius: "4px",
                      color: "white",
                      fontSize: "18px",
                      height: "auto",
                      width: "100%",
                      padding: "100px",
                      marginBottom: "100px",
                      maxHeight: view === 'month' ? '40px' : 'auto'
                    }
                  });


          const displayedDate = moment(date);
          const current = `${displayedDate.format('MMMM')} ${displayedDate.format('YYYY')}`;

          return (
                    <div className="flex flex-col items-center">


                              <div className="w-full p-3 pb-0 mt-5 flex justify-center">
                                        <div className="w-[95%] p-3 flex justify-between items-center">
                                                  <h1 className="text-xl font-semibold">{current}</h1>
                                                  <div className="flex gap-5">
                                                            <div className="flex items-center justify-center relative gap-3">
                                                                      <FaArrowLeftLong className="w-8 h-8 p-2 text-slate-700 hover:bg-gray-100 rounded-full cursor-pointer" onMouseEnter={() => setShowArrow({
                                                                                previous: true,
                                                                                next: false,
                                                                                menu: false

                                                                      })} onMouseLeave={() => setShowArrow({
                                                                                previous: false,
                                                                                next: false,
                                                                                menu: false
                                                                      })} onClick={() => handleNavigation('PREV')} />
                                                                      {showArrow.previous && <div className="absolute top-10 left-0 text-sm p-1 px-2 z-10 bg-black text-white rounded-lg">Previous</div>}
                                                                      <FaArrowRight className="w-8 h-8 p-2 text-slate-700 hover:bg-gray-100 rounded-full cursor-pointer" onMouseEnter={() => setShowArrow({
                                                                                previous: false,
                                                                                next: true,
                                                                                menu: false
                                                                      })} onMouseLeave={() => setShowArrow({
                                                                                previous: false,
                                                                                next: false,
                                                                                menu: false
                                                                      })} onClick={() => handleNavigation('NEXT')} />
                                                                      {showArrow.next && <div className="absolute top-10 right-0 text-sm p-1 px-2 z-10 bg-black text-white rounded-lg">Next</div>}
                                                            </div>
                                                            <div className="relative">
                                                                      <CiSettings className="w-9 h-9 p-2 mt-1 text-black hover:bg-gray-100 rounded-full cursor-pointer" onClick={() => {
                                                                                setShowArrow({
                                                                                          previous: false,
                                                                                          next: false,
                                                                                          menu: !showArrow.menu
                                                                                })
                                                                      }} />
                                                                      {
                                                                                showArrow.menu && (
                                                                                          <div className="p-3 bg-white shadow-md rounded-md absolute top-10 right-0 z-10">
                                                                                                    <select
                                                                                                              value={Object.keys(viewMapping).find(key => viewMapping[key] === view) || 'month'}
                                                                                                              onChange={handleViewChange}
                                                                                                              className="focus:outline-none border p-2 rounded-lg px-3 text-[1.2rem] cursor-pointer"
                                                                                                    >
                                                                                                              {Object.keys(viewMapping).map((viewType) => (
                                                                                                                        <option key={viewType} value={viewType}>
                                                                                                                                  {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                                                                                                                        </option>
                                                                                                              ))}
                                                                                                    </select>
                                                                                                    <div className="p-2">
                                                                                                              <h1>Start of Week</h1>
                                                                                                              <p>Sunday</p>
                                                                                                    </div>
                                                                                          </div>
                                                                                )
                                                                      }

                                                            </div>
                                                            <div className="flex justify-between">
                                                                      <select
                                                                                value={filterType}
                                                                                onChange={handleFilterChange}
                                                                                className="border p-2 rounded-md shadow-sm"
                                                                      >
                                                                                <option value="">All Meetings</option>
                                                                                {meetingTypes.map((type) => (
                                                                                          <option key={type} value={type}>
                                                                                                    {type}
                                                                                          </option>
                                                                                ))}
                                                                      </select>
                                                            </div>
                                                  </div>

                                        </div>
                              </div>

                              <Calendar
                                        localizer={localizer}
                                        events={filteredEvents}
                                        startAccessor="start"
                                        endAccessor="end"
                                        selectable
                                        onSelectSlot={handleSelect}
                                        step={30} // This sets 30-minute intervals
                                        timeslots={2}
                                        formats={{
                                                  timeGutterFormat: (date, culture, localizer) => 
                                                    localizer.format(date, 'h:mm A', culture)
                                                }}
                                        style={{
                                                  height: 700,
                                                  borderRadius: "0.5rem",
                                                  backgroundColor: "white",
                                                  padding: "0.5rem",
                                                  cursor: "pointer"
                                        }}
                                        date={date}
                                        onNavigate={setDate}
                                        eventPropGetter={eventPropGetter}
                                        view={view}
                                        onView={setView}
                                        views={{
                                                  month: true,
                                                  week: true,
                                                  day: true,
                                                  agenda: true,
                                                  work_week: true,
                                                  three_day: true
                                        }}
                                        min={moment().startOf('day').toDate()} // Start time of the calendar
                                        max={moment().endOf('day').toDate()} 
                                        components={{
                                                  event: ({ event }) => {
                                                    // Get all events for the same time slot
                                                    const sameTimeEvents = filteredEvents.filter(e => 
                                                      moment(e.start).format('YYYY-MM-DD HH:mm') === moment(event.start).format('YYYY-MM-DD HH:mm')
                                                    );
                                                    const eventIndex = sameTimeEvents.findIndex(e => e === event);
                                                    
                                                    // Return null if it's beyond the first two events
                                                    if (eventIndex >= 2) return null;
                                                
                                                    return (
                                                      <div className="w-full h-full flex flex-col justify-between p-1" 
                                                           onClick={() => handleEventSelect(event)}
                                                           style={{ backgroundColor: typeColors[event.type] }}>
                                                        <div className="flex justify-between items-center">
                                                          <span className="text-xs truncate">{event.title}</span>
                                                          <div className="flex items-center gap-1">
                                                            <FaEdit
                                                              onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEventSelect(event);
                                                              }}
                                                              className="cursor-pointer hover:opacity-80"
                                                              size={10}
                                                            />
                                                            <FaTrash
                                                              onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteEvent(event);
                                                              }}
                                                              className="cursor-pointer hover:opacity-80"
                                                              size={10}
                                                            />
                                                          </div>
                                                        </div>
                                                        <div className="text-[10px] opacity-80">
                                                          {moment(event.start).format('h:mm A')}
                                                        </div>
                                                      </div>
                                                    );
                                                  },
                                                
                                                  // Custom component to show "+X more" indicator
                                                  slotGrouper: ({ group, slots, resources }) => {
                                                    const sameTimeEvents = filteredEvents.filter(event => 
                                                      slots.some(slot => 
                                                        moment(event.start).format('YYYY-MM-DD HH:mm') === moment(slot).format('YYYY-MM-DD HH:mm')
                                                      )
                                                    );
                                                
                                                    if (sameTimeEvents.length > 2) {
                                                      return (
                                                        <div className="absolute right-0 top-0 text-xs text-blue-600 font-medium p-1">
                                                          +{sameTimeEvents.length - 2} more
                                                        </div>
                                                      );
                                                    }
                                                    return null;
                                                  }
                                                }}
                              />

                              {modalOpen && (
                                        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                                                  <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                                                            <h2 className="text-lg font-bold mb-4 text-gray-700">
                                                                      {selectedEvent ? "Edit Event" : "Add Event"}
                                                            </h2>
                                                            <input
                                                                      type="text"
                                                                      placeholder="Event Title"
                                                                      value={eventTitle}
                                                                      onChange={(e) => setEventTitle(e.target.value)}
                                                                      className="border border-gray-300 p-2 mb-2 w-full rounded"
                                                                      required
                                                            />

                                                            <div className="mb-2">
                                                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                                Start Date & Time
                                                                      </label>
                                                                      <input
                                                                                type="datetime-local"
                                                                                value={moment(eventStart).format('YYYY-MM-DDTHH:mm')}
                                                                                onChange={(e) => setEventStart(new Date(e.target.value))}
                                                                                className="border border-gray-300 p-2 w-full rounded cursor-pointer"
                                                                                required
                                                                      />
                                                            </div>

                                                            {/* End Date and Time */}
                                                            <div className="mb-2">
                                                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                                End Date & Time
                                                                      </label>
                                                                      <input
                                                                                type="datetime-local"
                                                                                value={moment(eventEnd).format('YYYY-MM-DDTHH:mm')}
                                                                                onChange={(e) => setEventEnd(new Date(e.target.value))}
                                                                                className="border border-gray-300 p-2 w-full rounded cursor-pointer"
                                                                                required
                                                                      />
                                                            </div>

                                                            <select
                                                                      value={eventType}
                                                                      onChange={(e) => setEventType(e.target.value)}
                                                                      className="border border-gray-300 p-2 mb-2 w-full rounded cursor-pointer"
                                                            >
                                                                      <option value="">Select Meeting Type</option>
                                                                      {meetingTypes.map((type) => (
                                                                                <option key={type} value={type}>
                                                                                          {type}
                                                                                </option>
                                                                      ))}
                                                            </select>
                                                            <button
                                                                      onClick={handleAddOrUpdateEvent}
                                                                      className="bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-200 hover:bg-blue-700"
                                                            >
                                                                      {selectedEvent ? "Update Event" : "Add Event"}
                                                            </button>
                                                            <button
                                                                      onClick={() => setModalOpen(false)}
                                                                      className="bg-red-600 text-white px-4 py-2 rounded transition-colors duration-200 hover:bg-red-700 ml-2"
                                                            >
                                                                      Cancel
                                                            </button>
                                                  </div>
                                        </div>
                              )}
                    </div>
          );
}