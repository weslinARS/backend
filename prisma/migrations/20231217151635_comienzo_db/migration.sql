CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- CreateEnum
CREATE TYPE "usuario_Rol" AS ENUM ('Master', 'Profesor', 'Estudiante');

-- CreateEnum
CREATE TYPE "usuario_genero" AS ENUM ('Masculino', 'Femenino');

-- CreateTable
CREATE TABLE "asignacion" (
    "IdAsignacion" SERIAL NOT NULL,
    "IdAsignatura" VARCHAR(36) NOT NULL,
    "PonderacionMaxima" REAL NOT NULL,
    "NombreAsignacion" VARCHAR(50) NOT NULL,
    "TipoAsignacion" VARCHAR(50) NOT NULL,
    "FechaAsignacion" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FechaEntrega" DATE NOT NULL,
    "Version" INTEGER NOT NULL DEFAULT 0,
    "FechaMod" DATE,

    CONSTRAINT "asignacion_pkey" PRIMARY KEY ("IdAsignacion")
);

-- CreateTable
CREATE TABLE "asignatura" (
    "IdAsignatura" VARCHAR(36) NOT NULL DEFAULT (uuid_generate_v4()),
    "IdCurso" VARCHAR(36) NOT NULL,
    "IdProfesor" VARCHAR(36) NOT NULL,
    "Nombre" VARCHAR(50) NOT NULL,
    "Descripcion" TEXT,

    CONSTRAINT "asignatura_pkey" PRIMARY KEY ("IdAsignatura")
);

-- CreateTable
CREATE TABLE "asistencia" (
    "IdAsistencia" SERIAL NOT NULL,
    "IdEstudiante" VARCHAR(36) NOT NULL,
    "IdAsignatura" VARCHAR(36) NOT NULL,
    "column_name" INTEGER,
    "Version" INTEGER NOT NULL DEFAULT 0,
    "FechaMod" DATE,
    "EstaPresente" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "asistencia_pkey" PRIMARY KEY ("IdAsistencia")
);

-- CreateTable
CREATE TABLE "calificacion" (
    "IdCalificacion" SERIAL NOT NULL,
    "IdEstudiante" VARCHAR(36) NOT NULL,
    "IdAsignacion" INTEGER NOT NULL,
    "Version" INTEGER NOT NULL DEFAULT 0,
    "FechaMod" DATE,
    "Calificacion" REAL NOT NULL DEFAULT 0,
    "FechaAgregacion" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calificacion_pkey" PRIMARY KEY ("IdCalificacion")
);

-- CreateTable
CREATE TABLE "credenciales" (
    "IdCredenciales" SERIAL NOT NULL,
    "CorreoUsuario" VARCHAR(100) NOT NULL,
    "ContraseniaUsuario" VARCHAR(100) NOT NULL,
    "IdUsuario" VARCHAR(36) NOT NULL,

    CONSTRAINT "credenciales_pkey" PRIMARY KEY ("IdCredenciales")
);

-- CreateTable
CREATE TABLE "curso" (
    "IdCurso" VARCHAR(36) NOT NULL DEFAULT (uuid_generate_v4()),
    "IdProfesorGuia" VARCHAR(36) NOT NULL,
    "NombreCurso" VARCHAR(25) NOT NULL,
    "DescripcionCurso" TEXT,

    CONSTRAINT "curso_pkey" PRIMARY KEY ("IdCurso")
);

-- CreateTable
CREATE TABLE "estudiante" (
    "IdEstudiante" VARCHAR(36) NOT NULL DEFAULT (uuid_generate_v4()),
    "IdUsuario" VARCHAR(36) NOT NULL,
    "IdCurso" VARCHAR(36) NOT NULL,

    CONSTRAINT "estudiante_pkey" PRIMARY KEY ("IdEstudiante")
);

-- CreateTable
CREATE TABLE "historialacciones" (
    "IdAccion" SERIAL NOT NULL,
    "IdUsuario" VARCHAR(36) NOT NULL,
    "Accion" VARCHAR(50) NOT NULL,
    "FechaEjecucion" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historialacciones_pkey" PRIMARY KEY ("IdAccion")
);

-- CreateTable
CREATE TABLE "profesor" (
    "IdProfesor" VARCHAR(36) NOT NULL DEFAULT (uuid_generate_v4()),
    "IdUsuario" VARCHAR(36) NOT NULL,
    "CedulaIdentidad" VARCHAR(30) NOT NULL,

    CONSTRAINT "profesor_pkey" PRIMARY KEY ("IdProfesor")
);

-- CreateTable
CREATE TABLE "usuario" (
    "IdUsuario" VARCHAR(36) NOT NULL DEFAULT (uuid_generate_v4()),
    "NombreUsuario" VARCHAR(50) NOT NULL,
    "Apellido" VARCHAR(50),
    "Rol" "usuario_Rol" NOT NULL,
    "CorreoElectronico" VARCHAR(100) NOT NULL,
    "FechaNacimiento" DATE NOT NULL,
    "Version" INTEGER NOT NULL DEFAULT 0,
    "FechaModificacion" DATE,
    "genero" "usuario_genero" NOT NULL,
    "Edad" INTEGER NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("IdUsuario")
);

-- CreateIndex
CREATE INDEX "asignacion_asignatura_IdAsignatura_fk" ON "asignacion"("IdAsignatura");

-- CreateIndex
CREATE INDEX "asignatura_curso_IdCurso_fk" ON "asignatura"("IdCurso");

-- CreateIndex
CREATE INDEX "asignatura_profesor_IdProfesor_fk" ON "asignatura"("IdProfesor");

-- CreateIndex
CREATE INDEX "asistencia_asignatura_IdAsignatura_fk" ON "asistencia"("IdAsignatura");

-- CreateIndex
CREATE INDEX "asistencia_estudiante_IdEstudiante_fk" ON "asistencia"("IdEstudiante");

-- CreateIndex
CREATE INDEX "calificacion_asignacion_IdAsignacion_fk" ON "calificacion"("IdAsignacion");

-- CreateIndex
CREATE INDEX "calificacion_estudiante_IdEstudiante_fk" ON "calificacion"("IdEstudiante");

-- CreateIndex
CREATE UNIQUE INDEX "credenciales_pk" ON "credenciales"("IdUsuario");

-- CreateIndex
CREATE INDEX "credenciales_usuario_IdUsuario_fk" ON "credenciales"("IdUsuario");

-- CreateIndex
CREATE INDEX "curso_profesor_IdProfesor_fk" ON "curso"("IdProfesorGuia");

-- CreateIndex
CREATE UNIQUE INDEX "estudiante_pk" ON "estudiante"("IdUsuario");

-- CreateIndex
CREATE INDEX "Estudiante_usuario_IdUsuario_fk" ON "estudiante"("IdUsuario");

-- CreateIndex
CREATE INDEX "estudiante_curso_IdCurso_fk" ON "estudiante"("IdCurso");

-- CreateIndex
CREATE INDEX "historialAcciones_usuario_IdUsuario_fk" ON "historialacciones"("IdUsuario");

-- CreateIndex
CREATE UNIQUE INDEX "profesor_pk2" ON "profesor"("IdUsuario");

-- CreateIndex
CREATE UNIQUE INDEX "profesor_pk" ON "profesor"("CedulaIdentidad");

-- CreateIndex
CREATE INDEX "Profesor_usuario_IdUsuario_fk" ON "profesor"("IdUsuario");

-- AddForeignKey
ALTER TABLE "asignacion" ADD CONSTRAINT "asignacion_asignatura_relation" FOREIGN KEY ("IdAsignatura") REFERENCES "asignatura"("IdAsignatura") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "asignatura" ADD CONSTRAINT "asignatura_curso_relation" FOREIGN KEY ("IdCurso") REFERENCES "curso"("IdCurso") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "asignatura" ADD CONSTRAINT "asignatura_profesor_relation" FOREIGN KEY ("IdProfesor") REFERENCES "profesor"("IdProfesor") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "asistencia" ADD CONSTRAINT "asistencia_asignatura_relation" FOREIGN KEY ("IdAsignatura") REFERENCES "asignatura"("IdAsignatura") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "asistencia" ADD CONSTRAINT "asistencia_estudiante_relation" FOREIGN KEY ("IdEstudiante") REFERENCES "estudiante"("IdEstudiante") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "calificacion" ADD CONSTRAINT "calificacion_asignacion_relation" FOREIGN KEY ("IdAsignacion") REFERENCES "asignacion"("IdAsignacion") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "calificacion" ADD CONSTRAINT "calificacion_estudiante_relation" FOREIGN KEY ("IdEstudiante") REFERENCES "estudiante"("IdEstudiante") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "credenciales" ADD CONSTRAINT "credenciales_usuario_relation" FOREIGN KEY ("IdUsuario") REFERENCES "usuario"("IdUsuario") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "curso" ADD CONSTRAINT "curso_profesor_relation" FOREIGN KEY ("IdProfesorGuia") REFERENCES "profesor"("IdProfesor") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "estudiante" ADD CONSTRAINT "estudiante_usuario_relation" FOREIGN KEY ("IdUsuario") REFERENCES "usuario"("IdUsuario") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "estudiante" ADD CONSTRAINT "estudiante_curso_relation" FOREIGN KEY ("IdCurso") REFERENCES "curso"("IdCurso") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "historialacciones" ADD CONSTRAINT "historialAcciones_usuario_relation" FOREIGN KEY ("IdUsuario") REFERENCES "usuario"("IdUsuario") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "profesor" ADD CONSTRAINT "profesor_usuario_relation" FOREIGN KEY ("IdUsuario") REFERENCES "usuario"("IdUsuario") ON DELETE RESTRICT ON UPDATE RESTRICT;
