import {
  Location as BaseLocation,
  MarkerInfo as BaseMarkerInfo,
  MarkerInfoWithId as BaseMarkerInfoWithId,
  MARKER_COLLECTION_ID,
  MARKERS_STORAGE_PATH,
} from '@reach4help/model/lib/markers';
import * as firebase from 'firebase/app';

// eslint-disable-next-line import/no-duplicates
import 'firebase/firestore';
// eslint-disable-next-line import/no-duplicates
import 'firebase/storage';
// eslint-disable-next-line import/no-duplicates
import 'firebase/analytics';

export type Location = BaseLocation<firebase.firestore.GeoPoint>;
export type MarkerInfo = BaseMarkerInfo<firebase.firestore.GeoPoint>;
export type MarkerInfoWithId = BaseMarkerInfoWithId<
  firebase.firestore.GeoPoint
>;

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const LOCAL_STORAGE_KEY = 'dataConfig';

interface DataConfig {
  includingHidden: boolean;
}

const getDataConfig = (): DataConfig => {
  const dataConfig = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (dataConfig) {
    return JSON.parse(dataConfig);
  }
  return {
    includingHidden: false,
  };
};

const setDataConfig = (dataConfig: DataConfig) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataConfig));
};

firebase.initializeApp(config);
firebase.analytics();
const db = firebase.firestore();
const markers = db.collection(MARKER_COLLECTION_ID);

export const submitInformation = async (info: MarkerInfo) => {
  await markers.add(info);
};

export interface InformationUpdate {
  loading: boolean;
  markers: Map<string, MarkerInfo>;
  /**
   * True iff the data includes hidden markers that have not yet been
   * reviewed and approved.
   */
  includingHidden: boolean;
}

export type InformationListener = (event: InformationUpdate) => void;

interface CategoryData {
  initialLoadDone: boolean;
  markers: Map<string, MarkerInfo>;
}

const listeners = new Set<InformationListener>();
const state: {
  data: {
    hidden: CategoryData;
    visible: CategoryData;
  };
  includeHidden: boolean;
  loadingOperations: Set<Promise<unknown>>;
  errors: Set<Error>;
} = {
  data: {
    hidden: {
      initialLoadDone: false,
      markers: new Map(),
    },
    visible: {
      initialLoadDone: false,
      markers: new Map(),
    },
  },
  includeHidden: getDataConfig().includingHidden,
  loadingOperations: new Set(),
  errors: new Set(),
};

const getInfoForListeners = (): InformationUpdate => ({
  loading: state.loadingOperations.size > 0,
  markers: new Map([
    ...state.data.visible.markers,
    ...(state.includeHidden ? state.data.hidden.markers : []),
  ]),
  includingHidden: state.includeHidden,
});

const updateListeners = () => {
  const data = getInfoForListeners();
  listeners.forEach(l => l(data));
};

/**
 * Store the promise in state, update listeners,
 * and setup appropriate handlers
 */
const processPromise = (promise: Promise<unknown>) => {
  state.loadingOperations.add(promise);
  updateListeners();
  promise.then(
    () => {
      state.loadingOperations.delete(promise);
      updateListeners();
    },
    err => {
      // eslint-disable-next-line no-console
      console.error(err);
      state.loadingOperations.delete(promise);
      state.errors.add(err);
      updateListeners();
    },
  );
};

export const addInformationListener = (l: InformationListener) => {
  listeners.add(l);
  l(getInfoForListeners());
};

export const removeInformationListener = (l: InformationListener) => {
  listeners.delete(l);
};

const loadInitialDataForMode = (mode: 'hidden' | 'visible') => {
  if (state.data[mode].initialLoadDone) {
    return;
  }
  state.data[mode].initialLoadDone = true;
  const promise = firebase
    .storage()
    .ref(MARKERS_STORAGE_PATH[mode])
    .getDownloadURL()
    .then(async (url: string) => {
      const result = await fetch(url);
      const data: MarkerInfoWithId[] = await result.json();
      for (const marker of data) {
        state.data[mode].markers.set(marker.id, marker);
      }
    });
  processPromise(promise);
  return promise;
};

export const loadInitialData = () => {
  loadInitialDataForMode('visible');
  if (state.includeHidden) {
    loadInitialDataForMode('hidden');
  }
};

export const includingHidden = () => state.includeHidden;

export const includeHiddenMarkers = (include: boolean) => {
  setDataConfig({
    includingHidden: include,
  });
  state.includeHidden = include;
  loadInitialData();
  updateListeners();
};

window.addEventListener('storage', e => {
  if (e.key === LOCAL_STORAGE_KEY) {
    const dataConfig = getDataConfig();
    state.includeHidden = dataConfig.includingHidden;
    loadInitialData();
    updateListeners();
  }
});
