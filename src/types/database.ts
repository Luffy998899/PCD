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
    }
    Views: Record<never, never>
    Functions: Record<never, never>
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}
