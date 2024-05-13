import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation createUser(
    $firstName: String!
    $lastName: String!
    $clerkId: String!
    $email: String!
    $profilePhoto: String
    $mobileNumber: String
  ) {
    createUser(
      firstName: $firstName
      lastName: $lastName
      clerkId: $clerkId
      email: $email
      profilePhoto: $profilePhoto
      mobileNumber: $mobileNumber
    ) {
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

export const UPDATE_USER = gql`
  mutation updateUser(
    $id: Int!
    $firstName: String
    $lastName: String
    $email: String
    $profilePhoto: String
    $mobileNumber: String
  ) {
    updateUser(
      id: $id
      firstName: $firstName
      lastName: $lastName
      email: $email
      profilePhoto: $profilePhoto
      mobileNumber: $mobileNumber
    ) {
      id
      firstName
      lastName
      email
      profilePhoto
      mobileNumber
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($id: Int!) {
    deleteUser(id: $id)
  }
`;

export const CREATE_EVENT = gql`
  mutation CreateEvent(
    $name: String!
    $description: String!
    $venue: String!
    $eventDate: String!
    $startTime: String!
    $endTime: String!
    $timeDuration: Int!
    $entriesCount: Int!
    $organizerClerkId: String!
    $photo: String
  ) {
    createEvent(
      name: $name
      description: $description
      venue: $venue
      eventDate: $eventDate
      startTime: $startTime
      endTime: $endTime
      timeDuration: $timeDuration
      entriesCount: $entriesCount
      organizerClerkId: $organizerClerkId
      photo: $photo
    ) {
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
        clerkId
        email
        profilePhoto
        mobileNumber
        createdAt
        updatedAt
      }
      photo
      createdAt
      updatedAt
      isExpired
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation UpdateEvent(
    $id: Int!
    $name: String
    $description: String
    $venue: String
    $eventDate: String
    $startTime: String
    $endTime: String
    $timeDuration: Int
    $entriesCount: Int
  ) {
    updateEvent(
      id: $id
      name: $name
      description: $description
      venue: $venue
      eventDate: $eventDate
      startTime: $startTime
      endTime: $endTime
      timeDuration: $timeDuration
      entriesCount: $entriesCount
    ) {
      id
      name
    }
  }
`;

export const UPDATE_EVENT_EXPIRED_STATUS = gql`
  mutation UpdateEventExpiredStatus($id: Int!, $isExpired: Boolean!) {
    updateEventExpiredStatus(id: $id, isExpired: $isExpired) {
      id
      isExpired
    }
  }
`;

export const UPDATE_ENTRIES_COUNT = gql`
  mutation UpdateEntriesCount($id: Int!, $entriesCount: Int!) {
    updateEntriesCount(id: $id, entriesCount: $entriesCount)
  }
`;

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: Int!) {
    deleteEvent(id: $id)
  }
`;

export const CREATE_EVENT_VISITOR = gql`
  mutation CreateEventVisitor($eventId: Int!, $email: String!) {
    createEventVisitor(eventId: $eventId, email: $email) {
      id
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_EVENT_VISITOR = gql`
  mutation UpdateEventVisitor($id: Int!, $scanned: Int!) {
    updateEventVisitor(id: $id, scanned: $scanned) {
      id
      scanned
    }
  }
`;

export const DELETE_EVENT_VISITOR = gql`
  mutation DeleteEventVisitor($id: Int!, $email: String!) {
    deleteEventVisitor(id: $id, email: $email)
  }
`;
