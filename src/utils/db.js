import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getLocations = async () => {
  return await prisma.location.findMany();
};

export const addLocation = async (location) => {
  return await prisma.location.create({ data: location });
};

export const deleteLocation = async (id) => {
  return await prisma.location.delete({ where: { id } });
};
