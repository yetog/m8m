'use client'

import React from 'react'
import { NodeData } from '@/app/types/types'

interface NodeDetailsProps {
  node: NodeData | null
}

export default function NodeDetails({ node }: NodeDetailsProps) {
  if (!node) {
    return (
      <div className="p-4 border rounded-md bg-muted">
        <p className="text-muted-foreground text-sm">Select a node to view details</p>
      </div>
    )
  }

  return (
    <div className="p-4 border rounded-md bg-card">
      <h3 className="text-lg font-medium mb-2">{node.label}</h3>
      {node.details && (
        <p className="text-sm text-card-foreground">{node.details}</p>
      )}
      {!node.details && (
        <p className="text-sm text-muted-foreground italic">No additional details available</p>
      )}
    </div>
  )
} 