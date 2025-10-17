export enum AccessLevel {
    OWNER = "Proprietário",
    HYBRID = "Administrador & Profissional",
    ADMIN = "Administrador",
    PROFESSIONAL = "Profissional",
    PATIENT = "Paciente",
    PERSONAL = "Profissional Individual"
}

const accessLevelMapper: Record<string, string> = {
    OWNER: AccessLevel.OWNER,
    HYBRID: AccessLevel.HYBRID,
    ADMIN: AccessLevel.ADMIN,
    PROFESSIONAL: AccessLevel.PROFESSIONAL,
    PATIENTS: AccessLevel.PATIENT,
    PERSONAL: AccessLevel.PERSONAL
};

export function mapAccessLevel(level: string, type: string): string | undefined {
    if (type === "PERSONAL") return accessLevelMapper[type]

    return accessLevelMapper[level];
}