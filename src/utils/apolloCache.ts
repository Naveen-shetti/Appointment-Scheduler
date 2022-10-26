import { ApolloCache, FetchResult } from '@apollo/client';
import {
  GetEventsDocument,
  GetEventsQuery,
  InputMaybe,
  FilterInput,
  SaveEventMutation,
  DeleteEventMutation,
} from '../generated/graphql';
import { remove, findIndex, concat } from 'lodash';

export const updateCacheOnSaveEvent = (
  cache: ApolloCache<any>,
  { data }: Omit<FetchResult<SaveEventMutation>, 'context'>,
  filter?: InputMaybe<FilterInput> | undefined
) => {
  const event = data?.saveEvent;

  if (event) {
    const existingEvents = cache.readQuery<GetEventsQuery>({
      query: GetEventsDocument,
      variables: { filter },
    });

    if (existingEvents?.eventsData) {
      let existingEventsCopy = [...existingEvents.eventsData.events];
      const index = findIndex(existingEventsCopy, { id: event.id });

      if (index !== -1) {
        existingEventsCopy.splice(index, 1, event);
      } else {
        existingEventsCopy = concat(event, existingEventsCopy);
      }

      cache.writeQuery<GetEventsQuery>({
        query: GetEventsDocument,
        variables: { filter },
        data: {
          eventsData: {
            ...existingEvents.eventsData,
            events: existingEventsCopy,
          },
        },
      });
    }
  }
};

export const updateCacheOnDeleteEvent = (
  cache: ApolloCache<any>,
  { data }: Omit<FetchResult<DeleteEventMutation>, 'context'>,
  id: string | undefined,
  filter?: InputMaybe<FilterInput> | undefined
) => {
  const success = data?.deleteEvent;

  if (success) {
    const existingEvents = cache.readQuery<GetEventsQuery>({
      query: GetEventsDocument,
      variables: { filter },
    });

    if (existingEvents?.eventsData) {
      const existingEventsCopy = [...existingEvents.eventsData.events];

      remove(existingEventsCopy, { id });

      cache.writeQuery<GetEventsQuery>({
        query: GetEventsDocument,
        variables: { filter },
        data: {
          eventsData: {
            ...existingEvents.eventsData,
            events: existingEventsCopy,
          },
        },
      });
    }
  }
};
