import { IsEnum, IsString } from 'class-validator';
import { firestore } from 'firebase';
import { firebaseFirestore as db } from 'src/firebaseConfig';

import { GenericPostStatus } from './GenericPostStatus';
import { IGeneralPost } from './IGeneralPost';
import { IResponsePost } from './IResponsePost';
import { Post } from './Post';
import { ResponsePostStatus } from './ResponsePostStatus';

export class GeneralPost extends Post implements IGeneralPost {
  constructor(generalPost: IGeneralPost) {
    super(generalPost);
    this._creatorRef = generalPost.creatorRef;
    this._streetAddress = generalPost.streetAddress;
    this._genericPostStatus = generalPost.genericStatus;
  }

  @IsString()
  private _creatorRef: string;

  get creatorRef(): string {
    return this._creatorRef;
  }

  set creatorRef(creatorRef: string) {
    this._creatorRef = creatorRef;
  }

  @IsEnum(GenericPostStatus)
  private _genericPostStatus: GenericPostStatus;

  get genericStatus(): GenericPostStatus {
    return this._genericPostStatus;
  }

  set genericStatus(status: GenericPostStatus) {
    this._genericPostStatus = status;
  }

  @IsString()
  private _streetAddress: string;

  get streetAddress(): string {
    return this._streetAddress;
  }

  set streetAddress(streetAddress: string) {
    this._streetAddress = streetAddress;
  }

  public static async fromPost(data: Post, path: string): Promise<GeneralPost> {
    const responsesData = await db
      .collection('posts')
      .where('parentRef', '==', db.doc(path))
      .get();

    const participants = [data.creatorRef.id];
    const rejected: string[] = [];

    for (const doc of responsesData.docs) {
      const response = Post.factory(doc.data() as IResponsePost);
      if (response.responseStatus === ResponsePostStatus.rejected) {
        rejected.push(response.creatorRef.id);
      } else {
        participants.push(response.creatorRef.id);
      }
    }

    return new GeneralPost(
      path,
      data.isRequest,
      data.isResponse,
      {
        displayName: data.creatorSnapshot.displayName || '',
        displayPicture: data.creatorSnapshot.displayPicture,
      },
      data.title,
      data.description,
      {
        latitude: data.latLng.latitude,
        longitude: data.latLng.longitude,
      },
      data.creatorRef.path,
      data.status,
      data.streetAddress,
      participants,
      rejected,
      data.createdAt.toDate(),
      data.updatedAt.toDate(),
    );
  }

  public static fromFirestore(
    data: firebase.firestore.DocumentData,
  ): GeneralPost {
    return new GeneralPost(
      (data.postRef as firebase.firestore.DocumentReference).path,
      data.isRequest,
      data.userSnapshot,
      data.title,
      data.description,
      {
        latitude: (data.latLng as firebase.firestore.GeoPoint).latitude,
        longitude: (data.latLng as firebase.firestore.GeoPoint).longitude,
      },
      (data.userRef as firebase.firestore.DocumentReference).path,
      data.status,
      data.streetAddress,
      data.participants,
      data.rejected,
      (data.createdAt as firebase.firestore.Timestamp).toDate(),
      (data.updatedAt as firebase.firestore.Timestamp).toDate(),
    );
  }

  public static fromAlgolia(data: Record<string, any>): GeneralPost {
    return new GeneralPost(
      data.postRef,
      data.isRequest,
      data.creatorSnapshot,
      data.title,
      data.description,
      { latitude: data._geoloc.lat, longitude: data._geoloc.lng },
      data.creatorRef,
      data.status,
      data.streetAddress,
      data.participants,
      data.rejected,
      data.createdAt,
      data.updatedAt,
    );
  }

  public static getObjectId(postPath: string): string {
    return db.doc(postPath).id;
  }

  public static getParticipantId(userPath: string): string {
    return db.doc(userPath).id;
  }

  public static fromObject(data: IGeneralPost): GeneralPost {
    return new GeneralPost(
      data.postRef,
      data.isRequest,
      data.creatorSnapshot,
      data.title,
      data.description,
      data.latLng,
      data.creatorRef,
      data.genericStatus,
      data.streetAddress,
      data.participants,
      data.rejected,
      data.createdAt,
      data.updatedAt,
    );
  }

  toObject(): IGeneralPost {
    return {
      postRef: this.postRef,
      isRequest: this.isRequest,
      creatorSnapshot: this.creatorSnapshot,
      title: this.title,
      description: this.description,
      latLng: this.latLng,
      creatorRef: this.creatorRef,
      genericStatus: this.genericStatus,
      streetAddress: this.streetAddress,
      participants: this.participants,
      rejected: this.rejected,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  toFirestore(): firebase.firestore.DocumentData {
    return {
      postRef: db.doc(this.postRef),
      isRequest: this.isRequest,
      creatorSnapshot: this.creatorSnapshot,
      title: this.title,
      description: this.description,
      latLng: new firestore.GeoPoint(
        this.latLng.latitude,
        this.latLng.longitude,
      ),
      creatorRef: db.doc(this.creatorRef),
      status: this.genericStatus,
      streetAddress: this.streetAddress,
      participants: this.participants,
      rejected: this.rejected,
      createdAt: firestore.Timestamp.fromDate(this.createdAt),
      updatedAt: firestore.Timestamp.fromDate(this.updatedAt),
    };
  }

  toAlgolia(): object {
    return {
      postRef: this.postRef,
      isRequest: this.isRequest,
      objectID: db.doc(this.postRef).id,
      creatorSnapshot: this.creatorSnapshot,
      title: this.title,
      description: this.description,
      _geoloc: {
        lat: this.latLng.latitude,
        lng: this.latLng.longitude,
      },
      creatorRef: this.creatorRef,
      status: this.genericStatus,
      streetAddress: this.streetAddress,
      participants: this.participants,
      rejected: this.rejected,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
