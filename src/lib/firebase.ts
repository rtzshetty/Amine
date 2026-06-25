import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Series, Episode } from '../types';

const app = initializeApp(firebaseConfig);
export { app };
export const db = getFirestore(app, 'ai-studio-661b38df-2888-448c-be82-cb25bb1bf371');

export const getPublishedSeries = async (): Promise<Series[]> => {
  const q = query(collection(db, 'series'));
  const snapshot = await getDocs(q);
  const series = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Series));
  return series.filter(s => s.publish_status === 'published').sort((a, b) => b.created_at - a.created_at);
};

export const getAllSeries = async (): Promise<Series[]> => {
  const snapshot = await getDocs(collection(db, 'series'));
  const series = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Series));
  return series.sort((a, b) => b.created_at - a.created_at);
};

export const getEpisodes = async (seriesId: string): Promise<Episode[]> => {
  const q = query(collection(db, 'episodes'), where('series_id', '==', seriesId));
  const snapshot = await getDocs(q);
  const episodes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Episode));
  return episodes.sort((a, b) => a.episode_number - b.episode_number);
};

export const addSeries = async (series: Omit<Series, 'id' | 'created_at'>) => {
  const data = { ...series, created_at: Date.now() };
  return addDoc(collection(db, 'series'), data);
};

export const updateSeries = async (id: string, updates: Partial<Series>) => {
  return updateDoc(doc(db, 'series', id), updates);
};

export const deleteSeries = async (id: string) => {
  return deleteDoc(doc(db, 'series', id));
};

export const addEpisode = async (episode: Omit<Episode, 'id' | 'created_at'>) => {
  const data = { ...episode, created_at: Date.now() };
  return addDoc(collection(db, 'episodes'), data);
};

export const updateEpisode = async (id: string, updates: Partial<Episode>) => {
  return updateDoc(doc(db, 'episodes', id), updates);
};

export const deleteEpisode = async (id: string) => {
  return deleteDoc(doc(db, 'episodes', id));
};
