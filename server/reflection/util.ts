import type {HydratedDocument, Types} from 'mongoose';
import type {Reflection} from './model';

// Update this if you add a property to the Credit type!
type ReflectionResponse = {
  _id: string; // MongoDB assigns each object this ID on creation
  freet_content: string;
  associated_user: string;
  public: boolean;
  reflection_content: string;
  original_author: string;
};

/**
 * Transform a raw Reflection object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<Reflection>} reflection - A reflection object
 * @returns {ReflectionResponse} - The reflection object
 */
const constructReflectionResponse = (reflection: HydratedDocument<Reflection>): ReflectionResponse => {
  const reflectionCopy: Reflection = {
    ...reflection.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  return {
    _id: reflectionCopy._id.toString(),
    freet_content: reflectionCopy.freet_content,
    associated_user: reflectionCopy.associated_user.toString(),
    public: reflectionCopy.public,
    reflection_content: reflectionCopy.reflection_content,
    original_author: reflectionCopy.original_author,
  };
};

export {
  constructReflectionResponse,
  ReflectionResponse,
};
