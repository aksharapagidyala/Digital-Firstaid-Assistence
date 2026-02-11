
export type Language = 'en' | 'hi' | 'bn' | 'te' | 'mr' | 'ta';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  height: number; // in cm
  gender: 'male' | 'female' | 'other';
  age: number;
}

export interface HealthLog {
  id: string;
  userId: string;
  timestamp: string;
  weight: number;
  systolic: number;
  diastolic: number;
  sugarLevel: number;
  heartRate: number;
  activityMinutes: number;
  bmi: number;
}

export interface FirstAidScenario {
  id: string;
  title: Record<Language, string>;
  category: Record<Language, string>;
  icon: string;
  steps: Record<Language, string[]>;
  dos: Record<Language, string[]>;
  donts: Record<Language, string[]>;
  emergencyLevel: 'high' | 'medium' | 'low';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
