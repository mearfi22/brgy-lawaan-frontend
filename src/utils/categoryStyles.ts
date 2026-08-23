import type { AnnouncementCategory } from '../types/announcement';

export const categoryLabels: Record<AnnouncementCategory, string> = {
  vaccines: 'Vaccines',
  medicines: 'Medicines',
  maternal_child: 'Maternal & Child Health',
  senior_citizen: 'Senior Citizen Services',
  general_advisory: 'General Advisory',
};

export const categoryColors: Record<AnnouncementCategory, string> = {
  vaccines: '#2f6f4f',
  medicines: '#8a5a2b',
  maternal_child: '#a4536b',
  senior_citizen: '#2c4e6e',
  general_advisory: '#5a5548',
};