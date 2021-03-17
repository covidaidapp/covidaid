import { firestore as FirestoreNamespace } from 'firebase';
import {
  firebaseFirestore,
  firebaseFunctions,
  firebaseStorage,
} from 'src/firebaseConfig';
import {
  PrivilegedUserInformation,
  PrivilegedUserInformationFirestoreConverter,
} from 'src/models/users/privilegedInformation';
import { User } from 'src/models/users/User';
import { UserFirestoreConverter } from 'src/models/users/UserFirestoreConverter';

import { IgetUserProfile } from './types';

export const getUserProfile = (
  payload: IgetUserProfile,
): Promise<[
  FirestoreNamespace.DocumentSnapshot,
  FirestoreNamespace.DocumentSnapshot,
]> =>
  Promise.all([
    firebaseFirestore
      .collection('users')
      .doc(payload.uid)
      .withConverter(UserFirestoreConverter)
      .get(),
    firebaseFirestore
      .collection('users')
      .doc(payload.uid)
      .collection('privilegedInformation')
      .doc(payload.uid)
      .withConverter(PrivilegedUserInformationFirestoreConverter)
      .get(),
  ]);

export const observePrivileged = (
  nextValue: Function,
  payload: IgetUserProfile,
): firebase.Unsubscribe =>
  firebaseFirestore
    .collection('users')
    .doc(payload.uid)
    .collection('privilegedInformation')
    .doc(payload.uid)
    .withConverter(PrivilegedUserInformationFirestoreConverter)
    .onSnapshot(snap => nextValue(snap));

export const observeProfile = (
  nextValue: Function,
  payload: IgetUserProfile,
): firebase.Unsubscribe =>
  firebaseFirestore
    .collection('users')
    .doc(payload.uid)
    .withConverter(UserFirestoreConverter)
    .onSnapshot(snap => nextValue(snap));

export const setUserProfile = async ({
  uid,
  userPayload,
  privilegedPayload,
}: {
  uid: string;
  userPayload: User;
  privilegedPayload: PrivilegedUserInformation;
}) => {
  await firebaseFirestore
    .collection('users')
    .doc(uid)
    .withConverter(UserFirestoreConverter)
    .set(userPayload);
  return firebaseFirestore
    .collection('users')
    .doc(uid)
    .collection('privilegedInformation')
    .doc(uid)
    .withConverter(PrivilegedUserInformationFirestoreConverter)
    .set(privilegedPayload);
};

export const updateUserProfileData = async ({
  uid,
  userPayload,
}: {
  uid: string;
  userPayload: User;
}) =>
  firebaseFirestore
    .collection('users')
    .doc(uid)
    .withConverter(UserFirestoreConverter)
    .set(userPayload);

export const updateUserPrivilegedInformationData = async ({
  uid,
  dataPayload,
}: {
  uid: string;
  dataPayload: PrivilegedUserInformation;
}) =>
  firebaseFirestore
    .collection('users')
    .doc(uid)
    .collection('privilegedInformation')
    .doc(uid)
    .withConverter(PrivilegedUserInformationFirestoreConverter)
    .set(dataPayload);

export const deleteUserData = async () =>
  firebaseFunctions.httpsCallable('https-api-users-deleteUserData')();

export const uploadUserAvatarData = async ({
  userRef,
  userPayload,
  filePayload,
}: {
  userRef: FirestoreNamespace.DocumentReference<User>;
  userPayload: User;
  filePayload: File;
}) => {
  const storageRef = firebaseStorage.ref();
  const date = Date.now();
  const fileExt = filePayload.type.split('/')[1];
  const snapshot = await storageRef
    .child(`/${userRef.id}/displayPicture/${date}.${fileExt}`)
    .put(filePayload, { contentType: 'image/*' });
  const newUserPayload = userPayload;
  newUserPayload.displayPicture = snapshot.downloadURL;
  const newUserWithAvatar = User.factory(newUserPayload);
  return userRef.set(newUserWithAvatar);
};

export const deleteUserAvatarData = async ({
  userRef,
  userPayload,
}: {
  userRef: FirestoreNamespace.DocumentReference<User>;
  userPayload: User;
}) => {
  const newUserWithoutAvatar = User.factory(userPayload);
  if (userPayload.displayPicture) {
    const fileRef = firebaseStorage
      .ref()
      .storage.refFromURL(userPayload.displayPicture);
    fileRef.getDownloadURL().then(() => {
      newUserWithoutAvatar.displayPicture = null;
    });
  }
  return userRef.set(newUserWithoutAvatar);
};
