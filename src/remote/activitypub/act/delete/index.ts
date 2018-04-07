import Resolver from '../../resolver';
import deleteNote from './note';
import Post from '../../../../models/post';
import { IRemoteUser } from '../../../../models/user';

/**
 * 削除アクティビティを捌きます
 */
export default async (actor: IRemoteUser, activity): Promise<void> => {
	if ('actor' in activity && actor.account.uri !== activity.actor) {
		throw new Error('invalid actor');
	}

	const resolver = new Resolver();

	const object = await resolver.resolve(activity.object);

	const uri = (object as any).id;

	switch (object.type) {
	case 'Note':
		deleteNote(actor, uri);
		break;

	case 'Tombstone':
		const post = await Post.findOne({ uri });
		if (post != null) {
			deleteNote(actor, uri);
		}
		break;

	default:
		console.warn(`Unknown type: ${object.type}`);
		break;
	}
};