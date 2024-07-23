import { Response, Request } from "express";
import { userCollection } from "../../../db";
export interface ICode {
  code: string;
}

export const confirmRegistrationController = async (
  req: Request<{}, {}, ICode>,
  res: Response<any>,
) => {
  console.log(req.body.code);
  const user = await userCollection.findOne({
    $and: [
      { "emailConfirmation.confirmationCode": req.body.code },
      { "emailConfirmation.isConfirmed": false },
    ],
  });
  console.log(user);
  if (user) {
    const updated = await userCollection.findOneAndUpdate(
      { _id: user._id },
      { $set: { "emailConfirmation.isConfirmed": true } },
      { returnDocument: "after" },
    );
    console.log(updated);
    if (updated?.emailConfirmation.isConfirmed) {
      return res.sendStatus(204);
    } else {
      return res.sendStatus(400);
    }
  }
  return res.sendStatus(400);
};
