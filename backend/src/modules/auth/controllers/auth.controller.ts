import { inject } from 'inversify';
import { BaseHttpController, controller, httpPost, requestBody } from 'inversify-express-utils';

import { applyBodyValidation } from '@modules/core';

import { ACCESS_TOKEN_COOKIE } from '../contants';
import { AuthorizedMiddleware } from '../middlewares';
import { signInBodySchema, signUpBodySchema } from '../schemas';
import { AuthService } from '../services';
import { SignUpUser } from '../types';

@controller('/auth')
export class AuthController extends BaseHttpController {
  @inject(AuthService) private readonly authService: AuthService;

  @httpPost('/sign-in', applyBodyValidation(signInBodySchema))
  async signIn(@requestBody() body: SignUpUser): Promise<void> {
    const accessToken = await this.authService.signIn(body);
    this.setCookie(ACCESS_TOKEN_COOKIE, accessToken);
  }

  @httpPost('/sign-up', applyBodyValidation(signUpBodySchema))
  async signUp(@requestBody() body: SignUpUser): Promise<void> {
    const accessToken = await this.authService.signUp(body);
    this.setCookie(ACCESS_TOKEN_COOKIE, accessToken);
  }

  @httpPost('/sign-out', AuthorizedMiddleware)
  async signOut(): Promise<void> {
    this.clearCookie(ACCESS_TOKEN_COOKIE);
  }

  private setCookie(name: string, value: string): void {
    this.httpContext.response.cookie(name, value, { secure: true });
  }

  private clearCookie(name: string): void {
    this.httpContext.response.clearCookie(name, { secure: true });
  }
}
