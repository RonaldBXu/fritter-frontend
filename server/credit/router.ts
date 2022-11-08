import type {Request, Response} from 'express';
import express from 'express';
import CreditCollection from './collection';
import UserCollection from '../user/collection';
import * as creditValidator from './middleware';
import * as userValidator from '../user/middleware';
import * as util from './util';

const router = express.Router();

/**
 * View Credit
 *
 * @name GET /api/credits/:username
 *
 * @return {util.CreditResponse} - An object with your credit
 * @throws {400} - If username is empty
 * @throws {404} - If no credit object with associated username username exists
 *
 */
 router.get(
  '/:username?',
  [
    userValidator.isUserLoggedIn,
    creditValidator.doesUserExist,
    creditValidator.doesCreditExist,
  ],
  async (req: Request, res: Response) => {
    const uid = req.params.username as string;
    const username = (await UserCollection.findOneByUserId(req.session.userId)).username;
    const credit = await CreditCollection.findOneByUsername(uid);
    res.status(200).json({
      message: 'Here is the credit object.',
      credit: util.constructCreditResponse(credit),
      currentUser: username,
    });
  }
);

/**
 * Give or take away credit.
 *
 * @name PATCH /api/credits/:other_username
 *
 * @return {credit: util.CreditResponse, otherCredit: util.CreditResponse} - An object with updated credit and otherCredit objects
 * @throws {400} - If other_username is empty
 * @throws {403} - If no user is logged in
 * @throws {404} - If user who is giving/removing credit or user whose credit is changing is not found
 * @throws {412} - If user who is giving/removing credit the same as the user whose credit is changing
 *
 */
 router.patch(
  '/:otherUsername?',
  [
    userValidator.isUserLoggedIn,
    creditValidator.doesOtherUserExist,
    creditValidator.isOtherUserMe,
  ],
  async (req: Request, res: Response) => {
    const username = (await UserCollection.findOneByUserId(req.session.userId)).username;
    const twoCreditObj = await CreditCollection.updateCreditScore(username, req.params.otherUsername);
    res.status(200).json({
      message: 'Credit updated successfully.',
      credit: util.constructCreditResponse(twoCreditObj.credit),
      otherCredit: util.constructCreditResponse(twoCreditObj.otherCredit)
    });
  }
);

export {router as creditRouter};
