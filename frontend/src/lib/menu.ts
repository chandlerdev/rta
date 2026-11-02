// Central config for the sidebar shell: maps route id -> inner view + which
// menu items each role (super / normal / doctor) can see.
// Derived directly from side-bar.component.html's [ngSwitch] + [hidden] rules.

export type LoginType = 'super' | 'normal' | 'doctor';

export interface MenuItem {
  id: string; // sideData id, used in URL /<base>/<id>/<enc>
  ck: string; // query param ck=
  label: string;
  icon: string; // font-awesome class
  roles: LoginType[]; // which roles see this item
  // gating from *ngIf="datashow == '1' && PlanActive == '1'" etc.
  requirePlanActive?: boolean; // only when datashow==1 && PlanActive==1
  requirePlanInactive?: boolean; // only when datashow==0 && PlanActive==0
  external?: boolean; // opens a new tab instead of navigating
  externalUrl?: string;
}

export const MENU: MenuItem[] = [
  { id: '0', ck: '', label: 'Dashboard', icon: 'fa-tachometer', roles: ['super', 'normal', 'doctor'] },
  { id: '13', ck: 'plan', label: 'Payment Method', icon: 'fa-text-width', roles: ['normal'] },
  { id: '1', ck: 'hospital', label: "Office", icon: 'fa-hospital-o', roles: ['super'] },
  { id: '2', ck: 'blockedhospital', label: "Blocked Office", icon: 'fa-times-circle', roles: ['super'] },
  { id: '4', ck: 'doctor', label: 'Doctor', icon: 'fa-user-md', roles: ['normal'], requirePlanActive: true },
  { id: '5', ck: 'appointment', label: 'Appointment', icon: 'fa-file-text', roles: ['doctor'] },
  { id: '15', ck: 'cal_appointment', label: 'Calendar Appointment', icon: 'fa-file-text', roles: ['doctor'] },
  { id: '6', ck: 'blockeddoctor', label: 'Blocked Doctor', icon: 'fa-medkit', roles: ['normal'], requirePlanActive: true },
  { id: '7', ck: 'apptcomplete', label: 'Appointment Completed', icon: 'fa-check-square', roles: ['doctor'] },
  { id: '8', ck: '', label: 'Appointment', icon: 'fa-file-text', roles: ['normal'], requirePlanActive: true },
  { id: '9', ck: '', label: 'Appointment Completed', icon: 'fa-check-square', roles: ['normal'], requirePlanActive: true },
  { id: '10', ck: '', label: 'No Show Appointments', icon: 'fa-question-circle', roles: ['normal'], requirePlanActive: true },
  { id: '21', ck: 'patient_roster', label: 'Patient Roster', icon: 'fa-user-md', roles: ['normal'], requirePlanActive: true },
  // Hidden for now — re-enable when these screens are needed:
  // { id: '16', ck: 'surgery_list', label: 'Surgery List', icon: 'fa-user-md', roles: ['normal'], requirePlanActive: true },
  // { id: '17', ck: 'pharmacy_list', label: 'Pharmacy List', icon: 'fa-user-md', roles: ['normal'], requirePlanActive: true },
  // { id: '18', ck: 'surgery_appt', label: 'Surgery Appointments', icon: 'fa-user-md', roles: ['normal'], requirePlanActive: true },
  // Hidden for now — re-enable when these screens are needed:
  // { id: '19', ck: 'surgery_appointment', label: 'Surgery Appointment', icon: 'fa-file-text', roles: ['doctor'] },
  // { id: '12', ck: '', label: 'Templates', icon: 'fa-text-width', roles: ['doctor'] },
  { id: '11', ck: '', label: 'No Show Appointments', icon: 'fa-question-circle', roles: ['doctor'] },
  { id: '14', ck: 'adminplan', label: 'Plan Details', icon: 'fa-text-width', roles: ['super'] },
  // Hidden for now — re-enable when this screen is needed:
  // {
  //   id: '20',
  //   ck: '',
  //   label: 'SOAP Note Lookup',
  //   icon: 'fa-sticky-note',
  //   roles: ['super'],
  //   external: true,
  //   externalUrl: 'https://trackappt.desss-portfolio.com/soapmodule/lookup',
  // },
];

// id -> ck (used to resolve which inner view to render when only id is in the URL)
export const ID_TO_CK: Record<string, string> = {
  '0': 'dashboard',
  '1': 'hospital',
  '2': 'blockedhospital',
  '4': 'doctor',
  '5': 'appointment',
  '6': 'blockeddoctor',
  '7': 'apptcomplete',
  '8': 'hosappt',
  '9': 'hosapptcomplete',
  '10': 'noshow',
  '11': 'noshowdoctor',
  '12': 'template',
  '13': 'plan',
  '14': 'adminplan',
  '15': 'cal_appointment',
  '16': 'surgery_list',
  '17': 'pharmacy_list',
  '18': 'surgery_appt',
  '19': 'surgery_appointment',
  '21': 'patient_roster',
};

// Base path per role
export const ROLE_BASE: Record<LoginType, string> = {
  super: 'home',
  normal: 'homes',
  doctor: 'doctor',
};
