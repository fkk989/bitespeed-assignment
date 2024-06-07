import { PrismaClient } from "@prisma/client";

class PrismaSingleton {
  public prisma: PrismaClient;
  private static instance: PrismaSingleton;
  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance = () => {
    if (!PrismaSingleton.instance) {
      PrismaSingleton.instance = new PrismaSingleton();
    }
    return PrismaSingleton.instance;
  };
}

export const prismaClient = PrismaSingleton.getInstance().prisma;
