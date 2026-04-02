
import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../guards/jwt.guard';

// export function Auth(...roles: Role[]) {
//   return applyDecorators(
//     SetMetadata('roles', roles),
//     UseGuards(AuthGuard(), RolesGuard),
//   );
// }

export function Auth() {
  return applyDecorators(
    // SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard),
  );
}