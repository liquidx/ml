import { ObjectId } from 'mongodb';

export interface Like {
	_id: ObjectId;
	userId: string;
	text: string;
	embedding: number[];
}
