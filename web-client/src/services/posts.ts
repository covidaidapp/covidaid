import { isDefined } from 'class-validator';
import { firestore as firestoreNamespace } from 'firebase';
import { firebaseFirestore } from 'src/firebaseConfig';
import { Post } from 'src/models/posts/Post';
import { PostFirestoreConverter } from 'src/models/posts/PostFirestoreConverter';
import { PostStatus } from 'src/models/posts/PostStatus';
import { User } from 'src/models/users';

export const createPost = async (postPayload: Post) => {
  const tempPost = Post.factory(postPayload);
  tempPost.createdAt = firestoreNamespace.Timestamp.fromDate(new Date());
  tempPost.updatedAt = tempPost.createdAt;
  const postId = `P-${new Date().getTime().toString()}`;
  return firebaseFirestore
    .collection('posts')
    .doc(postId)
    .withConverter(PostFirestoreConverter)
    .set(tempPost);
};

export const updatePost = async (postPayload: Post, postId: string) =>
  firebaseFirestore
    .collection('posts')
    .doc(postId)
    .withConverter(PostFirestoreConverter)
    .set(postPayload);

export const observePosts = (
  nextValue: Function,
  {
    isRequest,
    offeringHelp,
    status,
    userRef,
  }: {
    isRequest?: boolean;
    offeringHelp?: boolean;
    status?: string;
    userRef?: firebase.firestore.DocumentReference<User>;
  },
): firebase.Unsubscribe => {
  let filter: firebase.firestore.Query<firestoreNamespace.DocumentData> = firebaseFirestore.collection(
    'posts',
  );

  if (userRef) {
    filter = filter.where('creatorRef', '==', userRef);
  }

  if (isDefined(isRequest)) {
    filter = filter.where('isRequest', '==', isRequest);
  }

  if (isDefined(offeringHelp)) {
    filter = filter.where('isRequest', '==', !offeringHelp);
  }

  if (status) {
    const statusArray: string[] = [];
    if (status === 'Open' || status === 'Active') {
      statusArray.push(PostStatus.ongoing);
      statusArray.push(PostStatus.pending);
      statusArray.push(PostStatus.open);
      statusArray.push(PostStatus.active);
    }
    if (status === 'Closed') {
      statusArray.push(PostStatus.completed);
      statusArray.push(PostStatus.closed);
      statusArray.push(PostStatus.removed);
    }
    filter = filter.where('status', 'in', statusArray);
  }

  return filter
    .withConverter(PostFirestoreConverter)
    .onSnapshot(snap => nextValue(snap));
};
