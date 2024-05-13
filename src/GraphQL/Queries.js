import { gql } from "@apollo/client";

export const GET_ALL_USERS = gql`
  query {
    getAllUsers {
      id
      firstName
      lastName
      clerkId
      email
      profilePhoto
      mobileNumber
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query getUserById($id: Int!) {
    getUserById(id: $id) {
      id
      firstName
      lastName
      clerkId
      email
      profilePhoto
      mobileNumber
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_BY_CLERK_ID = gql`
  query getUserByClerkId($clerkId: String!) {
    getUserByClerkId(clerkId: $clerkId) {
      id
      firstName
      lastName
      clerkId
      email
      profilePhoto
      mobileNumber
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_EVENTS = gql`
  query {
    getAllEvents {
      id
      name
      description
      venue
      eventDate
      startTime
      endTime
      timeDuration
      entriesCount
      organizer {
        id
        firstName
        lastName
        profilePhoto
        username
        mobileNumber
        createdAt
        updatedAt
      }
      photo
      createdAt
      updatedAt
      eventVisitors {
        id
        scanned
        visitor {
          id
          firstName
          lastName
          profilePhoto
          username
          mobileNumber
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      isExpired
    }
  }
`;

export const GET_EVENT_BY_ID = gql`
  query GetEventById($id: Int!) {
    getEventById(id: $id) {
      id
      name
      description
      venue
      eventDate
      startTime
      endTime
      timeDuration
      entriesCount
      organizer {
        id
        firstName
        lastName
        profilePhoto
        username
        mobileNumber
        createdAt
        updatedAt
      }
      photo
      createdAt
      updatedAt
      eventVisitors {
        id
        scanned
        visitor {
          id
          firstName
          lastName
          profilePhoto
          username
          mobileNumber
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      isExpired
    }
  }
`;

export const GET_EVENTS_BY_ORGANIZER_CLERK_ID = gql`
  query GetEventsByOrganizerClerkId($clerkId: String!) {
    getEventsByOrganizerClerkId(clerkId: $clerkId) {
      id
      name
      description
      venue
      photo
      eventDate
      startTime
      endTime
      timeDuration
      entriesCount
      organizer {
        id
        firstName
        lastName
        profilePhoto
        email
        mobileNumber
        createdAt
        updatedAt
      }
      eventVisitors {
        visitor {
          id
          firstName
          lastName
          profilePhoto
          email
        }
      }
    }
  }
`;

export const GET_ALL_EVENT_VISITORS = gql`
  query {
    getAllEventVisitors {
      id
      scanned
      events {
        id
        name
        description
        venue
        eventDate
        startTime
        endTime
        timeDuration
        entriesCount
        organizer {
          id
          firstName
          lastName
          profilePhoto
          username
          mobileNumber
          createdAt
          updatedAt
        }
        photo
        createdAt
        updatedAt
        isExpired
      }
      visitor {
        id
        firstName
        lastName
        profilePhoto
        username
        mobileNumber
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_EVENT_VISITOR_BY_ID = gql`
  query GetEventVisitorById($id: Int!) {
    getEventVisitorById(id: $id) {
      id
      scanned
      events {
        id
        name
        description
        venue
        eventDate
        startTime
        endTime
        timeDuration
        entriesCount
        isExpired
        organizer {
          id
          firstName
          lastName
          profilePhoto
          email
          mobileNumber
          createdAt
          updatedAt
        }
      }
      visitor {
        id
        firstName
        lastName
        profilePhoto
        email
        mobileNumber
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_EVENT_VISITOR_BY_USER_CLERK_ID = gql`
  query GetEventVisitorByUserClerkId($clerkId: String!) {
    getEventVisitorByUserClerkId(clerkId: $clerkId) {
      id
      events {
        id
        name
        description
        venue
        eventDate
        startTime
        endTime
        photo
        timeDuration
        entriesCount
        isExpired
        organizer {
          id
          firstName
          lastName
          clerkId
          email
        }
      }
      visitor {
        id
        firstName
        lastName
        clerkId
        email
      }
    }
  }
`;
