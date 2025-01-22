import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

async function seedNationalities() {
    try {
        const existingNationalities = await prisma.nationality.findMany();
        if (existingNationalities.length === 0) {
            await prisma.nationality.createMany({
                data: [
                    { code: "V", description: "Venezolano" },
                    { code: "E", description: "Extranjero" },
                ],
            });
            console.log("Nationalities seeded successfully.");
        }
    } catch (error) {
        console.error("Error seeding nationalities:", error);
    }
}

seedNationalities();