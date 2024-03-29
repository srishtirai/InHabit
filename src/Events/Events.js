import React, { useEffect, useState } from "react";
import { Header } from "../Components/Header";
import { EventBookingDialog } from "../Components/EventBookingDialog"; // New dialog component
import "./Events.css";
import {toast} from 'react-toastify';
import { getEvents, getTags, updateEventStatus } from "../api";
import { Icon } from 'semantic-ui-react';
import { formatDate } from "../constants";



export const Events = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState({});
  const [tags, setTags] = useState([]);
  const [events, setEvents] = useState([]);

  const openDialog = (event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const fetchEvents = (topic_id) => {
    getEvents(topic_id).then(response => {
      setEvents(response.data);
    }).catch(errror => {
      console.log(errror);
      toast("Failed to fetch events !");
    })
  };

  useEffect(() => {
    getTags("EVENT").then(response => {
      const {data} = response;
      setTags(data);
    }).catch(errror => {
      console.log(errror);
      toast("Could not fetch tags", "error");
    });
    fetchEvents();
  }, []);

  const changeStatus = eventId => {
    updateEventStatus(eventId).then(response => {
      toast("RSVP updated successfully");
      setIsDialogOpen(false);
      fetchEvents();
    }).catch(error => {
      console.log(error);
      toast.error("Could not update status");
    })
  };

/*const eventsData = [
  {
    id: 1,
    header: "Community Clean Up",
    date: "April 22, 2024",
    location: "Boston Park",
    image: "url-to-event-image-1.jpg",
  },
  {
    id: 2,
    header: "Tree Planting Day",
    date: "May 10, 2024",
    location: "Greenwood Forest",
    image: "url-to-event-image-2.jpg",
  },
  {
    id: 2,
    header: "Tree Planting Day",
    date: "May 10, 2024",
    location: "Greenwood Forest",
    image: "url-to-event-image-2.jpg",
  },
  {
    id: 2,
    header: "Tree Planting Day",
    date: "May 10, 2024",
    location: "Greenwood Forest",
    image: "url-to-event-image-2.jpg",
  },
  {
    id: 2,
    header: "Tree Planting Day",
    date: "May 10, 2024",
    location: "Greenwood Forest",
    image: "url-to-event-image-2.jpg",
  }
];*/

const selectTopic = (topic) => {
  setSelectedTopic(topic)
  fetchEvents(topic.id);
}

  return (
    <div className="events">
      <div className="sidebar">
        {tags.map((topic, index) => (
          <button 
            key={index} 
            onClick={() => selectTopic(topic)}
            className={`sidebar-topic ${selectedTopic.id === topic.id ? 'selected' : ''}`} // Template literals
          >
            {topic.name}
          </button>
        ))}
      </div>
      <div className="events-container">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <img src={event.images[0]} alt={event.name} className="event-image" />
            <div className="event-info">
              <div className="event-header">{event.name}</div>
              <div className="event-date">{formatDate(event.created_at)}</div>
              <div className="event-location">Boston, MA</div>
              <button className="book-button" onClick={() => openDialog(event)}> <Icon name="eye" /></button>
            </div>
          </div>
        ))}
      </div>
      {isDialogOpen && <EventBookingDialog event={selectedEvent} onClose={() => setIsDialogOpen(false)} onClick={changeStatus} />}
    </div>
  );
};