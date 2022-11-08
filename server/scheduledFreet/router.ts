import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import ScheduledFreetCollection from './collection';
import * as userValidator from '../user/middleware';
import * as scheduledFreetValidator from '../scheduledFreet/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util'
import UserCollection from '../user/collection';

const router = express.Router();

/**
 * Get scheduled freets of logged in user.
 *
 * @name GET /api/scheduledfreets
 *
 * @return {util.ScheduledFreetResponse[]} - An array of scheduled freets
 * @throws {403} - If the user is not logged in
 *
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const username = (await UserCollection.findOneByUserId(req.session.userId)).username;
    const authorScheduledFreets = await ScheduledFreetCollection.findAllByUsername(username);
    const response = authorScheduledFreets.map(util.constructScheduledFreetResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new scheduled freet.
 *
 * @name POST /api/scheduledfreets
 *
 * @param {string} content - The content of the freet
 * @param {Date} publish_date
 * @return {util.ScheduledFreetResponse} - The created freet
 * @throws {400} - If publish_date is empty
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    scheduledFreetValidator.isValidScheduledFreetContent,
    scheduledFreetValidator.isValidDate,
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUserId(req.session.userId); // Will not be an empty string since its validated in isUserLoggedIn
    const scheduledFreet = await ScheduledFreetCollection.addOne(user._id, req.body.content, req.body.publish_date);

    res.status(201).json({
      message: 'Your scheduled freet was created successfully. Please note that the MongoDB trigger for publishing scheduled freets runs once every 2 minutes.',
      scheduledFreet: util.constructScheduledFreetResponse(scheduledFreet)
    });
    return;

  }
);

/**
 * Delete a scheduled freet
 *
 * @name DELETE /api/scheduledfreets/:id
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
    scheduledFreetValidator.isScheduledFreetExists,
    scheduledFreetValidator.isValidScheduledFreetModifier
  ],
  async (req: Request, res: Response) => {
    const scheduledFreet = await ScheduledFreetCollection.deleteOne((await ScheduledFreetCollection.findOne(req.params.freetId))._id);
    res.status(200).json({
      message: 'Your freet was deleted successfully.',
      scheduledFreet: scheduledFreet,
    });
  }
);

/**
 * Modify a scheduled freet
 *
 * @name PATCH /api/scheduledfreets/:id
 *
 * @param {string} content - the new content for the freet
 * @param {Date} publish_date - the new publish date for the freet
 * @return {FreetResponse} - the updated freet
 * @throws {400} - If freetId is empty
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.patch(
  '/:freetId?',
  [
    freetValidator.nullFreet,
    userValidator.isUserLoggedIn,
    scheduledFreetValidator.isScheduledFreetExists,
    scheduledFreetValidator.isValidScheduledFreetModifier,
    scheduledFreetValidator.isValidScheduledFreetContent,
    scheduledFreetValidator.isValidDate,
  ],
  async (req: Request, res: Response) => {
    const scheduledFreet = await ScheduledFreetCollection.updateOne(req.params.freetId, req.body.content, req.body.publish_date);
    res.status(200).json({
      message: 'Your freet was updated successfully.',
      scheduledFreet: util.constructScheduledFreetResponse(scheduledFreet)
    });
  }
);

export { router as scheduledFreetRouter };
