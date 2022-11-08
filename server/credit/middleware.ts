import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import UserCollection from '../user/collection';
import CreditCollection from './collection';

/**
 * Checks if the other user exists in the database.
 */
const doesOtherUserExist = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.otherUsername) {
    res.status(400).json({
      error: 'Other Username cannot be blank.'
    });
    return;
  }
  let user = undefined;
  if (req.params.otherUsername) {
    user = await UserCollection.findOneByUsername(req.params.otherUsername);
  }
  if (!user) {
    res.status(404).json({
      error: 'Other User object was not found.'
    });
    return;
  }
  next();
};

/**
 * Makes sure that the other user is not yourself.
 */
const isOtherUserMe = async (req: Request, res: Response, next: NextFunction) => {
  const other_user = await UserCollection.findOneByUsername(req.params.otherUsername);
  if (other_user._id.toString() === req.session.userId) {
    res.status(412).json({
      error: 'You cannot give/take credit from yourself.'
    });
    return;
  }
  next();
};

/**
 * Checks if a credit object with associated user id id exists
 */
const doesCreditExist = async (req: Request, res: Response, next: NextFunction) => {
  let user = undefined;
  if (req.params.username) {
    user = await CreditCollection.findOneByUsername(req.params.username);
  }
  if (!user) {
    res.status(404).json({
      error: 'Credit object was not found.'
    });
    return;
  }
  next();
};

/**
 * Checks if the other user exists in the database.
 */
const doesUserExist = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.username) {
    res.status(400).json({
      error: 'User id cannot be blank.'
    });
    return;
  }
  next();
}
export {
  doesOtherUserExist,
  isOtherUserMe,
  doesUserExist,
  doesCreditExist,
};
