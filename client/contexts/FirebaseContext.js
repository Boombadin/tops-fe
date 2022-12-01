import * as firebase from 'firebase/app';
import isEmpty from 'lodash/isEmpty';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import setFirebase from '@client/config/firebase';

import 'firebase/remote-config';
import 'firebase/performance';
import 'firebase/firestore';

// Init config Firebase
const env = window?.App?.environment;
let setupFirebase = setFirebase.staging;

if (env === 'prod') {
  setupFirebase = setFirebase.prod;
} else if (env === 'uat') {
  setupFirebase = setFirebase.uat;
}

const {
  apiKey,
  authDomain,
  databaseURL,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
} = setupFirebase.config;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  databaseURL: databaseURL,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
};

export const FirebaseContext = createContext();

export function useFirebaseContext() {
  return useContext(FirebaseContext);
}

function FirebaseProvider({ children }) {
  const [remoteConfig, setRemoteConfig] = useState(null);
  const [firestore, setFirestore] = useState(null);

  const getSeasonalConfig = useCallback(async () => {
    if (firestore) {
      const seasonalConfigDoc = await firestore
        .collection('seasonal')
        .doc('config')
        .get();

      if (seasonalConfigDoc.exists) {
        return seasonalConfigDoc.data();
      }
    }

    return {};
  }, [firestore]);

  const getFireStoreConfig = useCallback(
    async fireStoreConfig => {
      if (firestore) {
        const fireStoreConfigDoc = await firestore
          .collection(fireStoreConfig?.collection)
          .doc(fireStoreConfig?.doc)
          .get();

        if (fireStoreConfigDoc.exists) {
          return fireStoreConfigDoc.data();
        }
      }

      return {};
    },
    [firestore],
  );

  const getRemoteConfig = useCallback(
    async key => {
      const remoteValue = await remoteConfig.fetchAndActivate().then(() => {
        return remoteConfig.getValue(key).asString();
      });
      if (!isEmpty(remoteValue)) {
        return remoteValue;
      }
      return '';
    },
    [remoteConfig],
  );

  useEffect(() => {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    // Initialize Performance Monitoring and get a reference to the service
    // firebase.performance();

    const firebaseRemoteConfig = firebase.remoteConfig();
    firebaseRemoteConfig.settings = {
      minimumFetchIntervalMillis: 100,
    };
    setRemoteConfig(firebaseRemoteConfig);
    setFirestore(firebase.firestore());
  }, []);

  const remoteConfigStore = {
    remoteConfig,
    firestore,
    firestoreAction: {
      getSeasonalConfig,
      getRemoteConfig,
      getFireStoreConfig,
    },
  };

  return (
    <FirebaseContext.Provider value={remoteConfigStore}>
      {children}
    </FirebaseContext.Provider>
  );
}

export default FirebaseProvider;
