/**
 * In-memory data store with JSON file persistence.
 * Stores people, profiles, dating results, and rankings.
 */
import fs from 'fs';
import path from 'path';
import SEED_PEOPLE from './people-seed.js';

const BUNDLED_FILE = path.join(process.cwd(), 'data', 'people.json');
const DATA_FILE = process.env.VERCEL
  ? path.join('/tmp', 'people.json')
  : BUNDLED_FILE;

let store = {
  people: [],
  datingResults: [],
  rankings: {},
  initialized: false
};

function ensureDataDir() {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (err) {
    // Non-fatal if filesystem is read-only (e.g. serverless)
  }
}

function loadStore() {
  if (store.initialized && store.people.length > 0) return store;
  
  ensureDataDir();
  
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      store = { ...data, initialized: true };
    } else if (fs.existsSync(BUNDLED_FILE)) {
      const data = JSON.parse(fs.readFileSync(BUNDLED_FILE, 'utf-8'));
      store = { ...data, initialized: true };
      saveStore();
    } else {
      // Initialize with seed data
      store = {
        people: SEED_PEOPLE,
        datingResults: [],
        rankings: {},
        initialized: true
      };
      saveStore();
    }
  } catch (err) {
    console.error('Error loading store:', err);
    store = {
      people: SEED_PEOPLE,
      datingResults: [],
      rankings: {},
      initialized: true
    };
  }
  
  return store;
}

function saveStore() {
  ensureDataDir();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
  } catch (err) {
    console.error('Error saving store:', err);
  }
}

export function getAllPeople() {
  loadStore();
  return store.people;
}

export function getPersonById(id) {
  loadStore();
  return store.people.find(p => p.id === id) || null;
}

export function addPerson(person) {
  loadStore();
  store.people.push(person);
  saveStore();
  return person;
}

export function updatePerson(id, updates) {
  loadStore();
  const idx = store.people.findIndex(p => p.id === id);
  if (idx !== -1) {
    store.people[idx] = { ...store.people[idx], ...updates };
    saveStore();
    return store.people[idx];
  }
  return null;
}

export function removePerson(id) {
  loadStore();
  store.people = store.people.filter(p => p.id !== id);
  saveStore();
}

export function getDatingResults() {
  loadStore();
  return store.datingResults;
}

export function addDatingResult(result) {
  loadStore();
  store.datingResults.push(result);
  saveStore();
  return result;
}

export function setDatingResults(results) {
  loadStore();
  store.datingResults = results;
  saveStore();
}

export function getRankings() {
  loadStore();
  return store.rankings;
}

export function setRankings(rankings) {
  loadStore();
  store.rankings = rankings;
  saveStore();
}

export function resetStore() {
  store = {
    people: SEED_PEOPLE,
    datingResults: [],
    rankings: {},
    initialized: true
  };
  saveStore();
  return store;
}
