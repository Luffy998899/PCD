/**
 * Hand-maintained database types.
 *
 * Tables are added here as each implementation phase introduces them
 * (Architecture.md §7). Keep this file in sync with `supabase/migrations`.
 */

type TableDef<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row
  Insert: Insert
  Update: Update
  Relationships: []
}

/** Publication state shared by every content table (Rules.md §22). */
export type PublishStatus = 'draft' | 'published' | 'archived'

/**
 * Optional provenance columns (Architecture.md §9). Any record carrying a
 * factual claim supports these so an admin can verify it before publishing.
 */
export type Provenance = {
  source_reference: string | null
  source_document_url: string | null
  source_note: string | null
  verified_by: string | null
  verified_at: string | null
  valid_until: string | null
}

export type SiteSettingsRow = {
  id: string
  legal_name: string | null
  brand_name: string | null
  tagline: string | null
  short_description: string | null
  cin: string | null
  gst: string | null
  pan: string | null
  drug_licence_number: string | null
  fssai_number: string | null
  registered_address: string | null
  corporate_address: string | null
  primary_email: string | null
  primary_phone: string | null
  whatsapp_number: string | null
  grievance_officer_name: string | null
  grievance_officer_email: string | null
  grievance_officer_phone: string | null
  logo_url: string | null
  founded_year: number | null
  product_catalogue_url: string | null
  product_catalogue_updated_on: string | null
  updated_at: string
}

export type OfficeRow = {
  id: string
  name: string
  office_type: 'registered' | 'corporate' | 'plant' | 'branch' | 'warehouse'
  address: string
  city: string | null
  state: string | null
  postal_code: string | null
  country: string
  phone: string | null
  email: string | null
  map_url: string | null
  display_order: number
  status: PublishStatus
  created_at: string
}

export type DepartmentContactRow = {
  id: string
  department: string
  description: string | null
  email: string | null
  phone: string | null
  display_order: number
  status: PublishStatus
}

export type EnquiryType =
  | 'general'
  | 'business'
  | 'product'
  | 'partner'
  | 'grievance'
  | 'pharmacovigilance'
  | 'career'

export type EnquiryRow = {
  id: string
  enquiry_type: EnquiryType
  name: string
  email: string
  phone: string
  organisation: string | null
  city: string | null
  state: string | null
  country: string | null
  subject: string | null
  message: string
  product_reference: string | null
  therapy_reference: string | null
  division_reference: string | null
  consent: boolean
  source_page: string | null
  utm: Record<string, string> | null
  status: 'new' | 'in_progress' | 'closed' | 'spam'
  internal_notes: string | null
  created_at: string
}

export type EnquiryInsert = Omit<EnquiryRow, 'id' | 'created_at' | 'status' | 'internal_notes'> & {
  status?: EnquiryRow['status']
}

// ---------------------------------------------------------------------------
// Phase 2 — About & corporate authority
// ---------------------------------------------------------------------------

export type ContentBlockRow = Provenance & {
  id: string
  page_key: string
  block_key: string
  heading: string | null
  body: string | null
  display_order: number
  status: PublishStatus
  created_at: string
  updated_at: string
}

export type PersonCategory = 'founder' | 'board' | 'leadership'

export type PersonRow = {
  id: string
  name: string
  slug: string
  designation: string
  category: PersonCategory
  qualification: string | null
  bio: string | null
  message: string | null
  photo_url: string | null
  photo_alt: string | null
  linkedin_url: string | null
  display_order: number
  status: PublishStatus
  source_reference: string | null
  verified_by: string | null
  verified_at: string | null
  created_at: string
  updated_at: string
}

export type MilestoneRow = {
  id: string
  year: number
  month: number | null
  title: string
  description: string | null
  display_order: number
  status: PublishStatus
  source_reference: string | null
  source_document_url: string | null
  verified_by: string | null
  verified_at: string | null
  created_at: string
}

export type CoreValueRow = {
  id: string
  title: string
  description: string
  icon: string | null
  display_order: number
  status: PublishStatus
}

export type AwardRow = {
  id: string
  title: string
  awarded_by: string | null
  year: number | null
  description: string | null
  image_url: string | null
  document_url: string | null
  display_order: number
  status: PublishStatus
  source_reference: string | null
  source_document_url: string | null
  verified_by: string | null
  verified_at: string | null
  created_at: string
}

// ---------------------------------------------------------------------------
// Phase 3 — Science, manufacturing & quality
// ---------------------------------------------------------------------------

export type FacilityRow = Provenance & {
  id: string
  name: string
  slug: string
  facility_type: 'manufacturing' | 'laboratory' | 'warehouse' | 'rnd'
  summary: string | null
  description: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string
  commissioned_year: number | null
  hero_image_url: string | null
  hero_image_alt: string | null
  display_order: number
  status: PublishStatus
  created_at: string
  updated_at: string
}

export type FacilitySpecRow = {
  id: string
  facility_id: string
  category: 'general' | 'production' | 'quality' | 'utilities'
  label: string
  value: string
  unit: string | null
  display_order: number
  status: PublishStatus
  source_reference: string | null
  source_document_url: string | null
  verified_by: string | null
  verified_at: string | null
  created_at: string
}

export type CertificateRow = {
  id: string
  name: string
  issuing_body: string
  certificate_number: string | null
  scope: string | null
  issued_on: string | null
  valid_until: string | null
  document_url: string | null
  image_url: string | null
  category: 'quality' | 'regulatory' | 'product' | 'environment' | 'other'
  display_order: number
  status: PublishStatus
  source_reference: string | null
  source_note: string | null
  verified_by: string | null
  verified_at: string | null
  created_at: string
  updated_at: string
}

export type QualityTestRow = {
  id: string
  name: string
  description: string | null
  equipment: string | null
  stage: 'raw_material' | 'in_process' | 'finished_product' | 'stability' | 'packaging'
  display_order: number
  status: PublishStatus
  source_reference: string | null
  created_at: string
}

export type RegulatoryItemRow = {
  id: string
  title: string
  description: string | null
  reference_number: string | null
  document_url: string | null
  category: 'compliance' | 'licence' | 'policy' | 'submission'
  display_order: number
  status: PublishStatus
  source_reference: string | null
  source_document_url: string | null
  verified_by: string | null
  verified_at: string | null
  valid_until: string | null
  created_at: string
}

export type PharmacovigilanceReportRow = {
  id: string
  report_type: 'adverse_event' | 'product_complaint'
  reporter_name: string
  reporter_email: string
  reporter_phone: string
  reporter_category: 'patient' | 'physician' | 'pharmacist' | 'other_hcp' | 'other'
  product_name: string | null
  batch_number: string | null
  expiry_date: string | null
  event_description: string
  event_started_on: string | null
  patient_age_group: string | null
  patient_sex: string | null
  consent: boolean
  source_page: string | null
  status: EnquiryRow['status']
  internal_notes: string | null
  created_at: string
}

export type PharmacovigilanceReportInsert = Omit<
  PharmacovigilanceReportRow,
  'id' | 'created_at' | 'status' | 'internal_notes'
>

// ---------------------------------------------------------------------------
// Phase 4 — Products
// ---------------------------------------------------------------------------

export type DivisionRow = {
  id: string
  name: string
  slug: string
  summary: string | null
  description: string | null
  hero_image_url: string | null
  hero_image_alt: string | null
  display_order: number
  status: PublishStatus
  seo_title: string | null
  seo_description: string | null
  created_at: string
  updated_at: string
}

export type TherapyRow = {
  id: string
  name: string
  slug: string
  summary: string | null
  description: string | null
  display_order: number
  status: PublishStatus
  seo_title: string | null
  seo_description: string | null
  created_at: string
  updated_at: string
}

export type DosageFormRow = {
  id: string
  name: string
  slug: string
  description: string | null
  display_order: number
  status: PublishStatus
  created_at: string
}

export type ProductRow = {
  id: string
  brand_name: string
  slug: string
  generic_composition: string
  strength: string | null
  pack_size: string | null
  therapy_id: string | null
  division_id: string | null
  dosage_form_id: string | null
  summary: string | null
  indications: string | null
  directions: string | null
  warnings: string | null
  contraindications: string | null
  side_effects: string | null
  storage: string | null
  manufactured_by: string | null
  marketed_by: string | null
  licence_number: string | null
  prescribing_information_url: string | null
  is_prescription_only: boolean
  status: PublishStatus
  seo_title: string | null
  seo_description: string | null
  source_reference: string | null
  verified_by: string | null
  verified_at: string | null
  created_at: string
  updated_at: string
}

export type ProductImageRow = {
  id: string
  product_id: string
  image_url: string
  alt_text: string
  image_type: 'pack_front' | 'pack_back' | 'label' | 'other'
  display_order: number
  created_at: string
}

export type ProductDocumentRow = {
  id: string
  product_id: string
  title: string
  document_url: string
  document_type: 'prescribing_information' | 'coa' | 'leaflet' | 'other'
  display_order: number
  status: PublishStatus
  created_at: string
}

// ---------------------------------------------------------------------------
// Phase 6 — Network & reach
// ---------------------------------------------------------------------------

export type NetworkStateRow = {
  id: string
  name: string
  slug: string
  region: 'north' | 'south' | 'east' | 'west' | 'central' | 'north-east' | null
  since_year: number | null
  notes: string | null
  display_order: number
  status: PublishStatus
  source_reference: string | null
  verified_by: string | null
  verified_at: string | null
  created_at: string
}

export type NetworkDistrictRow = {
  id: string
  state_id: string
  name: string
  status: PublishStatus
  source_reference: string | null
  verified_by: string | null
  verified_at: string | null
  created_at: string
}

export type NetworkCountryRow = {
  id: string
  name: string
  slug: string
  iso_code: string | null
  since_year: number | null
  registration_status:
    | 'registered'
    | 'under_registration'
    | 'export_only'
    | 'not_applicable'
    | null
  notes: string | null
  display_order: number
  status: PublishStatus
  source_reference: string | null
  source_document_url: string | null
  verified_by: string | null
  verified_at: string | null
  created_at: string
}

export type PartnerRow = {
  id: string
  name: string
  partner_type: 'distributor' | 'stockist' | 'cnf' | 'institutional'
  city: string | null
  state_id: string | null
  contact_person: string | null
  phone: string | null
  email: string | null
  address: string | null
  consent_to_publish: boolean
  display_order: number
  status: PublishStatus
  verified_by: string | null
  verified_at: string | null
  created_at: string
}

// ---------------------------------------------------------------------------
// Phase 7 — Media, blogs & downloads
// ---------------------------------------------------------------------------

export type ArticleType = 'blog' | 'news' | 'press_release'

export type ArticleCategoryRow = {
  id: string
  name: string
  slug: string
  description: string | null
  display_order: number
  status: PublishStatus
}

export type ArticleRow = {
  id: string
  article_type: ArticleType
  title: string
  slug: string
  category_id: string | null
  author_id: string | null
  author_name: string | null
  excerpt: string | null
  body: string
  hero_image_url: string | null
  hero_image_alt: string | null
  medically_reviewed: boolean
  reviewer_name: string | null
  reviewer_credential: string | null
  reviewed_on: string | null
  related_therapy_id: string | null
  related_product_id: string | null
  source_url: string | null
  published_at: string | null
  status: PublishStatus
  seo_title: string | null
  seo_description: string | null
  created_at: string
  updated_at: string
}

export type GalleryItemRow = {
  id: string
  title: string
  alt_text: string
  image_url: string
  category: 'facility' | 'team' | 'event' | 'product' | 'other'
  captured_on: string | null
  display_order: number
  status: PublishStatus
  created_at: string
}

export type DownloadRow = {
  id: string
  title: string
  description: string | null
  file_url: string
  file_type: string
  file_size_kb: number | null
  category: 'general' | 'product' | 'quality' | 'corporate' | 'partner'
  display_order: number
  status: PublishStatus
  updated_on: string | null
  created_at: string
}

export type EventRow = {
  id: string
  title: string
  description: string | null
  location: string | null
  starts_on: string
  ends_on: string | null
  event_url: string | null
  image_url: string | null
  image_alt: string | null
  status: PublishStatus
  created_at: string
}

// ---------------------------------------------------------------------------
// Phase 8 — Careers
// ---------------------------------------------------------------------------

export type JobOpeningRow = {
  id: string
  title: string
  slug: string
  department: string
  location: string
  employment_type: 'full_time' | 'part_time' | 'contract' | 'internship'
  experience_min: number | null
  experience_max: number | null
  positions: number | null
  summary: string | null
  description: string
  responsibilities: string | null
  requirements: string | null
  posted_on: string
  closes_on: string | null
  hiring_status: 'open' | 'closed'
  status: PublishStatus
  seo_title: string | null
  seo_description: string | null
  created_at: string
  updated_at: string
}

export type JobApplicationRow = {
  id: string
  job_opening_id: string | null
  applied_for: string
  name: string
  email: string
  phone: string
  current_location: string | null
  experience_years: number | null
  current_employer: string | null
  notice_period: string | null
  message: string | null
  cv_storage_path: string | null
  cv_file_name: string | null
  consent: boolean
  source_page: string | null
  status: 'new' | 'shortlisted' | 'rejected' | 'hired' | 'spam'
  internal_notes: string | null
  created_at: string
}

export type JobApplicationInsert = Omit<
  JobApplicationRow,
  'id' | 'created_at' | 'status' | 'internal_notes'
>

// ---------------------------------------------------------------------------
// Phase 9 — Homepage
// ---------------------------------------------------------------------------

export type MembershipRow = {
  id: string
  name: string
  membership_number: string | null
  since_year: number | null
  logo_url: string | null
  logo_alt: string | null
  website_url: string | null
  display_order: number
  status: PublishStatus
  source_reference: string | null
  source_document_url: string | null
  verified_by: string | null
  verified_at: string | null
  created_at: string
}

export type TestimonialRow = {
  id: string
  quote: string
  author_name: string
  author_designation: string | null
  organisation: string | null
  city: string | null
  consent_on_file: boolean
  consent_recorded_on: string | null
  display_order: number
  status: PublishStatus
  verified_by: string | null
  verified_at: string | null
  created_at: string
}

// ---------------------------------------------------------------------------
// Phase 11 — Admin
// ---------------------------------------------------------------------------

export type AdminRole =
  | 'super_admin'
  | 'content_admin'
  | 'sales_admin'
  | 'hr_admin'
  | 'quality_admin'

export type AdminUserRow = {
  id: string
  email: string
  full_name: string | null
  role: AdminRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export type AuditLogRow = {
  id: string
  actor_id: string | null
  actor_email: string | null
  action: string
  entity: string
  entity_id: string | null
  summary: string | null
  created_at: string
}

export type AuditLogInsert = Omit<AuditLogRow, 'id' | 'created_at'>

export type Database = {
  public: {
    Tables: {
      site_settings: TableDef<SiteSettingsRow>
      offices: TableDef<OfficeRow>
      department_contacts: TableDef<DepartmentContactRow>
      enquiries: TableDef<EnquiryRow, EnquiryInsert>
      content_blocks: TableDef<ContentBlockRow>
      people: TableDef<PersonRow>
      milestones: TableDef<MilestoneRow>
      core_values: TableDef<CoreValueRow>
      awards: TableDef<AwardRow>
      facilities: TableDef<FacilityRow>
      facility_specs: TableDef<FacilitySpecRow>
      certificates: TableDef<CertificateRow>
      quality_tests: TableDef<QualityTestRow>
      regulatory_items: TableDef<RegulatoryItemRow>
      pharmacovigilance_reports: TableDef<
        PharmacovigilanceReportRow,
        PharmacovigilanceReportInsert
      >
      divisions: TableDef<DivisionRow>
      therapies: TableDef<TherapyRow>
      dosage_forms: TableDef<DosageFormRow>
      products: TableDef<ProductRow>
      product_images: TableDef<ProductImageRow>
      product_documents: TableDef<ProductDocumentRow>
      network_states: TableDef<NetworkStateRow>
      network_districts: TableDef<NetworkDistrictRow>
      network_countries: TableDef<NetworkCountryRow>
      partners: TableDef<PartnerRow>
      article_categories: TableDef<ArticleCategoryRow>
      articles: TableDef<ArticleRow>
      gallery_items: TableDef<GalleryItemRow>
      downloads: TableDef<DownloadRow>
      events: TableDef<EventRow>
      job_openings: TableDef<JobOpeningRow>
      job_applications: TableDef<JobApplicationRow, JobApplicationInsert>
      memberships: TableDef<MembershipRow>
      testimonials: TableDef<TestimonialRow>
      admin_users: TableDef<AdminUserRow>
      audit_log: TableDef<AuditLogRow, AuditLogInsert>
    }
    Views: Record<never, never>
    Functions: Record<never, never>
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}
