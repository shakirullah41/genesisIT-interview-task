import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class UserIsUserGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const {
      user,
      params: { id },
    } = context.switchToHttp().getRequest();
    if (user.id === parseInt(id)) {
      return true;
    }
    return false;
  }
}
