import { describe, it, expect } from 'vitest'
import {
  resolveAnnotationLayout,
  boxesOverlap,
  boxCoversPoint,
  calculateLeaderLine,
  AnnotationItem,
  ViewportBounds
} from '../components/map/annotationLayout'

describe('Deterministic Annotation Layout & Collision Engine', () => {
  const mockViewport: ViewportBounds = {
    width: 1280,
    height: 720,
    padding: { top: 60, right: 20, bottom: 40, left: 20 }
  }

  it('correctly calculates bounding box intersections with safety margin', () => {
    const boxA = { left: 100, top: 100, right: 200, bottom: 180, width: 100, height: 80 }
    const boxB = { left: 190, top: 120, right: 290, bottom: 200, width: 100, height: 80 }
    const boxC = { left: 300, top: 100, right: 400, bottom: 180, width: 100, height: 80 }

    expect(boxesOverlap(boxA, boxB, 8)).toBe(true)
    expect(boxesOverlap(boxA, boxC, 8)).toBe(false)
  })

  it('detects if a candidate box would obscure an anchor marker', () => {
    const box = { left: 100, top: 100, right: 250, bottom: 180, width: 150, height: 80 }
    const anchorInside = { x: 150, y: 140 }
    const anchorOutside = { x: 300, y: 300 }

    expect(boxCoversPoint(box, anchorInside, 16)).toBe(true)
    expect(boxCoversPoint(box, anchorOutside, 16)).toBe(false)
  })

  it('guarantees that 3 closely clustered maritime annotations NEVER collide', () => {
    // Exact scenario from Mumbai High:
    // Origin, Suspect Vessel, and CPA Match are within 10-30 pixels of each other on screen
    const clusteredItems: AnnotationItem[] = [
      {
        id: 'ORIGIN',
        anchor: { x: 600, y: 350 },
        width: 210,
        height: 78,
        priority: 1,
        preferredQuadrant: 'NW',
        minDistance: 40
      },
      {
        id: 'TOP_CANDIDATE',
        anchor: { x: 595, y: 360 },
        width: 190,
        height: 38,
        priority: 2,
        preferredQuadrant: 'SW',
        minDistance: 40
      },
      {
        id: 'CPA_MATCH',
        anchor: { x: 615, y: 345 },
        width: 190,
        height: 76,
        priority: 3,
        preferredQuadrant: 'NE',
        minDistance: 45
      }
    ]

    const placed = resolveAnnotationLayout(clusteredItems, mockViewport)

    expect(placed).toHaveLength(3)

    // Check pairwise overlap among all 3 placed annotations
    for (let i = 0; i < placed.length; i++) {
      for (let j = i + 1; j < placed.length; j++) {
        const overlap = boxesOverlap(placed[i].box, placed[j].box, 4)
        expect(overlap, `Annotation ${placed[i].id} must not collide with ${placed[j].id}`).toBe(false)
      }
    }

    // Verify all 3 placed boxes are strictly within viewport boundaries
    for (const item of placed) {
      expect(item.box.left).toBeGreaterThanOrEqual(mockViewport.padding!.left!)
      expect(item.box.right).toBeLessThanOrEqual(mockViewport.width - mockViewport.padding!.right!)
      expect(item.box.top).toBeGreaterThanOrEqual(mockViewport.padding!.top!)
      expect(item.box.bottom).toBeLessThanOrEqual(mockViewport.height - mockViewport.padding!.bottom!)
    }

    // Verify leader lines connect to edge of boxes
    for (const item of placed) {
      expect(item.leaderLine.pathD).toMatch(/^M \d+ \d+ L/)
      expect(item.leaderLine.start.x).toBe(item.anchor.x)
      expect(item.leaderLine.start.y).toBe(item.anchor.y)
    }
  })

  it('adapts gracefully on small mobile viewports (390x844)', () => {
    const mobileViewport: ViewportBounds = {
      width: 390,
      height: 844,
      padding: { top: 60, right: 12, bottom: 40, left: 12 }
    }

    const items: AnnotationItem[] = [
      {
        id: 'ORIGIN',
        anchor: { x: 190, y: 400 },
        width: 160,
        height: 64,
        priority: 1,
        preferredQuadrant: 'NW',
        minDistance: 30
      },
      {
        id: 'TOP_CANDIDATE',
        anchor: { x: 200, y: 410 },
        width: 150,
        height: 32,
        priority: 2,
        preferredQuadrant: 'SW',
        minDistance: 30
      }
    ]

    const placed = resolveAnnotationLayout(items, mobileViewport)
    expect(placed).toHaveLength(2)

    // Must not overlap
    expect(boxesOverlap(placed[0].box, placed[1].box, 2)).toBe(false)

    // Must be inside mobile boundaries
    expect(placed[0].box.right).toBeLessThanOrEqual(390 - 12)
    expect(placed[1].box.right).toBeLessThanOrEqual(390 - 12)
    expect(placed[0].box.left).toBeGreaterThanOrEqual(12)
    expect(placed[1].box.left).toBeGreaterThanOrEqual(12)
  })

  it('generates crisp dog-leg leader line paths without crossing', () => {
    const anchor = { x: 400, y: 300 }
    const boxNW = { left: 200, top: 180, right: 350, bottom: 250, width: 150, height: 70 }
    const lineNW = calculateLeaderLine(anchor, boxNW)

    expect(lineNW.start.x).toBe(400)
    expect(lineNW.start.y).toBe(300)
    expect(lineNW.end.x).toBe(350) // Attaches to right edge of NW box
    expect(lineNW.pathD).toContain('M 400 300')
  })
})
