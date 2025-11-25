import { Patient, PatientWorkspace } from "@/context/auth-context";
import { decryptData, encryptData } from "@/utils/encrypt";
import Cookies from "js-cookie";

export enum PatientCookieName {
  TOKEN = "patient_token",
  AUTH = "patient_auth",
}

type AuthData = { patient: Patient | undefined; workspaces: PatientWorkspace[] };

export class CookieController {
  static set(name: PatientCookieName.AUTH, value: AuthData, days?: number): void;
  static set(name: Exclude<PatientCookieName, PatientCookieName.AUTH>, value: string | object, days?: number): void;
  static set(name: PatientCookieName, value: any, days?: number): void {
    let dataToStore: string;

    if (name === PatientCookieName.AUTH) {
      dataToStore = encryptData(value);
    } else {
      dataToStore = typeof value === "string" ? value : JSON.stringify(value);
    }

    Cookies.set(name, dataToStore, {
      expires: days,
      secure: true
    });
  }

  static get(name: PatientCookieName.AUTH): AuthData | undefined;
  static get(name: Exclude<PatientCookieName, PatientCookieName.AUTH>): string | undefined;
  static get(name: PatientCookieName): any {
    const storedValue = Cookies.get(name);
    if (!storedValue) return undefined;

    if (name === PatientCookieName.AUTH) {
      return decryptData<AuthData>(storedValue);
    }

    return storedValue;
  }

  static remove(name: PatientCookieName): void {
    Cookies.remove(name, { secure: true });
  }
}
