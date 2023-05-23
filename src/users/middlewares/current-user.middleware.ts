import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../users.service';
import { NextFunction, Request } from 'express';
import { User } from '../user.entity';

// declare global {
//   namespace Express {
//     interface Requset {
//       currentUser?: User;
//     }
//   }
// }
// The code above is old style code of the code below
declare module 'express-serve-static-core' {
  interface Request {
    currentUser?: User;
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      const user = (await this.usersService.findOneById(userId)) as User;
      req.currentUser = user;
    }

    next();
  }
}
