import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { HostGuard } from '../guards/host.guard';
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

export function AuthHost() {
  return applyDecorators(
    // SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard, HostGuard),
  );
}
