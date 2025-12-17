import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import mmkvStorage from './mmkvStorage';

interface OnboardingData {
  step1: {
    status: string;
  };
  step2: {
    id?: number | null;
    profile: string | null;
    firstname: string | null;
    lastname: string | null;
    dob: string | null;
    phone: string | null;
    father: string | null;
    township: string | null;
    division: string | null;
    password: string | null;
    confirmpwd: string | null;
    nrcTownship: string | null;
    email?: string | null;
    // age?: string | null;
    gender?: string | null;
    nrcCode?: string | null;
    nrcType?: string | null;
    nrcNumber?: string | null;
    address?: string | null;
    school?: string | null;
    schoolClass?: string | null;
    schooladdress?: string | null;
    degree?: string | null;
    date?: string | null;
    institution?: string | null;
    position?: string | null;
    department?: string | null;
    company?: string | null;
    education?: string | null;
    interest?: string | null;
    other_interests?: string | null;
    reason?: string | null;
  };
  step3: {
    paymentMethod: string;
  };
}

interface OnboardingStore {
  currentStep: number;
  completeStep: number | null;
  setCompleteStep: (step: number) => void;
  data: OnboardingData;
  setStep: (step: number) => void;
  updateData: (step: keyof OnboardingData, newData: Partial<OnboardingData[keyof OnboardingData]>) => void;
  resetOnboarding: () => void;
}

const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      currentStep: 1, // Start at Step 1
      completeStep: null,
      data: {
        step1: { status: 'student' },
        step2: { profile: null, firstname: null, lastname: null, dob: null, phone: null, father: null, township: null, division: null, password: null, confirmpwd: null, nrcTownship: null },
        step3: { paymentMethod: '' },
      },
      setStep: (step) => set({ currentStep: step }),
      setCompleteStep: (step) => set({ completeStep: step }),
      updateData: (step, newData) =>
        set((state) => ({
          data: {
            ...state.data,
            [step]: { ...state.data[step], ...newData }, // Merge new data
          },
        })),
      resetOnboarding: () =>
        set({
          currentStep: 1,
          completeStep: null,
          data: {
            step1: { status: 'student' },
            step2: { profile: null, firstname: null, lastname: null, dob: null, phone: null, father: null, township: null, division: null, password: null, confirmpwd: null, nrcTownship: null },
            step3: { paymentMethod: '' },
          },
        }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);

export default useOnboardingStore;
