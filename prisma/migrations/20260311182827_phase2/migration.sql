/*
  Warnings:

  - Added the required column `specializations` to the `Hospital` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Doctor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "experience_years" INTEGER NOT NULL,
    "hospital_id" INTEGER NOT NULL,
    CONSTRAINT "Doctor_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Treatment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "avg_cost" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hospital_id" INTEGER NOT NULL,
    "treatment_id" INTEGER NOT NULL,
    "satisfaction_score" REAL NOT NULL,
    "recovery_days" INTEGER NOT NULL,
    "complication_flag" BOOLEAN NOT NULL,
    CONSTRAINT "Feedback_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Hospital" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "specializations" TEXT NOT NULL
);
INSERT INTO "new_Hospital" ("city", "id", "name", "rating") SELECT "city", "id", "name", "rating" FROM "Hospital";
DROP TABLE "Hospital";
ALTER TABLE "new_Hospital" RENAME TO "Hospital";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
