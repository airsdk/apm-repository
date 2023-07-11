import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {

    await prisma.license.upsert({
        where: { index: 1 },
        update: {},
        create: {
            index: 1,
            type: 'none',
            public: true
        }
    });
    await prisma.license.upsert({
        where: { index: 2 },
        update: {},
        create: {
            index: 2,
            type: 'airnativeextensions',
            url: 'https://airnativeextensions.com/license',
            public: false
        }
    });
    await prisma.license.upsert({
        where: { index: 3 },
        update: {},
        create: {
            index: 3,
            type: 'MIT',
            url: 'https://opensource.org/licenses/MIT',
            public: true
        }
    });
    await prisma.license.upsert({
        where: { index: 4 },
        update: {},
        create: {
            index: 4,
            type: 'airnativeextensions - public',
            url: 'https://airnativeextensions.com/license',
            public: true
        }
    });
    await prisma.license.upsert({
        where: { index: 5 },
        update: {},
        create: {
            index: 5,
            type: 'Simplified BSD',
            url: 'https://github.com/Gamua/Starling-Framework/blob/master/LICENSE.md',
            public: true
        }
    });
    await prisma.license.upsert({
        where: { index: 6 },
        update: {},
        create: {
            index: 6,
            type: 'BSD',
            public: true
        }
    });

    await prisma.platform.upsert({
        where: { index: 1 },
        update: {},
        create: {
            index: 1,
            name: 'android'
        }
    });
    await prisma.platform.upsert({
        where: { index: 2 },
        update: {},
        create: {
            index: 2,
            name: 'ios'
        }
    });
    await prisma.platform.upsert({
        where: { index: 3 },
        update: {},
        create: {
            index: 3,
            name: 'windows'
        }
    });
    await prisma.platform.upsert({
        where: { index: 4 },
        update: {},
        create: {
            index: 4,
            name: 'macos'
        }
    });
    await prisma.platform.upsert({
        where: { index: 5 },
        update: {},
        create: {
            index: 5,
            name: 'linux'
        }
    });

}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    });
