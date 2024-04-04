import type { PrismaClient } from '@prisma/client';

declare global {
  // var used for global scoping of singleton prisma client
  var prisma: PrismaClient | undefined;
}
