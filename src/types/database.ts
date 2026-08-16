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
    }
    Views: Record<never, never>
    Functions: Record<never, never>
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}
