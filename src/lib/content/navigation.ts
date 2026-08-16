import { cache } from 'react'

import { footerColumns, primaryNavigation, type NavGroup } from '@/data/navigation'
import { getDivisions, getTherapies } from '@/lib/content/products'

/**
 * Navigation resolved against real content.
 *
 * The static config in `data/navigation.ts` defines the site's structure. The
 * entries under Divisions and Products describe *what the company actually
 * has*, which is a business fact — so they are replaced with published records
 * rather than assumed (Rules.md §1). A section with no published records shows
 * no dropdown and links to its landing page, which explains the position
 * honestly.
 */
async function resolveGroups(groups: NavGroup[]): Promise<NavGroup[]> {
  const [divisions, therapies] = await Promise.all([getDivisions(), getTherapies()])

  return groups.map((group) => {
    if (group.href === '/divisions') {
      return {
        ...group,
        links: divisions.map((division) => ({
          label: division.name,
          href: `/divisions/${division.slug}`,
        })),
      }
    }

    if (group.href === '/products') {
      return {
        ...group,
        links: [
          ...group.links,
          ...therapies.slice(0, 8).map((therapy) => ({
            label: therapy.name,
            href: `/products/therapy/${therapy.slug}`,
          })),
        ],
      }
    }

    return group
  })
}

export const getPrimaryNavigation = cache(
  async (): Promise<NavGroup[]> => resolveGroups(primaryNavigation),
)

export const getFooterColumns = cache(
  async (): Promise<NavGroup[]> => resolveGroups(footerColumns),
)
