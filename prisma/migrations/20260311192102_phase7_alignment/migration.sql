-- CreateTable
CREATE TABLE "Bill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hospital_id" INTEGER NOT NULL,
    "treatment_id" INTEGER NOT NULL,
    "total_cost" REAL NOT NULL,
    "implant_cost" REAL NOT NULL,
    "room_charges" REAL NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Bill_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Bill_treatment_id_fkey" FOREIGN KEY ("treatment_id") REFERENCES "Treatment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Hospital" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "specializations" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Private',
    "beds" INTEGER NOT NULL DEFAULT 100,
    "nabh_status" BOOLEAN NOT NULL DEFAULT false,
    "distance" REAL NOT NULL DEFAULT 5.0,
    "success_rate" REAL NOT NULL DEFAULT 85.0
);
INSERT INTO "new_Hospital" ("city", "id", "name", "rating", "specializations") SELECT "city", "id", "name", "rating", "specializations" FROM "Hospital";
DROP TABLE "Hospital";
ALTER TABLE "new_Hospital" RENAME TO "Hospital";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
