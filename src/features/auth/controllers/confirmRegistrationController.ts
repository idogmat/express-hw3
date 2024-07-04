import { Response, Request } from 'express'
import { userCollection } from '../../../app';
export interface ICode {
  code: string
}

export const confirmRegistrationController = async (req: Request<{}, {}, {}, ICode>, res: Response<any>) => {
  const user = await userCollection.findOne({'emailConfirmation.confirmationCode': req.query.code})
  console.log(user)
  if (!user?.emailConfirmation?.isConfirmed) {
    const updated = await userCollection.findOneAndUpdate(
      {'emailConfirmation.confirmationCode': req.query.code},
      {$set:{'emailConfirmation.isConfirmed': true}},
      { returnDocument: 'after'});

    if (updated?.emailConfirmation.isConfirmed) {
      return res.sendStatus(204)
    } else {
      return res.sendStatus(400)
    }
  }
  return res.sendStatus(400)
}