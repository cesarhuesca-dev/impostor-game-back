import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.guard';
// import { AuthGuard } from '@nestjs/passport';

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
