/*
  Warnings:

  - Added the required column `TipoRegistro` to the `historialacciones` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `Accion` on the `historialacciones` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "historial_acciones" AS ENUM ('Creacion', 'Modificacion', 'Eliminacion', 'Generacion_Reporte');

-- CreateEnum
CREATE TYPE "historial_TipoRegistro" AS ENUM ('Asignatura', 'Asistencia', 'Calificacion', 'Curso', 'Estudiante', 'Profesor', 'Usuario');

-- AlterTable
ALTER TABLE "asignatura" ADD COLUMN     "estaActivo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "historialacciones" ADD COLUMN     "IdRegistroManipulado" VARCHAR(36),
ADD COLUMN     "TipoRegistro" "historial_TipoRegistro" NOT NULL,
DROP COLUMN "Accion",
ADD COLUMN     "Accion" "historial_acciones" NOT NULL;

-- AlterTable
ALTER TABLE "usuario" ALTER COLUMN "Edad" SET DEFAULT 0;
