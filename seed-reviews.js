import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const hospitals = await prisma.hospital.findMany();
  if (hospitals.length === 0) {
    console.log("No hospitals found. Run initial seed first.");
    return;
  }

  const reviewTexts = [
    "Great service and very clean facilities.",
    "The doctors were very knowledgeable but the wait time was a bit long.",
    "Highly recommended! The surgery went perfectly.",
    "Average experience. Nothing special but acceptable.",
    "Excellent care from the nursing staff. Very attentive."
  ];

  for (const hospital of hospitals) {
    // Generate 2-4 reviews per hospital
    const numReviews = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < numReviews; i++) {
       // Random rating between 3.5 and 5.0
       const rating = Math.round((Math.random() * 1.5 + 3.5) * 10) / 10;
       
       // Random date within last 3 months
       const date = new Date();
       date.setDate(date.getDate() - Math.floor(Math.random() * 90));

       await prisma.review.create({
         data: {
           hospital_id: hospital.id,
           user_name: `Patient ${Math.floor(Math.random() * 1000)}`,
           rating: rating,
           review_text: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
           date: date,
         }
       });
    }
  }
  console.log("Successfully seeded dummy reviews.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
