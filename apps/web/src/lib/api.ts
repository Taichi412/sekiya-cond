import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8081';

export const api = axios.create({ baseURL: API_BASE });

// Returns
export const getReturnsSummary = async () => (await api.get('/returns/summary')).data;
export const getReturnsSeries = async () => (await api.get('/returns/series')).data;

// News
export const listNews = async () => (await api.get('/announcements')).data;
export const getNews = async (id: string) => (await api.get(`/announcements/${id}`)).data;
export const markNewsRead = async (id: string) => (await api.post(`/announcements/${id}/read`)).data;

// Events
export const listEvents = async () => (await api.get('/events')).data;
export const getEvent = async (id: string) => (await api.get(`/events/${id}`)).data;
export const getRsvp = async (id: string) => (await api.get(`/events/${id}/rsvp`)).data;
export const postRsvp = async (id: string, action: 'join' | 'cancel') => (await api.post(`/events/${id}/rsvp`, { action })).data;
export const eligibleParticipants = async (id: string) => (await api.get(`/events/${id}/eligible-participants`)).data;

// Chat
export const myThread = async () => (await api.get('/chat/threads/me')).data;
export const listMessages = async (threadId: string) => (await api.get(`/chat/threads/${threadId}/messages`)).data;
export const sendMessage = async (threadId: string, text: string) => (await api.post(`/chat/threads/${threadId}/messages`, { text })).data;
export const markRead = async (threadId: string) => (await api.post(`/chat/threads/${threadId}/read`)).data;

// Me
export const getProfile = async () => (await api.get('/me/profile')).data;
export const updateProfile = async (body: any) => (await api.put('/me/profile', body)).data;
export const listFamily = async () => (await api.get('/me/family')).data;
export const addFamily = async (body: any) => (await api.post('/me/family', body)).data;
export const patchFamily = async (id: string, body: any) => (await api.patch(`/me/family/${id}`, body)).data;
export const deleteFamily = async (id: string) => (await api.delete(`/me/family/${id}`)).data;
export const listUnits = async () => (await api.get('/me/units')).data;

