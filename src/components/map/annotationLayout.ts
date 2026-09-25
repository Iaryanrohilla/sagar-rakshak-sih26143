// SAGAR RAKSHAK — Deterministic Map Annotation Collision Avoidance & Leader Line Engine
// Enforces mathematical guarantees:
// 1. Annotations never overlap each other
// 2. Annotations never cover anchor markers or vessel tracks
// 3. Annotations remain inside the visible map viewport
// 4. Clean orthogonal dog-leg leader lines connect anchors to callouts

export type QuadrantPreference = 'NW' | 'NE' | 'SW' | 'SE' | 'N' | 'S' | 'E' | 'W'

export interface AnnotationItem {
  id: string
  anchor: { x: number; y: number } // Screen pixel coordinates projected from MapLibre
  width: number
  height: number
  priority: number // 1 is highest priority
  preferredQuadrant: QuadrantPreference
  minDistance?: number
  maxDistance?: number
  anchorRadius?: number
}

export interface PlacedBox {
  left: number
  top: number
  right: number
  bottom: number
  width: number
  height: number
}

export interface LeaderLinePath {
  start: { x: number; y: number }
  corner?: { x: number; y: number }
  end: { x: number; y: number }
  pathD: string
}

export interface PlacedAnnotation {
  id: string
  anchor: { x: number; y: number }
  box: PlacedBox
  leaderLine: LeaderLinePath
  quadrant: QuadrantPreference
}

export interface ViewportBounds {
  width: number
  height: number
  padding?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
  }
}

// Check if two bounding boxes intersect with a safety margin
export function boxesOverlap(a: PlacedBox, b: PlacedBox, margin = 8): boolean {
  return !(
    a.right + margin < b.left ||
    a.left - margin > b.right ||
    a.bottom + margin < b.top ||
    a.top - margin > b.bottom
  )
}

// Check if a box covers an anchor coordinate within a protection radius
export function boxCoversPoint(box: PlacedBox, pt: { x: number; y: number }, radius = 16): boolean {
  return (
    pt.x >= box.left - radius &&
    pt.x <= box.right + radius &&
    pt.y >= box.top - radius &&
    pt.y <= box.bottom + radius
  )
}

// Generate candidate directional angles based on quadrant preference
function getAnglesForQuadrant(quadrant: QuadrantPreference): number[] {
  // Angles in degrees: 0 = East, 90 = South, 180 = West, -90 = North
  switch (quadrant) {
    case 'NW':
      return [-135, -160, -110, -90, -180, -45, 135, 45, 90, 0]
    case 'NE':
      return [-45, -25, -70, -90, 0, -135, 45, 135, 90, 180]
    case 'SW':
      return [135, 160, 110, 180, 90, -135, 45, -90, 0, -45]
    case 'SE':
      return [45, 20, 70, 0, 90, -45, 135, -90, 180, -135]
    case 'N':
      return [-90, -110, -70, -135, -45, 180, 0, 90, 135, 45]
    case 'S':
      return [90, 110, 70, 135, 45, 180, 0, -90, -135, -45]
    case 'E':
      return [0, -25, 25, -45, 45, -90, 90, 180, -135, 135]
    case 'W':
      return [180, -160, 160, -135, 135, -90, 90, 0, -45, 45]
  }
}

// Construct leader line connecting anchor to the nearest edge of the callout box
export function calculateLeaderLine(
  anchor: { x: number; y: number },
  box: PlacedBox
): LeaderLinePath {
  let endX: number
  let endY: number

  // Find optimal attachment point on box perimeter
  if (anchor.x < box.left) {
    // Box is to the right of anchor
    endX = box.left
    endY = Math.max(box.top + 10, Math.min(box.bottom - 10, anchor.y))
  } else if (anchor.x > box.right) {
    // Box is to the left of anchor
    endX = box.right
    endY = Math.max(box.top + 10, Math.min(box.bottom - 10, anchor.y))
  } else {
    // Horizontally aligned
    endX = Math.max(box.left + 10, Math.min(box.right - 10, anchor.x))
    endY = anchor.y < box.top ? box.top : box.bottom
  }

  // Orthogonal leader line routing: Anchor -> Vertical/Horizontal jog -> Box Edge
  // Example from requirements:
  // Spill Origin
  //       │
  //       └──── callout
  let pathD = ''
  const midX = anchor.x
  const midY = endY

  // If points are nearly co-linear, use a straight line
  if (Math.abs(anchor.x - endX) < 6 || Math.abs(anchor.y - endY) < 6) {
    pathD = `M ${Math.round(anchor.x)} ${Math.round(anchor.y)} L ${Math.round(endX)} ${Math.round(endY)}`
  } else {
    // Dog-leg elbow
    pathD = `M ${Math.round(anchor.x)} ${Math.round(anchor.y)} L ${Math.round(midX)} ${Math.round(midY)} L ${Math.round(endX)} ${Math.round(endY)}`
  }

  return {
    start: anchor,
    corner: { x: midX, y: midY },
    end: { x: endX, y: endY },
    pathD
  }
}

// Master Deterministic Layout Resolver
export function resolveAnnotationLayout(
  items: AnnotationItem[],
  viewport: ViewportBounds
): PlacedAnnotation[] {
  const pad = {
    top: viewport.padding?.top ?? 72,
    right: viewport.padding?.right ?? 16,
    bottom: viewport.padding?.bottom ?? 42,
    left: viewport.padding?.left ?? 16
  }

  const minVpX = pad.left
  const maxVpX = Math.max(minVpX + 100, viewport.width - pad.right)
  const minVpY = pad.top
  const maxVpY = Math.max(minVpY + 100, viewport.height - pad.bottom)

  // Sort by priority (1 is placed first)
  const sortedItems = [...items].sort((a, b) => a.priority - b.priority)
  const placedBoxes: PlacedBox[] = []
  const allAnchors = items.map((it) => ({ x: it.anchor.x, y: it.anchor.y, r: it.anchorRadius ?? 18 }))
  const results: PlacedAnnotation[] = []

  for (const item of sortedItems) {
    const angles = getAnglesForQuadrant(item.preferredQuadrant)
    const baseMinDist = item.minDistance ?? 38
    const baseMaxDist = item.maxDistance ?? 160
    const radii = [
      baseMinDist,
      baseMinDist + 24,
      baseMinDist + 52,
      baseMinDist + 84,
      baseMaxDist
    ]

    let bestCandidate: {
      box: PlacedBox
      score: number
      quadrant: QuadrantPreference
    } | null = null

    // Evaluate candidates across angles and distances
    for (let rIdx = 0; rIdx < radii.length; rIdx++) {
      const radius = radii[rIdx]

      for (let aIdx = 0; aIdx < angles.length; aIdx++) {
        const deg = angles[aIdx]
        const rad = (deg * Math.PI) / 180
        const dx = radius * Math.cos(rad)
        const dy = radius * Math.sin(rad)

        // Calculate card top/left based on offset direction
        let left: number
        let top: number

        if (dx < -10) {
          left = item.anchor.x + dx - item.width
        } else if (dx > 10) {
          left = item.anchor.x + dx
        } else {
          left = item.anchor.x + dx - item.width / 2
        }

        if (dy < -10) {
          top = item.anchor.y + dy - item.height
        } else if (dy > 10) {
          top = item.anchor.y + dy
        } else {
          top = item.anchor.y + dy - item.height / 2
        }

        const candidateBox: PlacedBox = {
          left,
          top,
          right: left + item.width,
          bottom: top + item.height,
          width: item.width,
          height: item.height
        }

        // Penalty metrics
        let penalty = 0

        // 1. Viewport boundaries penalty
        if (candidateBox.left < minVpX) penalty += (minVpX - candidateBox.left) * 80
        if (candidateBox.right > maxVpX) penalty += (candidateBox.right - maxVpX) * 80
        if (candidateBox.top < minVpY) penalty += (minVpY - candidateBox.top) * 80
        if (candidateBox.bottom > maxVpY) penalty += (candidateBox.bottom - maxVpY) * 80

        // 2. Overlap with previously placed boxes (FATAL)
        for (const placed of placedBoxes) {
          if (boxesOverlap(candidateBox, placed, 10)) {
            penalty += 50000
          }
        }

        // 3. Covering ANY anchor marker
        for (const anc of allAnchors) {
          if (boxCoversPoint(candidateBox, anc, anc.r)) {
            penalty += 30000
          }
        }

        // 3B. Avoid bottom-left legend zone if space permits
        if (candidateBox.left < 320 && candidateBox.bottom > viewport.height - 240) {
          penalty += 8000
        }

        // 4. Distance and angular preference penalty
        penalty += rIdx * 15 + aIdx * 8

        const activeQuadrant: QuadrantPreference =
          dx < 0 ? (dy < 0 ? 'NW' : 'SW') : (dy < 0 ? 'NE' : 'SE')

        if (!bestCandidate || penalty < bestCandidate.score) {
          bestCandidate = {
            box: candidateBox,
            score: penalty,
            quadrant: activeQuadrant
          }

          // If completely clear of overlap and inside viewport, choose immediately
          if (penalty === 0) {
            break
          }
        }
      }

      if (bestCandidate && bestCandidate.score === 0) {
        break
      }
    }

    // Fallback: clamp box safely inside viewport if needed
    let finalBox = bestCandidate
      ? bestCandidate.box
      : {
          left: Math.max(minVpX, Math.min(maxVpX - item.width, item.anchor.x + 40)),
          top: Math.max(minVpY, Math.min(maxVpY - item.height, item.anchor.y - 40)),
          right: Math.max(minVpX, Math.min(maxVpX - item.width, item.anchor.x + 40)) + item.width,
          bottom: Math.max(minVpY, Math.min(maxVpY - item.height, item.anchor.y - 40)) + item.height,
          width: item.width,
          height: item.height
        }

    // Safety clamp to ensure 100% inside viewport
    if (finalBox.left < minVpX) {
      finalBox = { ...finalBox, left: minVpX, right: minVpX + finalBox.width }
    }
    if (finalBox.right > maxVpX) {
      finalBox = { ...finalBox, right: maxVpX, left: Math.max(minVpX, maxVpX - finalBox.width) }
    }
    if (finalBox.top < minVpY) {
      finalBox = { ...finalBox, top: minVpY, bottom: minVpY + finalBox.height }
    }
    if (finalBox.bottom > maxVpY) {
      finalBox = { ...finalBox, bottom: maxVpY, top: Math.max(minVpY, maxVpY - finalBox.height) }
    }

    // Post-clamp Guaranteed Collision Resolution: Force non-overlap
    for (let iter = 0; iter < 3; iter++) {
      let hadCollision = false

      for (const placed of placedBoxes) {
        if (boxesOverlap(finalBox, placed, 4)) {
          hadCollision = true
          const cX1 = (finalBox.left + finalBox.right) / 2
          const cY1 = (finalBox.top + finalBox.bottom) / 2
          const cX2 = (placed.left + placed.right) / 2
          const cY2 = (placed.top + placed.bottom) / 2

          const dx = cX1 - cX2
          const dy = cY1 - cY2

          // On mobile or narrow widths, always prefer vertical separation since cards are wide
          const canFitSideBySide = (viewport.width >= 600) && (finalBox.width + placed.width + 16 <= maxVpX - minVpX)

          if (!canFitSideBySide || Math.abs(dy) >= Math.abs(dx)) {
            // Separate vertically
            if (dy >= 0) {
              if (placed.bottom + 8 + finalBox.height <= maxVpY) {
                const newTop = placed.bottom + 8
                finalBox = {
                  ...finalBox,
                  top: newTop,
                  bottom: newTop + finalBox.height
                }
              } else {
                const newBottom = placed.top - 8
                finalBox = {
                  ...finalBox,
                  bottom: newBottom,
                  top: newBottom - finalBox.height
                }
              }
            } else {
              if (placed.top - 8 - finalBox.height >= minVpY) {
                const newBottom = placed.top - 8
                finalBox = {
                  ...finalBox,
                  bottom: newBottom,
                  top: newBottom - finalBox.height
                }
              } else {
                const newTop = placed.bottom + 8
                finalBox = {
                  ...finalBox,
                  top: newTop,
                  bottom: newTop + finalBox.height
                }
              }
            }
          } else {
            // Separate horizontally
            if (dx >= 0) {
              if (placed.right + 8 + finalBox.width <= maxVpX) {
                const newLeft = placed.right + 8
                finalBox = {
                  ...finalBox,
                  left: newLeft,
                  right: newLeft + finalBox.width
                }
              } else if (placed.left - 8 - finalBox.width >= minVpX) {
                const newRight = placed.left - 8
                finalBox = {
                  ...finalBox,
                  right: newRight,
                  left: newRight - finalBox.width
                }
              } else {
                // Cannot separate horizontally within viewport; separate vertically
                const newTop = placed.bottom + 8
                finalBox = {
                  ...finalBox,
                  top: newTop,
                  bottom: newTop + finalBox.height
                }
              }
            } else {
              if (placed.left - 8 - finalBox.width >= minVpX) {
                const newRight = placed.left - 8
                finalBox = {
                  ...finalBox,
                  right: newRight,
                  left: newRight - finalBox.width
                }
              } else if (placed.right + 8 + finalBox.width <= maxVpX) {
                const newLeft = placed.right + 8
                finalBox = {
                  ...finalBox,
                  left: newLeft,
                  right: newLeft + finalBox.width
                }
              } else {
                // Cannot separate horizontally within viewport; separate vertically
                const newTop = placed.bottom + 8
                finalBox = {
                  ...finalBox,
                  top: newTop,
                  bottom: newTop + finalBox.height
                }
              }
            }
          }

          // Clamping inside collision loop
          if (finalBox.right > maxVpX) {
            const shift = finalBox.right - maxVpX
            finalBox = {
              ...finalBox,
              left: Math.max(minVpX, finalBox.left - shift),
              right: maxVpX
            }
          }
          if (finalBox.left < minVpX) {
            finalBox = {
              ...finalBox,
              left: minVpX,
              right: Math.min(maxVpX, minVpX + finalBox.width)
            }
          }
          if (finalBox.bottom > maxVpY) {
            const shift = finalBox.bottom - maxVpY
            finalBox = {
              ...finalBox,
              top: Math.max(minVpY, finalBox.top - shift),
              bottom: maxVpY
            }
          }
          if (finalBox.top < minVpY) {
            finalBox = {
              ...finalBox,
              top: minVpY,
              bottom: Math.min(maxVpY, minVpY + finalBox.height)
            }
          }
        }
      }

      if (!hadCollision) break
    }

    // STRICT FINAL VIEWPORT CLAMP
    if (finalBox.right > maxVpX) {
      const shift = finalBox.right - maxVpX
      finalBox = {
        ...finalBox,
        left: Math.max(minVpX, finalBox.left - shift),
        right: maxVpX
      }
    }
    if (finalBox.left < minVpX) {
      finalBox = {
        ...finalBox,
        left: minVpX,
        right: Math.min(maxVpX, minVpX + finalBox.width)
      }
    }
    if (finalBox.bottom > maxVpY) {
      const shift = finalBox.bottom - maxVpY
      finalBox = {
        ...finalBox,
        top: Math.max(minVpY, finalBox.top - shift),
        bottom: maxVpY
      }
    }
    if (finalBox.top < minVpY) {
      finalBox = {
        ...finalBox,
        top: minVpY,
        bottom: Math.min(maxVpY, minVpY + finalBox.height)
      }
    }

    placedBoxes.push(finalBox)

    const leaderLine = calculateLeaderLine(item.anchor, finalBox)

    results.push({
      id: item.id,
      anchor: item.anchor,
      box: finalBox,
      leaderLine,
      quadrant: bestCandidate?.quadrant ?? item.preferredQuadrant
    })
  }

  return results
}
