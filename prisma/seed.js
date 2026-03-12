import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Cleaning old data...");
    await prisma.bill.deleteMany();
    await prisma.feedback.deleteMany();
    await prisma.doctor.deleteMany();
    await prisma.hospital.deleteMany();
    await prisma.treatment.deleteMany();

    console.log("Seeding Treatments...");
    const t1 = await prisma.treatment.create({ data: { name: "Knee Replacement Surgery", specialization: "Orthopedics", avg_cost: 210000 } });
    const t2 = await prisma.treatment.create({ data: { name: "Heart Bypass Surgery", specialization: "Cardiology", avg_cost: 500000 } });
    const t3 = await prisma.treatment.create({ data: { name: "Cataract Surgery", specialization: "Ophthalmology", avg_cost: 45000 } });

    console.log("Seeding Hospitals...");
    const h1 = await prisma.hospital.create({
        data: {
            name: "Apollo Delhi", city: "Delhi", rating: 4.8, specializations: "Cardiology,Orthopedics",
            type: "Private", beds: 500, nabh_status: true, distance: 12.5, success_rate: 94.5
        }
    });

    const h2 = await prisma.hospital.create({
        data: {
            name: "Safdarjung Hospital", city: "Delhi", rating: 4.0, specializations: "Orthopedics,General Surgery",
            type: "Government", beds: 1530, nabh_status: true, distance: 8.0, success_rate: 88.0
        }
    });

    const h3 = await prisma.hospital.create({
        data: {
            name: "Fortis Escorts", city: "Delhi", rating: 4.6, specializations: "Cardiology,Ophthalmology",
            type: "Private", beds: 310, nabh_status: true, distance: 15.2, success_rate: 91.2
        }
    });

    console.log("Seeding Doctors...");
    await prisma.doctor.createMany({
        data: [
            { name: "Dr. A. Sharma", specialization: "Orthopedics", experience_years: 15, hospital_id: h1.id },
            { name: "Dr. R. Gupta", specialization: "Cardiology", experience_years: 22, hospital_id: h1.id },
            { name: "Dr. S. Singh", specialization: "Orthopedics", experience_years: 8, hospital_id: h2.id },
            { name: "Dr. K. Verma", specialization: "Cardiology", experience_years: 18, hospital_id: h3.id },
        ]
    });

    console.log("Seeding Historical Bills...");
    const billData = [];
    // Knee Replacement at Apollo (h1)
    for (let i = 0; i < 5; i++) {
        billData.push({ hospital_id: h1.id, treatment_id: t1.id, total_cost: 280000 + (Math.random() * 40000), implant_cost: 120000, room_charges: 50000 });
    }
    // Knee Replacement at Safdarjung (h2)
    for (let i = 0; i < 5; i++) {
        billData.push({ hospital_id: h2.id, treatment_id: t1.id, total_cost: 140000 + (Math.random() * 20000), implant_cost: 80000, room_charges: 10000 });
    }
    // Bypass at Apollo (h1)
    for (let i = 0; i < 5; i++) {
        billData.push({ hospital_id: h1.id, treatment_id: t2.id, total_cost: 550000 + (Math.random() * 50000), implant_cost: 200000, room_charges: 100000 });
    }
    // Bypass at Fortis (h3)
    for (let i = 0; i < 5; i++) {
        billData.push({ hospital_id: h3.id, treatment_id: t2.id, total_cost: 490000 + (Math.random() * 40000), implant_cost: 180000, room_charges: 80000 });
    }

    await prisma.bill.createMany({ data: billData });

    console.log("Seeding Feedback...");
    const feedbackData = [];
    // Feedback for h1
    for (let i = 0; i < 10; i++) feedbackData.push({ hospital_id: h1.id, treatment_id: t1.id, satisfaction_score: 4.5 + (Math.random() * 0.5), recovery_days: 14, complication_flag: Math.random() > 0.95 });
    // Feedback for h2
    for (let i = 0; i < 10; i++) feedbackData.push({ hospital_id: h2.id, treatment_id: t1.id, satisfaction_score: 3.8 + (Math.random() * 0.7), recovery_days: 18, complication_flag: Math.random() > 0.85 });

    await prisma.feedback.createMany({ data: feedbackData });

    console.log("Database seeded successfully with historical context!");
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
