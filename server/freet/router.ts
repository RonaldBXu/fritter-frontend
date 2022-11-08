import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import FreetCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';
import CooldownCollection from '../cooldown/collection';

const router = express.Router();

/**
 * Get all the freets
 *
 * @name GET /api/freets
 *
 * @return {FreetResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 */
/**
 * Get freets by author.
 *
 * @name GET /api/freets?author=username
 *
 * @return {FreetResponse[]} - An array of freets created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }

    const allFreets = await FreetCollection.findAll();
    const response = allFreets.map(util.constructFreetResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorFreets = await FreetCollection.findAllByUsername(req.query.author as string);
    const response = authorFreets.map(util.constructFreetResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new freet.
 *
 * @name POST /api/freets
 *
 * @param {string} content - The content of the freet
 * @param {string} replyingTo - The id of the freet that this freet is replying to
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isValidFreetContent,
    freetValidator.isValidReplyingFreet,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    let freet;
    if (req.body.replyingTo && req.body.replyingTo.length !== 0) {
      freet = await FreetCollection.addReply(userId, req.body.content, req.body.replyingTo);
    } else {
      freet = await FreetCollection.addOne(userId, req.body.content);
    }
    await CooldownCollection.addOne(freet._id);
    res.status(201).json({
      message: 'Your freet was created successfully.',
      freet: util.constructFreetResponse(freet)
    });
    return;

  }
);

/**
 * Delete a freet
 *
 * @name DELETE /api/freets/:id
 *
 * @return {string} - A success message and the "deleted" freet
 * @throws {400} - If freetId is empty
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:freetId?',
  [
    freetValidator.nullFreet,
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier
  ],
  async (req: Request, res: Response) => {
    const freet = await FreetCollection.safeDeleteOne((await FreetCollection.findOne(req.params.freetId))._id);
    res.status(200).json({
      message: 'Your freet was deleted successfully.',
      freet: util.constructFreetResponse(freet)
    });
  }
);

/**
 * Modify a freet
 *
 * @name PATCH /api/freets/:id
 *
 * @param {string} content - the new content for the freet
 * @return {FreetResponse} - the updated freet
 * @throws {400} - if freetId is empty
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.patch(
  '/:freetId?',
  [
    freetValidator.nullFreet,
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
    freetValidator.isValidFreetContent
  ],
  async (req: Request, res: Response) => {
    const freet = await FreetCollection.updateOne(req.params.freetId, req.body.content);
    res.status(200).json({
      message: 'Your freet was updated successfully.',
      freet: util.constructFreetResponse(freet)
    });
  }
);

/**
 * View Freet
 *
 * @name GET /api/freets/:id
 *
 * @return {util.FreetResponse} - An object with freet info
 * @throws {400} - If freetId is empty
 * @throws {404} - If no freet object with freet id id exists
 *
 */
router.get(
  '/:freetId?',
  [
    freetValidator.nullFreet,
    freetValidator.isFreetExists,
  ],
  async (req: Request, res: Response) => {
    const freetThread = await FreetCollection.findThread(req.params.freetId);
    res.status(200).json({
      message: 'Here is the freet object.',
      thread: freetThread,
    });
  }
);

export { router as freetRouter };
