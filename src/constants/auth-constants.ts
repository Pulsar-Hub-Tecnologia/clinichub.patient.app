// Simplified for patient-only access
export enum AccessLevel {
    PATIENT = "Paciente"
}

const accessLevelMapper: Record<string, string> = {
    PATIENT: AccessLevel.PATIENT
};

export function mapAccessLevel(level: string): string | undefined {
    return accessLevelMapper[level] || AccessLevel.PATIENT;
}